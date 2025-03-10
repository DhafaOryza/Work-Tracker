import dotenv from 'dotenv';
dotenv.config();

import tagRoutes from "./routes/tagRoutes.js";
import express from 'express';
import mongose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// <-----------------------Connected to Database----------------------->

// midleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// connect to MongoDB
mongose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.use("/api", tagRoutes);

// Define Mongoose Schema
const TaskSchema = new mongose.Schema({
    title: String,
    description: String,
    status: String,
    tags: String,
    subtags: String,
    files: [{
        filename: String,
        path: String,
        mimetype: String,
    }],
});
const Task = mongose.model('Task', TaskSchema);

// Multer storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let { tags, subtags } = req.body;

        // Ensure tags and subtags are valid directory names
        tags = tags.replace(/[^a-zA-Z0-9_-]/g, '');
        subtags = subtags.replace(/[^a-zA-Z0-9_-]/g, '');

        const uploadPath = path.join('uploads', tags, subtags);
        fs.mkdirSync(path.join(__dirname, uploadPath), { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFilename);
    }
});
const upload = multer({
    storage, fileFilter: function (req, file, cb) {
        cb(null, true);
    }
});

// Create Task
app.post('/tasks', upload.array('files'), async (req, res) => {
    try {
        const { title, description, status, tags, subtags } = req.body;
        const files = req.files.map(file => ({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
        }));

        const task = new Task({ title, description, status, tags, subtags, files });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all Tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Task
app.put('/tasks/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // First, check if the task exists Before handling file uploads
        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Proceed with file upload only if task exists
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}, upload.array('files'), async (req, res) => {
    try {
        const { title, description, status, tags, subtags } = req.body;
        const { id } = req.params;

        // Fetch the existing task
        const existingTask = await Task.findById(id);

        // Prepare the update data
        const updateData = { title, description, status, tags, subtags };

        // Append new files to existing files
        if (req.files.length > 0) {
            const newFiles = req.files.map(file => ({
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
            }));
            updateData.files = [...existingTask.files, ...newFiles];
        }

        // Update the task
        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the tasks first
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Move files to trash instead of deleting them
        if (task.files && task.files.length > 0) {
            task.files.forEach(file => {
                const oldPath = file.path;
                const trashPath = oldPath.replace('uploads', 'trash');

                // Ensure trash directory exists
                const trashDir = path.dirname(trashPath);
                if (!fs.existsSync(trashDir)) {
                    fs.mkdirSync(trashDir, { recursive: true });
                }

                // Move file to trash
                fs.renameSync(oldPath, trashPath);

                // Update the file path in the database
                file.path = trashPath;
            });

            // Save the updated task with new file paths
            await task.save();
        }

        // Deleting the task from database, but keep files in "trash"
        await Task.findByIdAndDelete(id);

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// <------------------ Trash Routes ------------------>

// Get Trash list route
app.get('/trash', async (req, res) => {
    try {
        // Find all tasks with files in "trash"
        const trashedTasks = await Task.find({ 'files.path': { $regex: "/trash/" } });

        if (trashedTasks.length === 0) {
            return res.status(200).json({ message: 'Trash is empty' });
        }

        res.json({ trashedTasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Restore Route
app.put('/restore/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the task in "trash"
        const deletedTask = await Task.findById(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found in Trash' });
        }

        // Restore files from "trash" to "uploads"
        deletedTask.files.forEach(file => {
            const oldPath = file.path; // Path in "trash"
            const restorePath = oldPath.replace('trash', 'uploads');

            // Ensure the "uploads" directory exists
            const uploadDir = path.dirname(restorePath);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Move the file back to "uploads"
            fs.renameSync(oldPath, restorePath);

            // Update the file path in the task
            file.path = restorePath;
        });

        // Save the restored task
        await deletedTask.save();

        res.json({ message: 'Task and files restored successfully', task: deletedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Permanent Delete Route
app.delete('/permanent-delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the task in Database
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found in trash' });
        }

        // Delete associated files from the "trash" directory
        if (task.files && task.files.length > 0) {
            task.files.forEach(file => {
                const filePath = file.path;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        // Remove the task from database
        await Task.findByIdAndDelete(id);

        res.json({ message: 'Task and files permanently deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
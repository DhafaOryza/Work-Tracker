import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    return response.data;
});

// Add a new task
export const addTask = createAsyncThunk('tasks/addTask', async (formData) => {
    const response = await axios.post('http://localhost:5000/tasks', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
})

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default taskSlice.reducer;
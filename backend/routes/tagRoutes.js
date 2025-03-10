const express = require("express");
const TagCollection = require("../models/tagModel");

const router = express.Router();

// GET all tags & subtags
router.get("/tags", async (req, res) => {
    try {
        const tags = await TagCollection.findOne();
        if (!tags) return res.status(404).json({ message: "No tags found" });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ADD new tag or subtag
router.post("/tags", async (req, res) => {
    const { tag, subtag } = req.body;

    try {
        let tagCollection = await TagCollection.findOne();

        if (!tagCollection) {
            tagCollection = new TagCollection({ tag: [], subtag: [] });
        }

        if (tag && !tagCollection.tag.includes(tag)) {
            tagCollection.tag.push(tag);
        }

        if (subtag && !tagCollection.subtag.includes(subtag)) {
            tagCollection.subtag.push(subtag);
        }

        await tagCollection.save();
        res.json(tagCollection);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;

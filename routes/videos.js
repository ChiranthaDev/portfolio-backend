const express = require("express");
const router = express.Router();
const { getTable, saveTable, generateId } = require("../utils/r2db");

const TABLE_NAME = "videos";

// GET all videos
router.get("/", async (req, res) => {
    try {
        const videos = await getTable(TABLE_NAME);
        videos.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// POST a new video
router.post("/", async (req, res) => {
    try {
        const videos = await getTable(TABLE_NAME);

        const newVideo = {
            id: generateId(),
            ...req.body,
            views: "0",
            date: new Date().toISOString()
        };

        videos.push(newVideo);
        await saveTable(TABLE_NAME, videos);

        res.status(201).json(newVideo);
    } catch (err) {
        res.status(400).json({ error: "Failed to create video", details: err.message });
    }
});

// DELETE a video
router.delete("/:id", async (req, res) => {
    try {
        const videos = await getTable(TABLE_NAME);
        const filteredVideos = videos.filter(v => v.id !== req.params.id);

        await saveTable(TABLE_NAME, filteredVideos);
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete video" });
    }
});

module.exports = router;

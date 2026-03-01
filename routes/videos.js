const express = require("express");
const router = express.Router();
const Video = require("../models/Video");

// GET all videos
router.get("/", async (req, res) => {
    try {
        const videos = await Video.find().sort({ date: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// POST a new video
router.post("/", async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (err) {
        res.status(400).json({ error: "Failed to create video", details: err.message });
    }
});

// DELETE a video
router.delete("/:id", async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete video" });
    }
});

module.exports = router;

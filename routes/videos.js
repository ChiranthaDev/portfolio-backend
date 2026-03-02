const express = require("express");
const router = express.Router();
const { eq } = require("drizzle-orm");
const db = require("../db");
const { videos } = require("../db/schema");

// GET all videos
router.get("/", async (req, res) => {
    try {
        const data = await db
            .select()
            .from(videos)
            .orderBy(videos.createdAt);

        const result = data.map(v => ({
            id: v.id,
            title: v.title,
            platform: v.platform,
            link: v.link,
            thumbnail: v.thumbnail,
            date: v.createdAt,
        }));

        res.json(result);
    } catch (err) {
        console.error("GET /videos error:", err);
        res.status(500).json({ error: "Failed to fetch videos", details: err.message, stack: err.stack });
    }
});

// POST a new video
router.post("/", async (req, res) => {
    try {
        const { title, platform, link, thumbnail } = req.body;

        const [newVideo] = await db
            .insert(videos)
            .values({ title, platform, link, thumbnail })
            .returning();

        res.status(201).json({
            id: newVideo.id,
            title: newVideo.title,
            platform: newVideo.platform,
            link: newVideo.link,
            thumbnail: newVideo.thumbnail,
            date: newVideo.createdAt,
        });
    } catch (err) {
        console.error("POST /videos error:", err.message);
        res.status(400).json({ error: "Failed to create video", details: err.message });
    }
});

// DELETE a video
router.delete("/:id", async (req, res) => {
    try {
        await db.delete(videos).where(eq(videos.id, req.params.id));
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        console.error("DELETE /videos error:", err.message);
        res.status(500).json({ error: "Failed to delete video" });
    }
});

module.exports = router;

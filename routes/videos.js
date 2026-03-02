const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabase");

// GET all videos
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("videos")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        const videos = data.map(v => ({
            id: v.id,
            title: v.title,
            platform: v.platform,
            link: v.link,
            thumbnail: v.thumbnail,
            date: v.created_at,
        }));

        res.json(videos);
    } catch (err) {
        console.error("GET /videos error:", err.message);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// POST a new video
router.post("/", async (req, res) => {
    try {
        const { title, platform, link, thumbnail } = req.body;

        const { data, error } = await supabase
            .from("videos")
            .insert([{ title, platform, link, thumbnail }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            id: data.id,
            title: data.title,
            platform: data.platform,
            link: data.link,
            thumbnail: data.thumbnail,
            date: data.created_at,
        });
    } catch (err) {
        console.error("POST /videos error:", err.message);
        res.status(400).json({ error: "Failed to create video", details: err.message });
    }
});

// DELETE a video
router.delete("/:id", async (req, res) => {
    try {
        const { error } = await supabase
            .from("videos")
            .delete()
            .eq("id", req.params.id);

        if (error) throw error;

        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        console.error("DELETE /videos error:", err.message);
        res.status(500).json({ error: "Failed to delete video" });
    }
});

module.exports = router;

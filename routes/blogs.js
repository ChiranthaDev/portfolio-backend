const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabase");

// GET all blogs
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        const blogs = data.map(b => ({
            id: b.id,
            title: b.title,
            category: b.category,
            linkedinLink: b.linkedin_link,
            coverImage: b.cover_image,
            status: b.status,
            date: b.created_at,
        }));

        res.json(blogs);
    } catch (err) {
        console.error("GET /blogs error:", err.message);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// POST a new blog
router.post("/", async (req, res) => {
    try {
        const { title, category, linkedinLink, coverImage, status } = req.body;

        const { data, error } = await supabase
            .from("blogs")
            .insert([{
                title,
                category,
                linkedin_link: linkedinLink,
                cover_image: coverImage,
                status: status || "Published",
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            id: data.id,
            title: data.title,
            category: data.category,
            linkedinLink: data.linkedin_link,
            coverImage: data.cover_image,
            status: data.status,
            date: data.created_at,
        });
    } catch (err) {
        console.error("POST /blogs error:", err.message);
        res.status(400).json({ error: "Failed to create blog", details: err.message });
    }
});

// DELETE a blog
router.delete("/:id", async (req, res) => {
    try {
        const { error } = await supabase
            .from("blogs")
            .delete()
            .eq("id", req.params.id);

        if (error) throw error;

        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        console.error("DELETE /blogs error:", err.message);
        res.status(500).json({ error: "Failed to delete blog" });
    }
});

module.exports = router;

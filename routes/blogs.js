const express = require("express");
const router = express.Router();
const { eq } = require("drizzle-orm");
const db = require("../db");
const { blogs } = require("../db/schema");

// GET all blogs
router.get("/", async (req, res) => {
    try {
        const data = await db
            .select()
            .from(blogs)
            .orderBy(blogs.createdAt);

        const result = data.map(b => ({
            id: b.id,
            title: b.title,
            linkedinLink: b.linkedinLink,
            coverImage: b.coverImage,
            status: b.status,
            date: b.createdAt,
        }));

        res.json(result);
    } catch (err) {
        console.error("GET /blogs error:", err);
        res.status(500).json({ error: "Failed to fetch blogs", details: err.message, stack: err.stack });
    }
});

// POST a new blog
router.post("/", async (req, res) => {
    try {
        const { title, linkedinLink, coverImage, status } = req.body;

        const [newBlog] = await db
            .insert(blogs)
            .values({
                title,
                linkedinLink,
                coverImage,
                status: status || "Published",
            })
            .returning();

        res.status(201).json({
            id: newBlog.id,
            title: newBlog.title,
            linkedinLink: newBlog.linkedinLink,
            coverImage: newBlog.coverImage,
            status: newBlog.status,
            date: newBlog.createdAt,
        });
    } catch (err) {
        console.error("POST /blogs error:", err.message);
        res.status(400).json({ error: "Failed to create blog", details: err.message });
    }
});

// DELETE a blog
router.delete("/:id", async (req, res) => {
    try {
        await db.delete(blogs).where(eq(blogs.id, req.params.id));
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        console.error("DELETE /blogs error:", err.message);
        res.status(500).json({ error: "Failed to delete blog" });
    }
});

module.exports = router;

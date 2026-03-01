const express = require("express");
const router = express.Router();
const { getTable, saveTable, generateId } = require("../utils/r2db");

const TABLE_NAME = "blogs";

// GET all blogs
router.get("/", async (req, res) => {
    try {
        const blogs = await getTable(TABLE_NAME);
        blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// POST a new blog
router.post("/", async (req, res) => {
    try {
        const blogs = await getTable(TABLE_NAME);

        const newBlog = {
            id: generateId(),
            ...req.body,
            views: "0",
            status: "Published",
            date: new Date().toISOString()
        };

        blogs.push(newBlog);
        await saveTable(TABLE_NAME, blogs);

        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ error: "Failed to create blog", details: err.message });
    }
});

// DELETE a blog
router.delete("/:id", async (req, res) => {
    try {
        const blogs = await getTable(TABLE_NAME);
        const filteredBlogs = blogs.filter(b => b.id !== req.params.id);

        await saveTable(TABLE_NAME, filteredBlogs);
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete blog" });
    }
});

module.exports = router;

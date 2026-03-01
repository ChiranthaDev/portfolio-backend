const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

// GET all blogs
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// POST a new blog
router.post("/", async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        res.status(400).json({ error: "Failed to create blog", details: err.message });
    }
});

// DELETE a blog
router.delete("/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete blog" });
    }
});

module.exports = router;

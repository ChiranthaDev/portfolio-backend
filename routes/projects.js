const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// GET all projects
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ date: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// POST a new project
router.post("/", async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ error: "Failed to create project", details: err.message });
    }
});

// DELETE a project
router.delete("/:id", async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete project" });
    }
});

module.exports = router;

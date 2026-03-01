const express = require("express");
const router = express.Router();
const { getTable, saveTable, generateId } = require("../utils/r2db");

const TABLE_NAME = "projects";

// GET all projects
router.get("/", async (req, res) => {
    try {
        const projects = await getTable(TABLE_NAME);
        // Sort by date descending (Newest first)
        projects.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects frontend" });
    }
});

// POST a new project
router.post("/", async (req, res) => {
    try {
        const projects = await getTable(TABLE_NAME);

        const newProject = {
            id: generateId(),
            ...req.body,
            date: new Date().toISOString()
        };

        projects.push(newProject);
        await saveTable(TABLE_NAME, projects);

        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ error: "Failed to create project", details: err.message });
    }
});

// DELETE a project
router.delete("/:id", async (req, res) => {
    try {
        const projects = await getTable(TABLE_NAME);
        const filteredProjects = projects.filter(p => p.id !== req.params.id);

        await saveTable(TABLE_NAME, filteredProjects);
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete project" });
    }
});

module.exports = router;

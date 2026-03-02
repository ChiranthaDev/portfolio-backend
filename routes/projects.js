const express = require("express");
const router = express.Router();
const { eq } = require("drizzle-orm");
const db = require("../db");
const { projects } = require("../db/schema");

// GET all projects
router.get("/", async (req, res) => {
    try {
        const data = await db
            .select()
            .from(projects)
            .orderBy(projects.createdAt);

        // Map to camelCase for frontend
        const result = data.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type,
            role: p.role,
            year: p.year,
            category: p.category,
            description: p.description,
            link: p.link,
            coverImage: p.coverImage,
            mainImage: p.mainImage,
            additionalImages: p.additionalImages || [],
            date: p.createdAt,
        }));

        res.json(result);
    } catch (err) {
        console.error("GET /projects error:", err);
        res.status(500).json({ error: "Failed to fetch projects", details: err.message, stack: err.stack });
    }
});

// POST a new project
router.post("/", async (req, res) => {
    try {
        const { title, type, role, year, category, description, link, coverImage, mainImage, additionalImages } = req.body;

        const [newProject] = await db
            .insert(projects)
            .values({
                title,
                type,
                role,
                year,
                category,
                description,
                link,
                coverImage,
                mainImage,
                additionalImages: additionalImages || [],
            })
            .returning();

        res.status(201).json({
            id: newProject.id,
            title: newProject.title,
            type: newProject.type,
            role: newProject.role,
            year: newProject.year,
            category: newProject.category,
            description: newProject.description,
            link: newProject.link,
            coverImage: newProject.coverImage,
            mainImage: newProject.mainImage,
            additionalImages: newProject.additionalImages || [],
            date: newProject.createdAt,
        });
    } catch (err) {
        console.error("POST /projects error:", err.message);
        res.status(400).json({ error: "Failed to create project", details: err.message });
    }
});

// DELETE a project
router.delete("/:id", async (req, res) => {
    try {
        await db.delete(projects).where(eq(projects.id, req.params.id));
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        console.error("DELETE /projects error:", err.message);
        res.status(500).json({ error: "Failed to delete project" });
    }
});

module.exports = router;

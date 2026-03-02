const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabase");

// GET all projects
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Map snake_case DB columns to camelCase for the frontend
        const projects = data.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type,
            role: p.role,
            link: p.link,
            coverImage: p.cover_image,
            additionalImages: p.additional_images || [],
            date: p.created_at,
        }));

        res.json(projects);
    } catch (err) {
        console.error("GET /projects error:", err.message);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// POST a new project
router.post("/", async (req, res) => {
    try {
        const { title, type, role, link, coverImage, additionalImages } = req.body;

        const { data, error } = await supabase
            .from("projects")
            .insert([{
                title,
                type,
                role,
                link,
                cover_image: coverImage,
                additional_images: additionalImages || [],
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            id: data.id,
            title: data.title,
            type: data.type,
            role: data.role,
            link: data.link,
            coverImage: data.cover_image,
            additionalImages: data.additional_images || [],
            date: data.created_at,
        });
    } catch (err) {
        console.error("POST /projects error:", err.message);
        res.status(400).json({ error: "Failed to create project", details: err.message });
    }
});

// DELETE a project
router.delete("/:id", async (req, res) => {
    try {
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", req.params.id);

        if (error) throw error;

        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        console.error("DELETE /projects error:", err.message);
        res.status(500).json({ error: "Failed to delete project" });
    }
});

module.exports = router;

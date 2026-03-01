const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    role: { type: String, required: true, enum: ["Designer", "Developer"] },
    link: { type: String },
    coverImage: { type: String },
    additionalImages: [{ type: String }],
    status: { type: String, default: "Published" },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

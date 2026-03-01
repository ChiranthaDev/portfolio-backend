const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    linkedinLink: { type: String, required: true },
    coverImage: { type: String },
    views: { type: String, default: "0" }, // Mock views for aesthetic
    status: { type: String, default: "Published" },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

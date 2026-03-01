const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    platform: { type: String, required: true }, // YouTube, TikTok, Facebook, LinkedIn
    link: { type: String, required: true },
    thumbnail: { type: String },
    views: { type: String, default: "0" }, // Mock views for aesthetic
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Video || mongoose.model("Video", VideoSchema);

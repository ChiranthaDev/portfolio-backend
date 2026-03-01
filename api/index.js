const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: true, // Allow all origins — restrict later if needed
    credentials: true,
}));

// Basic Health Check Route
app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to the Chiraa Portfolio API!",
        status: "Running",
        environment: process.env.NODE_ENV || "development"
    });
});

// API Routes
app.use("/api/projects", require("../routes/projects"));
app.use("/api/blogs", require("../routes/blogs"));
app.use("/api/videos", require("../routes/videos"));
app.use("/api/upload", require("../routes/upload"));

// Export for Vercel Serverless Functions
module.exports = app;

// Allow listening locally if not on Vercel
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

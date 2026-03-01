const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://your-portfolio.vercel.app"], // Update with real Vercel URL later
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

// We will add MongoDB connection and other routes here later

// Export for Vercel Serverless Functions
module.exports = app;

// Allow listening locally if not on Vercel
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

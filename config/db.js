const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn("⚠️ MONGODB_URI is not defined in environment variables.");
            return;
        }

        // To prevent multiple connections in serverless environments
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;

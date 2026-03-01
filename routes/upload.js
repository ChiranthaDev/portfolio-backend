const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// R2 Config
const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    }
});

// Setup Multer to upload to R2 directly
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.R2_BUCKET_NAME || "chiraa-portfolio",
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const uniqueName = Date.now().toString() + "-" + file.originalname.replace(/\s+/g, '-');
            cb(null, uniqueName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // R2 doesn't always return the public location directly nicely if custom domains are used
        // So we might construct the public URL from process.env.R2_PUBLIC_URL if provided
        const publicUrl = process.env.R2_PUBLIC_URL
            ? `${process.env.R2_PUBLIC_URL}/${req.file.key}`
            : req.file.location;

        res.json({
            message: "File uploaded successfully",
            url: publicUrl,
            key: req.file.key
        });
    } catch (err) {
        res.status(500).json({ error: "File upload failed", details: err.message });
    }
});

module.exports = router;

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
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const uniqueName = Date.now().toString() + "-" + file.originalname.replace(/\s+/g, '-');
            cb(null, uniqueName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload
router.post("/", (req, res) => {
    upload.single("image")(req, res, function (err) {
        if (err) {
            console.error("Multer upload error:", err);
            return res.status(500).json({ error: "File upload failed", details: err.message, stack: err.stack });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const publicUrl = process.env.R2_PUBLIC_URL
                ? `${process.env.R2_PUBLIC_URL}/${req.file.key}`
                : req.file.location;

            res.json({
                message: "File uploaded successfully",
                url: publicUrl,
                key: req.file.key
            });
        } catch (innerErr) {
            console.error("File processing error:", innerErr);
            res.status(500).json({ error: "File processing failed", details: innerErr.message });
        }
    });
});


module.exports = router;

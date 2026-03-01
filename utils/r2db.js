const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

// R2 S3 Client Initialization
const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    }
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "chiraa-portfolio";

/**
 * Streams the R2 response body to a string
 */
const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

/**
 * Get Data from a JSON file in R2
 */
async function getTable(tableName) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `db_${tableName}.json`
        });

        const response = await s3Client.send(command);
        const bodyContents = await streamToString(response.Body);
        return JSON.parse(bodyContents);
    } catch (err) {
        // If the file doesn't exist yet (NoSuchKey), return an empty array
        if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
            return [];
        }
        console.error(`Error reading ${tableName}:`, err);
        throw err;
    }
}

/**
 * Save Data back to a JSON file in R2
 */
async function saveTable(tableName, dataArray) {
    try {
        const jsonData = JSON.stringify(dataArray, null, 2);
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `db_${tableName}.json`,
            Body: jsonData,
            ContentType: "application/json",
            // Make JSON files private by default so they aren't directly served unless intended
        });

        await s3Client.send(command);
        return true;
    } catch (err) {
        console.error(`Error saving ${tableName}:`, err);
        throw err;
    }
}

/**
 * Utility: Generate a random ID
 */
function generateId() {
    return crypto.randomUUID();
}

module.exports = {
    getTable,
    saveTable,
    generateId
};

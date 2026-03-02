const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const schema = require("./schema");

if (!process.env.DATABASE_URL) {
    console.warn("⚠️  Missing DATABASE_URL environment variable.");
}

// Use connection pooling-friendly settings for Vercel serverless
const client = postgres(process.env.DATABASE_URL, {
    prepare: false, // Required for Supabase transaction pooler
});

const db = drizzle(client, { schema });

module.exports = db;

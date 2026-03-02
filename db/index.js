const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const schema = require("./schema");

if (!process.env.DATABASE_URL) {
    console.warn("⚠️  Missing DATABASE_URL environment variable.");
}

// Serverless-optimized settings for Supabase + Vercel
const client = postgres(process.env.DATABASE_URL, {
    prepare: false,      // Required for Supabase PgBouncer transaction pooler
    ssl: "require",      // Required for Supabase connections
    max: 1,              // Limit connections in serverless environment
});

const db = drizzle(client, { schema });

module.exports = db;

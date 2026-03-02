const { pgTable, uuid, text, timestamp } = require("drizzle-orm/pg-core");

const projects = pgTable("projects", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    type: text("type"),
    role: text("role"),
    year: text("year"),
    category: text("category"),
    description: text("description"),
    link: text("link"),
    coverImage: text("cover_image"),
    mainImage: text("main_image"),
    additionalImages: text("additional_images").array(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

const blogs = pgTable("blogs", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    category: text("category"),
    linkedinLink: text("linkedin_link"),
    coverImage: text("cover_image"),
    status: text("status").default("Published"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

const videos = pgTable("videos", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    platform: text("platform"),
    link: text("link"),
    thumbnail: text("thumbnail"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

module.exports = { projects, blogs, videos };

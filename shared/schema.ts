import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  tier: integer("tier").notNull(), // 1, 2, or 3
  startDate: timestamp("start_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  estimatedTime: text("estimated_time"),
  taskType: text("task_type").notNull(), // 'setup', 'content', 'engagement', 'reporting', 'ads'
  tier: integer("tier").notNull(),
  recurringDay: integer("recurring_day"), // Day of month for recurring tasks
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  userId: true,
}).extend({
  startDate: z.string().transform((str) => new Date(str)),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
}).extend({
  scheduledDate: z.date().or(z.string().transform((str) => new Date(str))),
});

export const updateTaskSchema = createInsertSchema(tasks).pick({
  isCompleted: true,
}).extend({
  isCompleted: z.boolean()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type UpdateTask = z.infer<typeof updateTaskSchema>;

// Tier definitions
export const TIER_DEFINITIONS = {
  1: {
    name: "Basic",
    price: 500,
    color: "blue",
    features: [
      "2 Social Media Platforms",
      "8 Posts per Month", 
      "Basic Analytics Report",
      "10 Interactions/month"
    ]
  },
  2: {
    name: "Standard", 
    price: 1200,
    color: "orange",
    features: [
      "4 Social Media Platforms",
      "16 Posts per Month",
      "Custom Graphics",
      "Ad Management ($100)",
      "25 Interactions/month"
    ]
  },
  3: {
    name: "Premium",
    price: 2500, 
    color: "purple",
    features: [
      "6 Social Media Platforms",
      "30 Posts per Month",
      "Advanced Content Creation",
      "Influencer Collaboration", 
      "Weekly Analytics"
    ]
  }
};

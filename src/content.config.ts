import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    category: z.enum(["compute-ops", "agents", "apex", "automation", "dev-log"]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    project: z.string().optional()
  })
});

export const collections = { posts };

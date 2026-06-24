import { z } from "zod";

/**
 * Schema for creating a blog post.
 */
export const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z
    .string()
    .max(500, "Excerpt must be at most 500 characters")
    .optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Invalid cover image URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.string().max(500).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

/**
 * Schema for updating a blog post.
 */
export const updateBlogPostSchema = createBlogPostSchema.partial();

export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;

/**
 * Schema for blog post query filters.
 */
export const blogPostFilterSchema = z.object({
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  authorId: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type BlogPostFilterInput = z.infer<typeof blogPostFilterSchema>;

/**
 * Schema for creating a blog category.
 */
export const createBlogCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be at most 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(500).optional(),
  color: z.string().max(7).regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>;

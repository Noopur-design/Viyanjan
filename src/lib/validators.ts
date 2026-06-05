import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(60),
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase, numbers and dashes"),
  order: z.number().int().min(0).optional(),
});

export const menuItemCreateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  price: z.number().int().positive(), // minor units
  imageUrl: z.string().optional(),
  modelUrl: z.string().optional(),
  foodColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  spiceLevel: z.number().int().min(0).max(3).optional(),
  categoryId: z.string().min(1),
});

export const menuItemUpdateSchema = menuItemCreateSchema.partial();

export const orderCreateSchema = z.object({
  customerName: z.string().min(1).max(80),
  phone: z.string().min(6).max(20),
  email: z.string().email().max(120).optional().or(z.literal("")),
  tableNumber: z.string().max(10).optional(),
  guests: z.number().int().min(1).max(20).optional(),
  notes: z.string().max(500).optional(),
  reservationDate: z.string().optional(), // ISO string from the client
  paymentMethod: z.enum(["COD", "CARD"]).default("COD"),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().positive().max(50),
      })
    )
    .min(1, "order must contain at least one item"),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

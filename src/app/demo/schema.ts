import { defineUrlState, z } from "@/lib"

export const productFiltersSchema = defineUrlState(z.object({
  q: z.string().default(""),
  page: z.number().int().min(1).default(1),
  sort: z.enum(["relevance", "price_asc", "price_desc", "name_asc"]).default("relevance"),
  inStock: z.boolean().default(false),
  category: z.array(z.string()).default([]),
  priceMin: z.number().min(0).default(0),
  priceMax: z.number().min(0).default(1000),
}), {
  debounceMs: 300,
  mode: "replace"
})
/* eslint-disable perfectionist/sort-objects */
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Main products table - one entry per SKU
  costcoProducts: defineTable({
    productId: v.string(), // Unique product ID from Costco
    retailerId: v.string(),

    // Product details (relatively static)
    name: v.string(),
    brand: v.union(v.string(), v.null()),
    categories: v.array(v.string()),
    url: v.string(),
    upc: v.union(v.string(), v.null()),
    thumbnail: v.union(v.string(), v.null()),
    shortDescription: v.union(v.string(), v.null()),

    // Metal-specific attributes
    metalType: v.union(v.literal("gold"), v.literal("silver")),
    metalWeight: v.union(v.string(), v.null()),
    metalPurity: v.union(v.string(), v.null()),

    // Product features
    marketingFeatures: v.union(v.array(v.string()), v.null()),
    isMemberOnly: v.union(v.boolean(), v.null()),
    isOnlineOnly: v.union(v.boolean(), v.null()),
    maxQuantity: v.union(v.number(), v.null()),

    // Current state (will be updated)
    currentPrice: v.number(),
    currentPricePerOunce: v.union(v.number(), v.null()),
    currentInStock: v.boolean(),

    // Timestamps
    firstSeen: v.number(),
    lastUpdated: v.number(),
    lastPriceChange: v.union(v.number(), v.null()),
    lastStockChange: v.union(v.number(), v.null()),
  })
    .index("by_product_id", ["productId"])
    .index("by_metal_type", ["metalType"])
    .index("by_metal_and_stock", ["metalType", "currentInStock"]),

  // Price history table - tracks all price changes
  priceHistory: defineTable({
    productId: v.string(),
    price: v.number(),
    priceReduced: v.union(v.number(), v.null()),
    pricePerOunce: v.union(v.number(), v.null()),
    timestamp: v.number(),
  })
    .index("by_product_id", ["productId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_product_and_time", ["productId", "timestamp"]),

  // Stock history table - tracks stock status changes
  stockHistory: defineTable({
    productId: v.string(),
    inStock: v.boolean(),
    timestamp: v.number(),
  })
    .index("by_product_id", ["productId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_product_and_time", ["productId", "timestamp"]),

  // Optional: Track fetch runs for debugging/monitoring
  fetchRuns: defineTable({
    source: v.union(v.literal("costco"), v.literal("collectpure")),
    timestamp: v.number(),
    productsFound: v.number(),
    productsUpdated: v.number(),
    priceChanges: v.number(),
    stockChanges: v.number(),
    creditsRemaining: v.union(v.number(), v.null()),
    error: v.union(v.string(), v.null()),
  })
    .index("by_source", ["source"])
    .index("by_timestamp", ["timestamp"]),

  // Collect Pure spot prices and bids
  collectPurePrices: defineTable({
    metalType: v.union(
      v.literal("gold"),
      v.literal("silver"),
      v.literal("platinum"),
      v.literal("palladium"),
    ),
    spotPrice: v.number(), // Current spot price per oz
    bidPrice: v.number(), // Highest bid price per oz from Collect Pure
    askPrice: v.union(v.number(), v.null()), // Ask price if available
    timestamp: v.number(),
    isMock: v.boolean(), // Flag to identify mock data
  })
    .index("by_metal", ["metalType"])
    .index("by_timestamp", ["timestamp"])
    .index("by_metal_and_time", ["metalType", "timestamp"]),

  // Collect Pure product bids (for specific products matching Costco SKUs)
  collectPureProductBids: defineTable({
    productName: v.string(), // Product description (e.g., "1 oz Gold Bar")
    metalType: v.union(v.literal("gold"), v.literal("silver")),
    weight: v.number(), // Weight in oz
    purity: v.union(v.string(), v.null()), // e.g., ".9999"
    bidPrice: v.number(), // Total bid price for the product
    bidPricePerOz: v.number(), // Calculated bid per oz
    timestamp: v.number(),
    isMock: v.boolean(),
    // Optional matching to Costco products
    matchedCostcoProductId: v.union(v.string(), v.null()),
  })
    .index("by_metal", ["metalType"])
    .index("by_timestamp", ["timestamp"])
    .index("by_matched_product", ["matchedCostcoProductId"]),

  // Mapping table to link Costco products to Pure products
  costcoPureProductMappings: defineTable({
    costcoProductId: v.string(), // Costco product ID (e.g., "1957979")
    pureSearchCriteria: v.object({
      material: v.string(), // "Gold" or "Silver"
      weight: v.string(), // "100g", "1oz", "25g", etc.
      manufacturer: v.optional(v.string()), // "PAMP Suisse", "Rand Refinery", etc.
      purity: v.optional(v.string()), // ".9999", ".999", etc.
      productType: v.optional(v.string()), // "bar", "coin", etc.
      specificSku: v.optional(v.string()), // If we know the exact Pure product ID
    }),
    isActive: v.boolean(), // Enable/disable this mapping
    notes: v.optional(v.string()), // Optional notes about the mapping
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_costco_product", ["costcoProductId"])
    .index("by_active", ["isActive"])
    .index("by_material", ["pureSearchCriteria.material"]),
});

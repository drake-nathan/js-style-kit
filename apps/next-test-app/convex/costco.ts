import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction, internalMutation, query } from "./_generated/server";

const UNWRANGLE_API_URL = "https://data.unwrangle.com/api/getter/";

// Types for API responses
interface RawProduct {
  attributes: { key: string; value: string }[];
  brand?: string;
  categories: string[];
  currency?: string;
  id: string;
  in_stock: boolean;
  is_member_only?: boolean;
  is_warehouse_only?: boolean;
  marketing_features?: string[];
  max_quantity?: number;
  name: string;
  price: number;
  price_reduced?: number;
  rating?: number;
  retailer_id: string;
  short_description?: string;
  thumbnail?: string;
  total_ratings?: number;
  upc?: string;
  url: string;
}

interface ApiResponse {
  credits_used: number;
  no_of_pages: number;
  remaining_credits: number;
  results: RawProduct[];
  success: boolean;
  total_results: number;
}

interface ProcessedProduct extends RawProduct {
  metalPurity?: string;
  metalType: "gold" | "silver";
  metalWeight?: string;
  pricePerOunce?: number;
}

// NOTE: This is a test of convex eslint rules
// eslint-disable-next-line @convex-dev/no-old-registered-function-syntax, @convex-dev/require-args-validator
export const testQuery = query(async (ctx) => {
  const data = await ctx.db.query("costcoProducts").collect();

  return data;
});

// Minimal validation - just ensure API response structure is valid
const validateApiResponse = (data: unknown): ApiResponse => {
  // Only validate critical API response fields
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid API response: not an object");
  }

  if (!("success" in data) || typeof data.success !== "boolean") {
    throw new TypeError("Invalid API response: missing success field");
  }

  if (!Array.isArray((data as ApiResponse).results)) {
    throw new TypeError("Invalid API response: results is not an array");
  }

  // Trust that Convex schema will validate individual products
  // when we try to insert them
  return data as ApiResponse;
};

// Helper functions
const extractMetalAttributes = (
  product: RawProduct,
): null | ProcessedProduct => {
  const name = product.name.toLowerCase();

  // Determine metal type
  let metalType: "gold" | "silver" | null = null;
  if (name.includes("gold")) {
    metalType = "gold";
  } else if (name.includes("silver")) {
    metalType = "silver";
  }

  // Skip if not a precious metal bar/coin
  if (!metalType) return null;

  // Must be a bar, coin, or specified weight product
  const isMetalProduct =
    name.includes("bar") ||
    name.includes("coin") ||
    name.includes("gram") ||
    name.includes("ounce") ||
    name.includes("oz");

  if (!isMetalProduct) return null;

  // Extract weight and purity
  const metalWeight = product.attributes.find(
    (attr) =>
      attr.key === "Metal Weight" || attr.key.toLowerCase().includes("weight"),
  )?.value;

  const metalPurity = product.attributes.find(
    (attr) =>
      attr.key === "Purity" ||
      attr.key.toLowerCase().includes("purity") ||
      attr.key.toLowerCase().includes("fineness"),
  )?.value;

  // Calculate price per ounce
  let pricePerOunce: number | undefined;
  if (metalWeight && product.price) {
    const weightMatch =
      /(?<weight>\d+(?:\.\d+)?)\s*(?:troy\s+)?(?<unit>gram|g|ounce|oz)/i.exec(
        metalWeight,
      );
    if (weightMatch?.groups?.weight && weightMatch.groups.unit) {
      const weight = parseFloat(weightMatch.groups.weight);
      const unit = weightMatch.groups.unit.toLowerCase();

      if (unit === "gram" || unit === "g") {
        // Convert grams to troy ounces (1 troy oz = 31.1035 g)
        pricePerOunce = product.price / (weight / 31.1035);
      } else if (unit === "ounce" || unit === "oz") {
        pricePerOunce = product.price / weight;
      }
    }
  }

  return {
    ...product,
    metalPurity,
    metalType,
    metalWeight,
    pricePerOunce,
  };
};

// Main fetch action
export const fetchNewData = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.UNWRANGLE_API_KEY;
    if (!apiKey) {
      throw new Error("UNWRANGLE_API_KEY environment variable is required");
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      page: "1",
      platform: "costco_search",
      search: "precious metals",
    });

    const url = `${UNWRANGLE_API_URL}?${params.toString()}`;
    const timestamp = Date.now();

    let fetchRunId: string | undefined;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; Gold-Dashboard/1.0)",
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const rawData = await response.json();

      // Validate API response
      const data = validateApiResponse(rawData);

      if (!data.success) {
        throw new Error(
          `API request failed. Credits remaining: ${data.remaining_credits}`,
        );
      }

      // Filter for precious metals category
      const preciousMetalsProducts = data.results.filter((product) =>
        product.categories.includes(
          "https://www.costco.com/precious-metals.html",
        ),
      );

      // Process and filter valid metal products
      const processedProducts = preciousMetalsProducts
        .map(extractMetalAttributes)
        .filter((p): p is ProcessedProduct => p !== null);

      console.info(
        `Found ${processedProducts.length} metal products (${
          processedProducts.filter((p) => p.metalType === "gold").length
        } gold, ${
          processedProducts.filter((p) => p.metalType === "silver").length
        } silver)`,
      );

      // Track statistics
      let productsUpdated = 0;
      let priceChanges = 0;
      let stockChanges = 0;

      // Collect all product IDs seen in this fetch
      const seenProductIds = new Set(processedProducts.map((p) => p.id));

      // Process each product that was returned (these are in stock)
      for (const product of processedProducts) {
        const result = await ctx.runMutation(internal.costco.upsertProduct, {
          product,
          timestamp,
        });

        if (result.updated) productsUpdated++;
        if (result.priceChanged) priceChanges++;
        if (result.stockChanged) stockChanges++;
      }

      // Mark products not returned as out of stock
      const outOfStockResult = await ctx.runMutation(
        internal.costco.markUnseenProductsOutOfStock,
        {
          seenProductIds: Array.from(seenProductIds),
          timestamp,
        },
      );

      stockChanges += outOfStockResult.stockChanges;
      productsUpdated += outOfStockResult.productsUpdated;

      // Log fetch run
      fetchRunId = await ctx.runMutation(internal.costco.logFetchRun, {
        creditsRemaining: data.remaining_credits,
        priceChanges,
        productsFound: processedProducts.length,
        productsUpdated,
        source: "costco",
        stockChanges,
        timestamp,
      });

      return {
        creditsRemaining: data.remaining_credits,
        priceChanges,
        productsFound: processedProducts.length,
        productsUpdated,
        stockChanges,
        success: true,
        timestamp,
      };
    } catch (error) {
      console.error("Error fetching metal prices:", error);

      // Log failed fetch run
      if (!fetchRunId) {
        await ctx.runMutation(internal.costco.logFetchRun, {
          error: error instanceof Error ? error.message : "Unknown error",
          priceChanges: 0,
          productsFound: 0,
          productsUpdated: 0,
          source: "costco",
          stockChanges: 0,
          timestamp,
        });
      }

      throw error;
    }
  },
});

// Upsert product with history tracking
export const upsertProduct = internalMutation({
  args: {
    product: v.any(), // ProcessedProduct type
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const product = args.product as ProcessedProduct;

    // Check if product exists
    const existing = await ctx.db
      .query("costcoProducts")
      .withIndex("by_product_id", (q) => q.eq("productId", product.id))
      .first();

    let priceChanged = false;
    let stockChanged = false;
    let updated = false;

    if (existing) {
      // Check for price changes
      if (existing.currentPrice !== product.price) {
        priceChanged = true;

        // Record price history
        await ctx.db.insert("priceHistory", {
          price: product.price,
          pricePerOunce: product.pricePerOunce ?? null,
          priceReduced: product.price_reduced ?? null,
          productId: product.id,
          timestamp: args.timestamp,
        });
      }

      // Check for stock changes
      if (existing.currentInStock !== product.in_stock) {
        stockChanged = true;

        // Record stock history
        await ctx.db.insert("stockHistory", {
          inStock: product.in_stock,
          productId: product.id,
          timestamp: args.timestamp,
        });
      }

      // Update product if anything changed
      if (priceChanged || stockChanged) {
        await ctx.db.patch(existing._id, {
          currentInStock: product.in_stock,
          currentPrice: product.price,
          currentPricePerOunce: product.pricePerOunce,
          lastUpdated: args.timestamp,
          ...(priceChanged && { lastPriceChange: args.timestamp }),
          ...(stockChanged && { lastStockChange: args.timestamp }),
        });
        updated = true;
      }
    } else {
      // New product - insert it
      await ctx.db.insert("costcoProducts", {
        brand: product.brand ?? null,
        categories: product.categories,
        currentInStock: product.in_stock,
        currentPrice: product.price,
        currentPricePerOunce: product.pricePerOunce ?? null,
        firstSeen: args.timestamp,
        isMemberOnly: product.is_member_only ?? null,
        isOnlineOnly: product.is_warehouse_only === false ? true : null,
        lastPriceChange: null,
        lastStockChange: null,
        lastUpdated: args.timestamp,
        marketingFeatures: product.marketing_features ?? null,
        maxQuantity: product.max_quantity ?? null,
        metalPurity: product.metalPurity ?? null,
        metalType: product.metalType,
        metalWeight: product.metalWeight ?? null,
        name: product.name,
        productId: product.id,
        retailerId: product.retailer_id,
        shortDescription: product.short_description ?? null,
        thumbnail: product.thumbnail ?? null,
        upc: product.upc ?? null,
        url: product.url,
      });

      // Record initial price and stock
      await ctx.db.insert("priceHistory", {
        price: product.price,
        pricePerOunce: product.pricePerOunce ?? null,
        priceReduced: product.price_reduced ?? null,
        productId: product.id,
        timestamp: args.timestamp,
      });

      await ctx.db.insert("stockHistory", {
        inStock: product.in_stock,
        productId: product.id,
        timestamp: args.timestamp,
      });

      updated = true;
      priceChanged = true;
      stockChanged = true;
    }

    return { priceChanged, stockChanged, updated };
  },
});

// Mark products not seen in the latest fetch as out of stock
export const markUnseenProductsOutOfStock = internalMutation({
  args: {
    seenProductIds: v.array(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    let stockChanges = 0;
    let productsUpdated = 0;

    // Get all currently in-stock products
    const inStockProducts = await ctx.db
      .query("costcoProducts")
      .withIndex("by_metal_and_stock", (q) =>
        q.eq("metalType", "gold").eq("currentInStock", true),
      )
      .collect();

    const silverInStock = await ctx.db
      .query("costcoProducts")
      .withIndex("by_metal_and_stock", (q) =>
        q.eq("metalType", "silver").eq("currentInStock", true),
      )
      .collect();

    const allInStockProducts = [...inStockProducts, ...silverInStock];

    // Find products that are currently in stock but weren't in the latest fetch
    const seenIds = new Set(args.seenProductIds);

    for (const product of allInStockProducts) {
      if (!seenIds.has(product.productId)) {
        // This product wasn't returned, so it's now out of stock
        await ctx.db.patch(product._id, {
          currentInStock: false,
          lastStockChange: args.timestamp,
          lastUpdated: args.timestamp,
        });

        // Record stock history
        await ctx.db.insert("stockHistory", {
          inStock: false,
          productId: product.productId,
          timestamp: args.timestamp,
        });

        stockChanges++;
        productsUpdated++;

        console.info(
          `Marked product ${product.name} (${product.productId}) as out of stock`,
        );
      }
    }

    return { productsUpdated, stockChanges };
  },
});

// Log fetch run for monitoring
export const logFetchRun = internalMutation({
  args: {
    creditsRemaining: v.optional(v.number()),
    error: v.optional(v.string()),
    priceChanges: v.number(),
    productsFound: v.number(),
    productsUpdated: v.number(),
    source: v.union(v.literal("costco"), v.literal("collectpure")),
    stockChanges: v.number(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("fetchRuns", {
      creditsRemaining: args.creditsRemaining ?? null,
      error: args.error ?? null,
      priceChanges: args.priceChanges,
      productsFound: args.productsFound,
      productsUpdated: args.productsUpdated,
      source: args.source,
      stockChanges: args.stockChanges,
      timestamp: args.timestamp,
    });
  },
});

// Runtime guard to validate metal type values
const isMetalType = (value: unknown): value is "gold" | "silver" =>
  value === "gold" || value === "silver";

// Query functions
export const getCurrentPrices = query({
  args: {
    inStockOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    metalType: v.optional(v.union(v.literal("gold"), v.literal("silver"))),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("costcoProducts");

    const metal = args.metalType;

    // FIXME: a problem for future me: remove the `any`
    if (isMetalType(metal) && args.inStockOnly) {
      q = q.withIndex(
        "by_metal_and_stock",
        (q) => q.eq("metalType", metal).eq("currentInStock", true),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any;
    } else if (isMetalType(metal)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q = q.withIndex("by_metal_type", (q) => q.eq("metalType", metal)) as any;
    }

    const results = await q.take(5000); // Limit results to prevent excessive document reads

    // Sort by price per ounce for value comparison
    const sorted = results.sort(
      (a, b) =>
        (a.currentPricePerOunce ?? Infinity) -
        (b.currentPricePerOunce ?? Infinity),
    );

    return args.limit ? sorted.slice(0, args.limit) : sorted;
  },
});

export const getPriceHistory = query({
  args: {
    days: v.optional(v.number()),
    productId: v.string(),
  },
  handler: async (ctx, args) => {
    const cutoff = args.days ? Date.now() - args.days * 24 * 60 * 60 * 1000 : 0;

    const history = await ctx.db
      .query("priceHistory")
      .withIndex("by_product_and_time", (q) =>
        q.eq("productId", args.productId),
      )
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .take(1000); // Limit history queries

    return history.sort((a, b) => a.timestamp - b.timestamp);
  },
});

export const getStockHistory = query({
  args: {
    days: v.optional(v.number()),
    productId: v.string(),
  },
  handler: async (ctx, args) => {
    const cutoff = args.days ? Date.now() - args.days * 24 * 60 * 60 * 1000 : 0;

    const history = await ctx.db
      .query("stockHistory")
      .withIndex("by_product_and_time", (q) =>
        q.eq("productId", args.productId),
      )
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .take(1000); // Limit history queries

    return history.sort((a, b) => a.timestamp - b.timestamp);
  },
});

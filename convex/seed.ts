import { mutation } from "./_generated/server";

export const resetAndSeed = mutation({
    args: {},
    handler: async (ctx) => {
        // =========================================================
        // 1. DELETE EXISTING PRODUCTS
        // =========================================================

        const existingProducts = await ctx.db
            .query("products")
            .collect();

        for (const product of existingProducts) {
            await ctx.db.delete(product._id);
        }

        // =========================================================
        // 2. DELETE EXISTING CATEGORIES
        // =========================================================

        const existingCategories = await ctx.db
            .query("categories")
            .collect();

        for (const category of existingCategories) {
            await ctx.db.delete(category._id);
        }

        // =========================================================
        // 3. CREATE CATEGORIES
        // =========================================================

        const footwearCategory = await ctx.db.insert("categories", {
            name: "Footwear",
            slug: "footwear",
            description:
                "Shoes, sneakers, boots, sandals and everyday footwear.",
        });

        const sneakersCategory = await ctx.db.insert("categories", {
            name: "Sneakers",
            slug: "sneakers",
            description:
                "Modern casual sneakers for everyday streetwear and lifestyle use.",
        });

        const runningCategory = await ctx.db.insert("categories", {
            name: "Running Shoes",
            slug: "running-shoes",
            description:
                "Performance running shoes designed for training, fitness and everyday running.",
        });

        const bootsCategory = await ctx.db.insert("categories", {
            name: "Boots",
            slug: "boots",
            description:
                "Durable casual, outdoor and everyday boots.",
        });

        const sandalsCategory = await ctx.db.insert("categories", {
            name: "Sandals",
            slug: "sandals",
            description:
                "Comfortable sandals and slides for warm weather and casual wear.",
        });

        const formalCategory = await ctx.db.insert("categories", {
            name: "Formal Shoes",
            slug: "formal-shoes",
            description:
                "Elegant formal shoes, loafers and classic footwear.",
        });

        // =========================================================
        // 4. PRODUCTS
        // =========================================================

        const products = [
            // -------------------------------------------------------
            // 1
            // -------------------------------------------------------
            {
                name: "Air Motion Runner",
                slug: "air-motion-runner",
                summary:
                    "Lightweight running shoe with responsive cushioning for everyday training.",
                categoryId: runningCategory,
                categorySlug: "running-shoes",
                brand: "Velocity",

                colors: [
                    {
                        name: "Black",
                        hex: "#111111",
                        images: [
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85",
                        ],
                    },
                    {
                        name: "White",
                        hex: "#FFFFFF",
                        images: [
                            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [39, 40, 41, 42, 43, 44, 45],
                gender: "Unisex" as const,

                description:
                    "A lightweight running shoe designed for daily training, walking and comfortable long-distance movement.",

                mainImage:
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85",
                    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=85",
                ],

                price: 6999,
                quantity: 42,
            },

            // -------------------------------------------------------
            // 2
            // -------------------------------------------------------
            {
                name: "Urban Street Sneaker",
                slug: "urban-street-sneaker",
                summary:
                    "Clean everyday sneaker with a modern streetwear silhouette.",
                categoryId: sneakersCategory,
                categorySlug: "sneakers",
                brand: "Northline",

                colors: [
                    {
                        name: "White",
                        hex: "#FFFFFF",
                        images: [
                            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Black",
                        hex: "#000000",
                        images: [
                            "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [38, 39, 40, 41, 42, 43, 44],
                gender: "Unisex" as const,

                description:
                    "A versatile everyday sneaker designed for city walking, casual outfits and modern streetwear.",

                mainImage:
                    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=85",
                    "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=1200&q=85",
                ],

                price: 5999,
                quantity: 65,
            },

            // -------------------------------------------------------
            // 3
            // -------------------------------------------------------
            {
                name: "Classic Leather Boot",
                slug: "classic-leather-boot",
                summary:
                    "Timeless leather boot designed for durability and everyday style.",
                categoryId: bootsCategory,
                categorySlug: "boots",
                brand: "Heritage",

                colors: [
                    {
                        name: "Brown",
                        hex: "#7B4B2A",
                        images: [
                            "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Black",
                        hex: "#111111",
                        images: [
                            "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [40, 41, 42, 43, 44, 45],
                gender: "Men" as const,

                description:
                    "A durable leather boot with a classic profile suitable for casual, work and smart-casual outfits.",

                mainImage:
                    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=85",
                    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1200&q=85",
                ],

                price: 8499,
                quantity: 24,
            },

            // -------------------------------------------------------
            // 4
            // -------------------------------------------------------
            {
                name: "Court Classic Sneaker",
                slug: "court-classic-sneaker",
                summary:
                    "Minimal court-inspired sneaker for everyday casual outfits.",
                categoryId: sneakersCategory,
                categorySlug: "sneakers",
                brand: "Courtline",

                colors: [
                    {
                        name: "Cream",
                        hex: "#F5F0E6",
                        images: [
                            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Green",
                        hex: "#166534",
                        images: [
                            "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [36, 37, 38, 39, 40, 41, 42],
                gender: "Women" as const,

                description:
                    "A clean low-top sneaker inspired by classic court footwear and designed for daily casual wear.",

                mainImage:
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=85",
                    "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=85",
                ],

                price: 5499,
                quantity: 31,
            },

            // -------------------------------------------------------
            // 5
            // -------------------------------------------------------
            {
                name: "Trail Explorer",
                slug: "trail-explorer",
                summary:
                    "Rugged outdoor footwear designed for trails and weekend adventures.",
                categoryId: footwearCategory,
                categorySlug: "footwear",
                brand: "Terra",

                colors: [
                    {
                        name: "Orange",
                        hex: "#EA580C",
                        images: [
                            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Black",
                        hex: "#171717",
                        images: [
                            "https://images.unsplash.com/photo-1554130847-5b3f4d0a5f07?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [39, 40, 41, 42, 43, 44, 45],
                gender: "Unisex" as const,

                description:
                    "A rugged outdoor shoe providing stability and traction for trail walks and outdoor activities.",

                mainImage:
                    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=85",
                    "https://images.unsplash.com/photo-1554130847-5b3f4d0a5f07?w=1200&q=85",
                ],

                price: 7999,
                quantity: 18,
            },

            // -------------------------------------------------------
            // 6
            // -------------------------------------------------------
            {
                name: "Comfort Slide Sandal",
                slug: "comfort-slide-sandal",
                summary:
                    "Easy everyday slide with a comfortable cushioned footbed.",
                categoryId: sandalsCategory,
                categorySlug: "sandals",
                brand: "Coast",

                colors: [
                    {
                        name: "Black",
                        hex: "#111111",
                        images: [
                            "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Beige",
                        hex: "#D6C3A5",
                        images: [
                            "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [36, 37, 38, 39, 40, 41, 42],
                gender: "Unisex" as const,

                description:
                    "A comfortable slide sandal designed for relaxed days, travel and casual everyday wear.",

                mainImage:
                    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=85",
                    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=85",
                ],

                price: 3499,
                quantity: 55,
            },

            // -------------------------------------------------------
            // 7
            // -------------------------------------------------------
            {
                name: "Elegant Leather Loafer",
                slug: "elegant-leather-loafer",
                summary:
                    "Refined leather loafer for business and formal occasions.",
                categoryId: formalCategory,
                categorySlug: "formal-shoes",
                brand: "Monarch",

                colors: [
                    {
                        name: "Black",
                        hex: "#000000",
                        images: [
                            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Brown",
                        hex: "#6B3F22",
                        images: [
                            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [39, 40, 41, 42, 43, 44],
                gender: "Men" as const,

                description:
                    "A sophisticated leather loafer with a clean silhouette for business, weddings and formal events.",

                mainImage:
                    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&q=85",
                ],

                price: 7499,
                quantity: 15,
            },

            // -------------------------------------------------------
            // 8
            // -------------------------------------------------------
            {
                name: "Everyday Knit Sneaker",
                slug: "everyday-knit-sneaker",
                summary:
                    "Breathable knit sneaker designed for comfortable daily movement.",
                categoryId: footwearCategory,
                categorySlug: "footwear",
                brand: "Flexstep",

                colors: [
                    {
                        name: "Gray",
                        hex: "#6B7280",
                        images: [
                            "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Blue",
                        hex: "#2563EB",
                        images: [
                            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [38, 39, 40, 41, 42, 43, 44],
                gender: "Unisex" as const,

                description:
                    "A lightweight knit sneaker offering breathable comfort for walking and everyday activities.",

                mainImage:
                    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=85",
                    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85",
                ],

                price: 4999,
                quantity: 47,
            },

            // -------------------------------------------------------
            // 9
            // -------------------------------------------------------
            {
                name: "Women's City Boot",
                slug: "womens-city-boot",
                summary:
                    "Sleek ankle boot designed for modern city outfits.",
                categoryId: bootsCategory,
                categorySlug: "boots",
                brand: "UrbanMuse",

                colors: [
                    {
                        name: "Black",
                        hex: "#000000",
                        images: [
                            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Tan",
                        hex: "#A16207",
                        images: [
                            "https://images.unsplash.com/photo-1523789391728-6a15b0b5b400?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [36, 37, 38, 39, 40, 41],
                gender: "Women" as const,

                description:
                    "A stylish ankle boot designed to transition from workdays to evenings and casual city outfits.",

                mainImage:
                    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=85",
                    "https://images.unsplash.com/photo-1523789391728-6a15b0b5b400?w=1200&q=85",
                ],

                price: 6999,
                quantity: 27,
            },

            // -------------------------------------------------------
            // 10
            // -------------------------------------------------------
            {
                name: "Performance Sprint",
                slug: "performance-sprint",
                summary:
                    "Responsive performance shoe for fast-paced training.",
                categoryId: runningCategory,
                categorySlug: "running-shoes",
                brand: "Velocity",

                colors: [
                    {
                        name: "Red",
                        hex: "#DC2626",
                        images: [
                            "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Black",
                        hex: "#111111",
                        images: [
                            "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [39, 40, 41, 42, 43, 44, 45],
                gender: "Men" as const,

                description:
                    "A responsive training shoe built for speed workouts, gym sessions and daily running.",

                mainImage:
                    "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&q=85",
                    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1200&q=85",
                ],

                price: 7499,
                quantity: 36,
            },

            // -------------------------------------------------------
            // 11
            // -------------------------------------------------------
            {
                name: "Classic White Trainer",
                slug: "classic-white-trainer",
                summary:
                    "Clean white trainer with a timeless everyday design.",
                categoryId: sneakersCategory,
                categorySlug: "sneakers",
                brand: "Northline",

                colors: [
                    {
                        name: "White",
                        hex: "#FFFFFF",
                        images: [
                            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [38, 39, 40, 41, 42, 43, 44],
                gender: "Unisex" as const,

                description:
                    "A minimalist white trainer that works with casual, smart-casual and streetwear outfits.",

                mainImage:
                    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85",
                ],

                price: 4499,
                quantity: 72,
            },

            // -------------------------------------------------------
            // 12
            // -------------------------------------------------------
            {
                name: "Retro Runner",
                slug: "retro-runner",
                summary:
                    "Vintage-inspired running sneaker with modern everyday comfort.",
                categoryId: runningCategory,
                categorySlug: "running-shoes",
                brand: "RetroFit",

                colors: [
                    {
                        name: "Blue",
                        hex: "#2563EB",
                        images: [
                            "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Red",
                        hex: "#DC2626",
                        images: [
                            "https://images.unsplash.com/photo-1554130847-5b3f4d0a5f07?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [39, 40, 41, 42, 43, 44],
                gender: "Unisex" as const,

                description:
                    "A retro-inspired runner combining classic styling with modern everyday comfort.",

                mainImage:
                    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=85",
                    "https://images.unsplash.com/photo-1554130847-5b3f4d0a5f07?w=1200&q=85",
                ],

                price: 5799,
                quantity: 34,
            },

            // -------------------------------------------------------
            // 13
            // -------------------------------------------------------
            {
                name: "Suede Casual Sneaker",
                slug: "suede-casual-sneaker",
                summary:
                    "Soft suede sneaker with a relaxed casual profile.",
                categoryId: sneakersCategory,
                categorySlug: "sneakers",
                brand: "Heritage",

                colors: [
                    {
                        name: "Brown",
                        hex: "#92400E",
                        images: [
                            "https://images.unsplash.com/photo-1520256862855-398228c41684?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Gray",
                        hex: "#6B7280",
                        images: [
                            "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [39, 40, 41, 42, 43, 44],
                gender: "Men" as const,

                description:
                    "A casual suede sneaker with a comfortable fit and understated everyday design.",

                mainImage:
                    "https://images.unsplash.com/photo-1520256862855-398228c41684?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1520256862855-398228c41684?w=1200&q=85",
                    "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=1200&q=85",
                ],

                price: 6299,
                quantity: 28,
            },

            // -------------------------------------------------------
            // 14
            // -------------------------------------------------------
            {
                name: "High Top Street Shoe",
                slug: "high-top-street-shoe",
                summary:
                    "Bold high-top sneaker inspired by classic streetwear.",
                categoryId: sneakersCategory,
                categorySlug: "sneakers",
                brand: "StreetLab",

                colors: [
                    {
                        name: "Black",
                        hex: "#000000",
                        images: [
                            "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=85",
                        ],
                    },
                    {
                        name: "White",
                        hex: "#FFFFFF",
                        images: [
                            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [38, 39, 40, 41, 42, 43, 44],
                gender: "Unisex" as const,

                description:
                    "A high-top sneaker designed for bold streetwear looks and everyday comfort.",

                mainImage:
                    "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=85",
                    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=85",
                ],

                price: 6799,
                quantity: 41,
            },

            // -------------------------------------------------------
            // 15
            // -------------------------------------------------------
            {
                name: "Classic Chelsea Boot",
                slug: "classic-chelsea-boot",
                summary:
                    "Elegant Chelsea boot with a clean minimalist silhouette.",
                categoryId: bootsCategory,
                categorySlug: "boots",
                brand: "Monarch",

                colors: [
                    {
                        name: "Brown",
                        hex: "#78350F",
                        images: [
                            "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Black",
                        hex: "#000000",
                        images: [
                            "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [40, 41, 42, 43, 44, 45],
                gender: "Men" as const,

                description:
                    "A classic Chelsea boot featuring a clean profile suitable for casual and smart-casual styling.",

                mainImage:
                    "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=1200&q=85",
                    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1200&q=85",
                ],

                price: 8999,
                quantity: 19,
            },

            // -------------------------------------------------------
            // 16
            // -------------------------------------------------------
            {
                name: "Summer Platform Sandal",
                slug: "summer-platform-sandal",
                summary:
                    "Stylish platform sandal designed for warm-weather outfits.",
                categoryId: sandalsCategory,
                categorySlug: "sandals",
                brand: "UrbanMuse",

                colors: [
                    {
                        name: "Beige",
                        hex: "#D6C3A5",
                        images: [
                            "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Black",
                        hex: "#000000",
                        images: [
                            "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [36, 37, 38, 39, 40, 41],
                gender: "Women" as const,

                description:
                    "A fashionable platform sandal designed for summer outfits, holidays and casual occasions.",

                mainImage:
                    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=85",
                    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=85",
                ],

                price: 3999,
                quantity: 38,
            },

            // -------------------------------------------------------
            // 17
            // -------------------------------------------------------
            {
                name: "Executive Oxford",
                slug: "executive-oxford",
                summary:
                    "Polished Oxford shoe designed for professional occasions.",
                categoryId: formalCategory,
                categorySlug: "formal-shoes",
                brand: "Monarch",

                colors: [
                    {
                        name: "Black",
                        hex: "#000000",
                        images: [
                            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Brown",
                        hex: "#78350F",
                        images: [
                            "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [39, 40, 41, 42, 43, 44, 45],
                gender: "Men" as const,

                description:
                    "A polished Oxford shoe designed for business meetings, weddings and formal events.",

                mainImage:
                    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&q=85",
                    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=85",
                ],

                price: 8499,
                quantity: 14,
            },

            // -------------------------------------------------------
            // 18
            // -------------------------------------------------------
            {
                name: "Minimal Slip-On",
                slug: "minimal-slip-on",
                summary:
                    "Simple slip-on shoe for effortless everyday wear.",
                categoryId: footwearCategory,
                categorySlug: "footwear",
                brand: "Flexstep",

                colors: [
                    {
                        name: "Black",
                        hex: "#111111",
                        images: [
                            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85",
                        ],
                    },
                    {
                        name: "White",
                        hex: "#FFFFFF",
                        images: [
                            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [38, 39, 40, 41, 42, 43],
                gender: "Unisex" as const,

                description:
                    "A simple slip-on designed for quick, comfortable everyday wear and casual outfits.",

                mainImage:
                    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85",
                    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85",
                ],

                price: 4299,
                quantity: 61,
            },

            // -------------------------------------------------------
            // 19
            // -------------------------------------------------------
            {
                name: "Women's Running Pro",
                slug: "womens-running-pro",
                summary:
                    "Lightweight women's running shoe with supportive cushioning.",
                categoryId: runningCategory,
                categorySlug: "running-shoes",
                brand: "Velocity",

                colors: [
                    {
                        name: "Pink",
                        hex: "#EC4899",
                        images: [
                            "https://images.unsplash.com/photo-1554066485-8c0f5c4f9a6e?w=1200&q=85",
                        ],
                    },
                    {
                        name: "White",
                        hex: "#FFFFFF",
                        images: [
                            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [36, 37, 38, 39, 40, 41],
                gender: "Women" as const,

                description:
                    "A lightweight running shoe designed for comfortable daily training and active lifestyles.",

                mainImage:
                    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=85",
                    "https://images.unsplash.com/photo-1554066485-8c0f5c4f9a6e?w=1200&q=85",
                ],

                price: 7299,
                quantity: 33,
            },

            // -------------------------------------------------------
            // 20
            // -------------------------------------------------------
            {
                name: "Beach Walk Sandal",
                slug: "beach-walk-sandal",
                summary:
                    "Lightweight sandal designed for holidays and warm-weather days.",
                categoryId: sandalsCategory,
                categorySlug: "sandals",
                brand: "Coast",

                colors: [
                    {
                        name: "Brown",
                        hex: "#92400E",
                        images: [
                            "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=85",
                        ],
                    },
                    {
                        name: "Black",
                        hex: "#000000",
                        images: [
                            "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=85",
                        ],
                    },
                ],

                sizes: [36, 37, 38, 39, 40, 41, 42],
                gender: "Unisex" as const,

                description:
                    "A lightweight sandal designed for beach walks, holidays, travel and relaxed summer days.",

                mainImage:
                    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=85",

                gallery: [
                    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=85",
                    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=85",
                ],

                price: 3299,
                quantity: 68,
            },
        ];

        // =========================================================
        // 5. INSERT PRODUCTS
        // =========================================================

        for (const product of products) {
            await ctx.db.insert("products", product);
        }

        // =========================================================
        // 6. RETURN RESULT
        // =========================================================

        return {
            success: true,
            categoriesCreated: 6,
            productsCreated: products.length,
            message: "Shop reset and seeded successfully.",
        };
    },
});

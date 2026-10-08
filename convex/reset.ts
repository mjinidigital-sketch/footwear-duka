import { mutation } from "./_generated/server";

export const resetShop = mutation({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();

        for (const product of products) {
            await ctx.db.delete(product._id);
        }

        const categories = await ctx.db.query("categories").collect();

        for (const category of categories) {
            await ctx.db.delete(category._id);
        }

        return {
            productsDeleted: products.length,
            categoriesDeleted: categories.length,
        };
    },
});

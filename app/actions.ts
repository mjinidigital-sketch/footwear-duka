"use server";

import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { revalidatePath } from "next/cache";

// Server action to fetch all categories
export async function getCategories() {
  try {
    const categories = await fetchQuery(api.categories.list);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return fallback data when Convex is unavailable
    return [
      { _id: "1", name: "Running Shoes", slug: "running", description: "High-performance athletic shoes" },
      { _id: "2", name: "Casual Sneakers", slug: "sneakers", description: "Trendy everyday sneakers" },
      { _id: "3", name: "Formal Shoes", slug: "formal", description: "Premium leather dress shoes" },
    ];
  }
}

// Server action to fetch category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await fetchQuery(api.categories.getBySlug, { slug });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// Server action to fetch all products
export async function getProducts() {
  try {
    const products = await fetchQuery(api.products.listProducts);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return fallback data when Convex is unavailable
    return [
      {
        _id: "1",
        name: "AeroStride Marathoner v1",
        slug: "aerostride-marathoner-v1",
        summary: "High-quality men's running shoes",
        categorySlug: "running",
        colors: [
          { name: "Midnight Black", hex: "#000000", images: [] },
          { name: "Slate Grey", hex: "#708090", images: [] }
        ],
        sizes: [40, 41, 42, 43, 44],
        gender: "Men" as const,
        description: "Premium comfort and engineering",
        mainImage: "/images/products/running/aerostride-marathoner-v1-main.jpg",
        gallery: ["/images/products/running/aerostride-marathoner-v1-side.jpg"],
        price: 6500,
        quantity: 15,
      },
      {
        _id: "2",
        name: "Velocity Marathoner v2",
        slug: "velocity-marathoner-v2",
        summary: "High-quality women's running shoes",
        categorySlug: "running",
        colors: [
          { name: "Navy Blue", hex: "#000080", images: [] },
          { name: "Crimson Red", hex: "#DC143C", images: [] }
        ],
        sizes: [36, 37, 38, 39, 40],
        gender: "Women" as const,
        description: "Premium comfort and engineering",
        mainImage: "/images/products/running/velocity-marathoner-v2-main.jpg",
        gallery: ["/images/products/running/velocity-marathoner-v2-side.jpg"],
        price: 6750,
        quantity: 22,
      },
    ];
  }
}

// Server action to fetch product by slug
export async function getProductBySlug(slug: string) {
  try {
    const product = await fetchQuery(api.products.getBySlug, { slug });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Server action to fetch filtered products
export async function getFilteredProducts(filters: {
  categorySlug?: string;
  gender?: "Men" | "Women" | "Unisex";
  minPrice?: number;
  maxPrice?: number;
}) {
  try {
    const products = await fetchQuery(api.products.getFilteredProducts, filters);
    return products;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
}

// ─── User Management Server Actions ─────────────────────────────────

// Server action to fetch all users (admin only)
export async function getUsers() {
  try {
    const token = await convexAuthNextjsToken();
    const users = await fetchQuery(
      api.users.listUsers,
      {},
      { token }
    );
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Server action to fetch users by role (admin only)
export async function getUsersByRole(role: "admin" | "staff" | "user" | "customer") {
  try {
    const token = await convexAuthNextjsToken();
    const users = await fetchQuery(
      api.users.listUsersByRole,
      { role },
      { token }
    );
    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return [];
  }
}

// Server action to update user role (admin only)
export async function updateUserRole(targetUserId: string, role: "admin" | "staff" | "user" | "customer") {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.users.updateUserRole,
      { targetUserId: targetUserId as any, role },
      { token }
    );
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user role:", error);
    // Extract user-friendly error message
    let errorMessage = "Failed to update user role";
    if (error?.message) {
      // Remove "Uncaught Error: " prefix if present
      errorMessage = error.message.replace(/^Uncaught Error: /, "");
      // Remove "at handler" and everything after it
      errorMessage = errorMessage.split(" at handler")[0].trim();
    } else if (error?.data?.message) {
      errorMessage = error.data.message.replace(/^Uncaught Error: /, "");
      errorMessage = errorMessage.split(" at handler")[0].trim();
    }
    return { success: false, error: errorMessage };
  }
}

// Server action to delete user (admin only)
export async function deleteUser(targetUserId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.users.deleteUser,
      { targetUserId: targetUserId as any },
      { token }
    );
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    // Extract user-friendly error message
    let errorMessage = "Failed to delete user";
    if (error?.message) {
      // Remove "Uncaught Error: " prefix if present
      errorMessage = error.message.replace(/^Uncaught Error: /, "");
      // Remove "at handler" and everything after it
      errorMessage = errorMessage.split(" at handler")[0].trim();
    } else if (error?.data?.message) {
      errorMessage = error.data.message.replace(/^Uncaught Error: /, "");
      errorMessage = errorMessage.split(" at handler")[0].trim();
    }
    return { success: false, error: errorMessage };
  }
}

// Server action to create user (admin only)
export async function createUser(userData: {
  email: string;
  name?: string;
  role: "admin" | "staff" | "user" | "customer";
  phone?: string;
}) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.users.createUser,
      userData,
      { token }
    );
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating user:", error);
    // Extract user-friendly error message from Convex error
    let errorMessage = "Failed to create user";
    if (error?.message) {
      // Remove "Uncaught Error: " prefix if present
      errorMessage = error.message.replace(/^Uncaught Error: /, "");
      // Remove "at handler" and everything after it
      errorMessage = errorMessage.split(" at handler")[0].trim();
    } else if (error?.data?.message) {
      errorMessage = error.data.message.replace(/^Uncaught Error: /, "");
      errorMessage = errorMessage.split(" at handler")[0].trim();
    }
    return { success: false, error: errorMessage };
  }
}

// Server action to update user profile (admin only)
export async function updateUserProfile(userData: {
  targetUserId: string;
  name?: string;
  email?: string;
  role?: "admin" | "staff" | "user" | "customer";
  phone?: string;
  isActive?: boolean;
}) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.users.updateUserProfile,
      {
        targetUserId: userData.targetUserId as any,
        name: userData.name,
        email: userData.email,
        role: (userData.role || "user") as any,
        phone: userData.phone,
        isActive: userData.isActive,
      },
      { token }
    );
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    // Extract user-friendly error message
    let errorMessage = "Failed to update user profile";
    if (error?.message) {
      errorMessage = error.message.replace(/^Uncaught Error: /, "");
      errorMessage = errorMessage.split(" at handler")[0].trim();
    } else if (error?.data?.message) {
      errorMessage = error.data.message.replace(/^Uncaught Error: /, "");
      errorMessage = errorMessage.split(" at handler")[0].trim();
    }
    return { success: false, error: errorMessage };
  }
}

// ─── Product Management Server Actions ─────────────────────────────────

// Server action to fetch all products (admin only)
export async function getProductsAdmin() {
  try {
    const token = await convexAuthNextjsToken();
    const products = await fetchQuery(
      api.products.listProducts,
      {},
      { token }
    );
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Server action to create product (admin only)
export async function createProduct(productData: any) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.products.createProduct,
      productData,
      { token }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
    let errorMessage = "Failed to create product";
    if (error?.message) {
      errorMessage = error.message.replace(/^Uncaught Error: /, "");
      errorMessage = errorMessage.split(" at handler")[0].trim();
    } else if (error?.data?.message) {
      errorMessage = error.data.message.replace(/^Uncaught Error: /, "");
      errorMessage = errorMessage.split(" at handler")[0].trim();
    }
    return { success: false, error: errorMessage };
  }
}

// Server action to update product (admin only)
export async function updateProduct(productId: string, updates: any) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.products.updateProduct,
      { productId: productId as any, ...updates },
      { token }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

// Server action to delete product (admin only)
export async function deleteProduct(productId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.products.deleteProduct,
      { productId: productId as any },
      { token }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// Server action to toggle product featured status (admin only)
export async function toggleProductFeatured(productId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.products.toggleProductFeatured,
      { productId: productId as any },
      { token }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling product featured:", error);
    return { success: false, error: "Failed to toggle featured status" };
  }
}

// Server action to toggle product active status (admin only)
export async function toggleProductActive(productId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.products.toggleProductActive,
      { productId: productId as any },
      { token }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling product active:", error);
    return { success: false, error: "Failed to toggle active status" };
  }
}

// ─── Category Management Server Actions ────────────────────────────────

// Server action to fetch all categories (admin only)
export async function getCategoriesAdmin() {
  try {
    const token = await convexAuthNextjsToken();
    const categories = await fetchQuery(
      api.categories.list,
      {},
      { token }
    );
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Server action to create category (admin only)
export async function createCategory(categoryData: any) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.categories.createCategory,
      categoryData,
      { token }
    );
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

// Server action to update category (admin only)
export async function updateCategory(categoryId: string, updates: any) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.categories.updateCategory,
      { categoryId: categoryId as any, ...updates },
      { token }
    );
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

// Server action to delete category (admin only)
export async function deleteCategory(categoryId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.categories.deleteCategory,
      { categoryId: categoryId as any },
      { token }
    );
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// Server action to toggle category active status (admin only)
export async function toggleCategoryActive(categoryId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.categories.toggleCategoryActive,
      { categoryId: categoryId as any },
      { token }
    );
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling category active:", error);
    return { success: false, error: "Failed to toggle active status" };
  }
}

// ─── Cart Management Server Actions ────────────────────────────────────────

// Server action to add item to cart
export async function addToCart(cartData: {
  sessionId: string;
  productId: string;
  quantity: number;
  color: string;
  size: number;
  price: number;
  originalPrice?: number;
  slug?: string;
  name?: string;
  brand?: string;
  image?: string;
}) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.cart.addToCart,
      {
        ...cartData,
        productId: cartData.productId as any,
      },
      { token }
    );
    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    let errorMessage = "Failed to add item to cart";
    if (error?.message) {
      errorMessage = error.message.replace(/^Uncaught Error: /, "");
      errorMessage = errorMessage.split(" at handler")[0].trim();
    }
    return { success: false, error: errorMessage };
  }
}

// Server action to remove item from cart
export async function removeFromCart(cartItemId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.cart.removeFromCart,
      { cartItemId: cartItemId as any },
      { token }
    );
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove item from cart" };
  }
}

// Server action to update cart item quantity
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const token = await convexAuthNextjsToken();
    const result = await fetchMutation(
      api.cart.updateCartItemQuantity,
      { cartItemId: cartItemId as any, quantity },
      { token }
    );
    revalidatePath("/cart");
    return { success: true, deleted: result.deleted };
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return { success: false, error: "Failed to update quantity" };
  }
}

// Server action to get cart items
export async function getCartItems(sessionId?: string) {
  try {
    const token = await convexAuthNextjsToken();
    const cartItems = await fetchQuery(
      api.cart.getCartItems,
      { sessionId: sessionId || undefined },
      { token }
    );
    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
}

// Server action to get cart summary
export async function getCartSummary(sessionId?: string) {
  try {
    const token = await convexAuthNextjsToken();
    const summary = await fetchQuery(
      api.cart.getCartSummary,
      { sessionId: sessionId || undefined },
      { token }
    );
    return summary;
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    return {
      subtotal: 0,
      shipping: 0,
      total: 0,
      totalItems: 0,
      itemCount: 0,
      freeShippingThreshold: 10000,
      amountToFreeShipping: 10000,
      freeShippingProgress: 0,
    };
  }
}

// Server action to clear cart
export async function clearCart(sessionId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.cart.clearCart,
      { sessionId },
      { token }
    );
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}

// ─── Order Management Server Actions ──────────────────────────────────

// Fetch all orders (admin only)
export async function getOrdersAdmin() {
  try {
    const token = await convexAuthNextjsToken();
    const orders = await fetchQuery(
      api.orders.getAllOrders,
      {},
      { token }
    );
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Update order status (admin only)
export async function updateOrderStatus(orderId: string, status: any) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.orders.updateOrderStatus,
      { orderId: orderId as any, status },
      { token }
    );
    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, error: error?.message || "Failed to update order status" };
  }
}

// Update order shipping address (admin only)
export async function updateOrderShipping(orderId: string, shippingAddress: any) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.orders.updateOrderShipping,
      { orderId: orderId as any, shippingAddress },
      { token }
    );
    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating order shipping:", error);
    return { success: false, error: error?.message || "Failed to update order shipping" };
  }
}

// Delete order (admin only)
export async function deleteOrder(orderId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.orders.deleteOrder,
      { orderId: orderId as any },
      { token }
    );
    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return { success: false, error: error?.message || "Failed to delete order" };
  }
}

// Create order manually (admin only)
export async function createOrderAdmin(orderData: any) {
  try {
    const token = await convexAuthNextjsToken();
    const orderId = await fetchMutation(
      api.orders.createOrder,
      orderData,
      { token }
    );
    revalidatePath("/admin/orders");
    return { success: true, orderId };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error?.message || "Failed to create order" };
  }
}

// ─── Payment Management Server Actions ────────────────────────────────

// Fetch all payments (admin only)
export async function getPaymentsAdmin() {
  try {
    const token = await convexAuthNextjsToken();
    const payments = await fetchQuery(
      api.payments.getAllPayments,
      {},
      { token }
    );
    return payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

// Update payment status (admin only)
export async function updatePaymentStatus(paymentId: string, status: any) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.payments.updatePaymentStatus,
      { paymentId: paymentId as any, status },
      { token }
    );
    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating payment status:", error);
    return { success: false, error: error?.message || "Failed to update payment status" };
  }
}

// Update payment details (admin only)
export async function updatePaymentDetails(paymentId: string, updates: any) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.payments.updatePaymentDetails,
      { paymentId: paymentId as any, ...updates },
      { token }
    );
    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating payment details:", error);
    return { success: false, error: error?.message || "Failed to update payment details" };
  }
}

// Delete payment (admin only)
export async function deletePayment(paymentId: string) {
  try {
    const token = await convexAuthNextjsToken();
    await fetchMutation(
      api.payments.deletePayment,
      { paymentId: paymentId as any },
      { token }
    );
    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting payment:", error);
    return { success: false, error: error?.message || "Failed to delete payment" };
  }
}

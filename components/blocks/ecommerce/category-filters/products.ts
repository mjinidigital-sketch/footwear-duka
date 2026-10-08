import { ProductSchema } from "@/app/schemas/product";

// Sample product data
const products: ProductSchema[] = [
    {
        name: 'Classic Leather Jacket',
        summary: "",
        categoryId: "1",
        categorySlug: "",
        price: 299,
        quantity: 399,
        mainImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        brand: 'Levi&apos;s',
        colors: [{ name: "Black", hex: "#000000", images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"] }],
        sizes: [38, 39, 40, 41, 42, 43, 44],
        gallery: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"],
        description: "Classic leather jacket",
        slug: "classic-leather-jacket",
        gender: "Men",
    },
    {
        name: 'Sport Running Shoes',
        summary: "",
        categoryId: "1",
        categorySlug: "",
        price: 149,
        quantity: 199,
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        brand: 'Nike',
        colors: [{ name: "Red", hex: "#DC2626", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"] }],
        sizes: [38, 39, 40, 41, 42, 43, 44],
        gallery: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"],
        description: "Classic leather jacket",
        slug: "classic-leather-jacket",
        gender: "Men",
    },
    {
        name: 'Casual Cotton T-Shirt',
        summary: "Casual Cotton T-Shirt for men and women made from 100% cotton material with a variety of colors and sizes.",
        categoryId: "1",
        categorySlug: "",
        price: 29,
        quantity: 39,
        mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        brand: 'H&M',
        colors: [{ name: "White", hex: "#FFFFFF", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"] }],
        sizes: [38, 39, 40, 41, 42, 43, 44],
        gallery: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"],
        description: "Casual Cotton T-Shirt for men and women made from 100% cotton material with a variety of colors and sizes.",
        slug: "classic-leather-jacket",
        gender: "Men",
    },

    {

        name: 'Winter Puffer Jacket',
        summary: "",
        categoryId: "1",
        categorySlug: "",
        price: 179,
        quantity: 229,
        mainImage:
            'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        brand: 'New Balance',
        colors: [{ name: "Blue", hex: "#0000FF", images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"] }],
        sizes: [38, 39, 40, 41, 42, 43, 44],
        gallery: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"],
        description: "Winter Puffer Jacket for men and women made from 100% cotton material with a variety of colors and sizes.",
        slug: "winter-puffer-jacket",
        gender: "Men",
    },
    {

        name: 'Slim Fit Jeans',
        summary: "",
        categoryId: "1",
        categorySlug: "",
        price: 79,
        quantity: 99,
        mainImage:
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        brand: 'Levi&apos;s',
        colors: [{ name: "Blue", hex: "#0000FF", images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"] }],
        sizes: [38, 39, 40, 41, 42, 43, 44],
        gallery: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"],
        description: "Slim Fit Jeans for men and women made from 100% cotton material with a variety of colors and sizes.",
        slug: "slim-fit-jeans",
        gender: "Men",
    },
];


export default products;


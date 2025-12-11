import { NextResponse } from "next/server";

export interface Category {
    id: string;
    name: string;
    image: string;
}

const categories: Category[] = [
    { id: "pizza", name: "Pizza", image: "/icons/pizza.avif" },
    { id: "burger", name: "Burgers", image: "/icons/burger.jpg" },
    { id: "south-indian", name: "South Indian", image: "/icons/dosa.jpg" },
    { id: "chinese", name: "Chinese", image: "/icons/noodles.webp" },
    { id: "dessert", name: "Desserts", image: "/icons/cake.webp" },
    { id: "beverages", name: "Beverages", image: "/icons/beverages.webp" },
];

export async function GET() {
    return NextResponse.json(categories);
}
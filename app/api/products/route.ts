import { NextResponse } from "next/server";

export interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: string;
    image: string;
    category: string;
    isVeg: boolean;
}

const data: Product[] = [
    {
        id: "1",
        name: "Classic Cheeseburger",
        price: 12.99,
        rating: 4.8,
        reviews: "2k+",
        image: "/images/products/cheeseburger.jpg",
        category: "burger",
        isVeg: false
    },
    {
        id: "2",
        name: "Margherita Pizza",
        price: 18.50,
        rating: 4.5,
        reviews: "1.5k+",
        image: "/images/products/MargheritaPizza.webp",
        category: "pizza",
        isVeg: true
    },
    {
        id: "3",
        name: "Chocolate Lava Cake",
        price: 8.00,
        rating: 4.9,
        reviews: "3k+",
        image: "/images/products/Chocolate-lava-cake.jpg",
        category: "dessert",
        isVeg: false
    },
    {
        id: "4",
        name: "Chicken Supreme Pizza",
        price: 22.00,
        rating: 4.7,
        reviews: "900+",
        image: "/images/products/supreme pizza cake.jpg",
        category: "pizza",
        isVeg: false
    },
    {
        id: "5",
        name: "Masala Dosa",
        price: 6.50,
        rating: 4.6,
        reviews: "500+",
        image: "/images/products/masala dosa.jpg",
        category: "south-indian",
        isVeg: true
    },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Filter logic
    let filteredData = data;
    if (category && category !== "all") {
        filteredData = data.filter((item) => item.category === category);
    }

    // Simulate network delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(filteredData);
}
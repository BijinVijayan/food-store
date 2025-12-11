import { NextResponse } from "next/server";

export interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: string;
    images: string[];
    category: string;
    isVeg: boolean;
    description: string;
}

const data: Product[] = [
    {
        id: "1",
        name: "Classic Cheeseburger",
        price: 12.99,
        rating: 4.8,
        reviews: "2k+",
        images: [
            "/images/products/cheeseburger.jpg",
            "/images/products/cheeseburger2.jpg",
            "/images/products/cheeseburger3.jpg"
        ],
        category: "burger",
        isVeg: false,
        description: "A juicy, flame-grilled beef patty topped with melted cheddar cheese, fresh lettuce, tomatoes, and our secret house sauce on a toasted brioche bun."
    },
    {
        id: "2",
        name: "Margherita Pizza",
        price: 18.50,
        rating: 4.5,
        reviews: "1.5k+",
        images: [
            "/images/products/MargheritaPizza.webp",
        ],
        category: "pizza",
        isVeg: true,
        description: "Authentic Italian classic featuring a thin, crispy crust, tangy tomato sauce, fresh mozzarella cheese, and aromatic basil leaves."
    },
    {
        id: "3",
        name: "Chocolate Lava Cake",
        price: 8.00,
        rating: 4.9,
        reviews: "3k+",
        images: ["/images/products/Chocolate-lava-cake.jpg"],
        category: "dessert",
        isVeg: false,
        description: "Decadent chocolate cake with a molten truffle center, served warm with a scoop of vanilla bean ice cream."
    },
    {
        id: "4",
        name: "Chicken Supreme Pizza",
        price: 22.00,
        rating: 4.7,
        reviews: "900+",
        images: ["/images/products/supreme pizza cake.jpg"],
        category: "pizza",
        isVeg: false,
        description: "Loaded with tender chicken chunks, bell peppers, onions, olives, and extra mozzarella for the ultimate feast."
    },
    {
        id: "5",
        name: "Masala Dosa",
        price: 6.50,
        rating: 4.6,
        reviews: "500+",
        images: ["/images/products/masala dosa.jpg"],
        category: "south-indian",
        isVeg: true,
        description: "Crispy fermented crepe made from rice batter and black lentils, stuffed with a lightly cooked filling of potatoes, fried onions and spices."
    }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let filteredData = data;

    if (category && category !== "all") {
        filteredData = data.filter((item) => item.category === category);
    }

    // Simulate network delay
    // await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(filteredData);
}
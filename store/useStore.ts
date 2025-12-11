import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Ensure you import the Product type we just created
import { Product } from "@/app/api/products/route";

// CartItem needs to store a single image string for the cart UI
interface CartItem extends Omit<Product, 'images'> {
    quantity: number;
    image: string; // Cart only needs one thumbnail
}

interface AppState {
    // --- Data State ---
    cart: CartItem[];

    // --- Modal State ---
    viewingProduct: Product | null;

    // --- Session/QR State ---
    diningMode: 'delivery' | 'dine-in';
    tableId: string | null;
    hallId: string | null;

    // --- Actions ---
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: string) => void;

    setViewingProduct: (product: Product | null) => void;

    setDiningContext: (table: string, hall: string) => void;
    resetContext: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            cart: [],
            viewingProduct: null,
            diningMode: 'delivery',
            tableId: null,
            hallId: null,

            addToCart: (product, quantity = 1) => set((state) => {
                const existing = state.cart.find((i) => i.id === product.id);

                // Logic: If item exists, increase quantity
                if (existing) {
                    return {
                        cart: state.cart.map((i) =>
                            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
                        )
                    };
                }

                // Logic: If new, add to cart with the first image as thumbnail
                // We use 'product.images[0]' because CartItem expects 'image: string'
                const newCartItem: CartItem = {
                    ...product,
                    quantity: quantity,
                    image: product.images[0]
                };

                return { cart: [...state.cart, newCartItem] };
            }),

            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter((i) => i.id !== id)
            })),

            setViewingProduct: (product) => set({ viewingProduct: product }),

            setDiningContext: (table, hall) => set({
                diningMode: 'dine-in',
                tableId: table,
                hallId: hall
            }),

            resetContext: () => set({
                diningMode: 'delivery',
                tableId: null,
                hallId: null
            }),
        }),
        { name: 'food-app-storage' }
    )
);
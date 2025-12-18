// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// // Ensure you import the Product type from your API route
// import { Product } from "@/app/api/products/route";
//
// // CartItem needs to store a single image string for the cart UI
// // We Omit 'images' (array) and replace it with 'image' (string)
// export interface CartItem extends Omit<Product, 'images'> {
//     quantity: number;
//     image: string;
// }
//
// interface AppState {
//     // --- Data State ---
//     cart: CartItem[];
//     wishlist: Product[]; // <--- Added Wishlist State
//
//     // --- Modal State ---
//     viewingProduct: Product | null;
//
//     // --- Session/QR State ---
//     diningMode: 'delivery' | 'dine-in';
//     tableId: string | null;
//     hallId: string | null;
//
//     // --- Actions ---
//     addToCart: (product: Product, quantity?: number) => void;
//     removeFromCart: (id: string) => void;
//
//     toggleWishlist: (product: Product) => void; // <--- Added Wishlist Action
//
//     setViewingProduct: (product: Product | null) => void;
//
//     setDiningContext: (table: string, hall: string) => void;
//     resetContext: () => void;
// }
//
// export const useAppStore = create<AppState>()(
//     persist(
//         (set) => ({
//             // Initial State
//             cart: [],
//             wishlist: [], // <--- Initialize Empty Wishlist
//             viewingProduct: null,
//             diningMode: 'delivery',
//             tableId: null,
//             hallId: null,
//
//             // --- Cart Actions ---
//             addToCart: (product, quantity = 1) => set((state) => {
//                 const existing = state.cart.find((i) => i.id === product.id);
//
//                 // Logic: If item exists, increase quantity
//                 if (existing) {
//                     const newQuantity = existing.quantity + quantity;
//
//                     // Safety check: If quantity becomes 0 or less, you might want to remove it
//                     // But usually, the UI handles the remove call. We'll just update here.
//                     return {
//                         cart: state.cart.map((i) =>
//                             i.id === product.id ? { ...i, quantity: newQuantity } : i
//                         )
//                     };
//                 }
//
//                 // Logic: If new, add to cart with the first image as thumbnail
//                 // We use 'product.images[0]' because CartItem expects 'image: string'
//                 const newCartItem: CartItem = {
//                     ...product,
//                     quantity: quantity,
//                     image: product.images[0] // Take the first image for the cart thumbnail
//                 };
//
//                 return { cart: [...state.cart, newCartItem] };
//             }),
//
//             removeFromCart: (id) => set((state) => ({
//                 cart: state.cart.filter((i) => i.id !== id)
//             })),
//
//             // --- Wishlist Actions ---
//             toggleWishlist: (product) => set((state) => {
//                 const exists = state.wishlist.some((p) => p.id === product.id);
//                 if (exists) {
//                     // Remove from wishlist
//                     return { wishlist: state.wishlist.filter((p) => p.id !== product.id) };
//                 }
//                 // Add to wishlist
//                 return { wishlist: [...state.wishlist, product] };
//             }),
//
//             // --- Modal Actions ---
//             setViewingProduct: (product) => set({ viewingProduct: product }),
//
//             // --- Session Actions ---
//             setDiningContext: (table, hall) => set({
//                 diningMode: 'dine-in',
//                 tableId: table,
//                 hallId: hall
//             }),
//
//             resetContext: () => set({
//                 diningMode: 'delivery',
//                 tableId: null,
//                 hallId: null
//             }),
//         }),
//         { name: 'food-app-storage' } // LocalStorage key
//     )
// );
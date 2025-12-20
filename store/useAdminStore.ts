import { create } from "zustand";
import {IStore} from "@/models/Store";
import {IUser} from "@/models/User";

interface AdminState {
    user: IUser | null;
    store: IStore | null;
    isLoading: boolean;
    fetchAdminData: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
    user: null,
    store: null,
    isLoading: true,

    fetchAdminData: async () => {
        try {
            set({ isLoading: true });
            const res = await fetch("/api/admin/me");
            const data = await res.json();

            if (res.ok) {
                set({ user: data.user, store: data.store });
            } else {
                // Handle error (e.g. redirect to login if 401)
                console.error("Failed to fetch admin data:", data.error);
                set({ user: null, store: null });
            }
        } catch (error) {
            console.error("Admin Store Error:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
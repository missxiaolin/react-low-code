import { create } from "zustand";

export interface PageState {
  theme: string;
}

export interface PageAction {
  setTheme: (theme: "light" | "dark") => void;
}

export const usePageStore = create<PageState & PageAction>((set) => ({
  theme: "light",
  // 切换主题
  setTheme: (theme: "light" | "dark") => set({ theme }),
}));

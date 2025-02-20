import { create } from "zustand";

export interface PageState {
  theme: string;
  collapsed: boolean;
}

export interface PageAction {
  setTheme: (theme: "light" | "dark") => void;
  updateCollapsed: () => void;
}

export const usePageStore = create<PageState & PageAction>((set) => ({
  theme: "dark",
  // 切换主题
  setTheme: (theme: "light" | "dark") => set({ theme }),
  collapsed: false,
  updateCollapsed: () => {
    set((state) => {
      return {
        collapsed: !state.collapsed,
      };
    });
  },
}));

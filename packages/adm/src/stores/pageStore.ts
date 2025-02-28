import { create } from "zustand";
import _ from "lodash-es";
import { IMenuItem } from "@/types/index";

export interface ProjectState {
  theme: string;
  collapsed: boolean;
  menuTree: any[];
  buttons: any[];
  pageMap: { [key: number]: IMenuItem };
  menuMap: { [key: number]: IMenuItem };
}

export interface ProjectAction {
  updateCollapsed: () => void;
  setTheme: (theme: "light" | "dark") => void; // 设置主题
}

export const useProjectStore = create<ProjectState & ProjectAction>(
  (set, _) => ({
    theme: "dark",
    // 切换主题
    setTheme: (theme: "light" | "dark") => set({ theme }),
    collapsed: false,
    menuTree: [],
    buttons: [],
    pageMap: {},
    menuMap: {},
    updateCollapsed: () => {
      set((state) => {
        return {
          collapsed: !state.collapsed,
        };
      });
    },
  })
);

import { create } from "zustand";
import _ from "lodash-es";
import { IMenuItem } from "@/types/index";

export interface PageState {
  collapsed: boolean;
  menuTree: any[];
  buttons: any[];
  pageMap: { [key: number]: IMenuItem };
  menuMap: { [key: number]: IMenuItem };
}

export interface ProjectAction {
  updateCollapsed: () => void;
}

export const useProjectStore = create<PageState & ProjectAction>((set, _) => ({
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
}));

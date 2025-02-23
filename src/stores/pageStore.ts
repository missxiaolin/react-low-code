import {
  ComponentType,
  PageVariable,
  EventType,
  ApiType,
  ComItemType,
} from "@/types";
import { create } from "zustand";
import { produce } from "immer"; // immer库用于不可变数据
import { cloneDeep } from "lodash-es";
import { createId } from "@/utils/util";

export interface PageState {
  theme: string;
  collapsed: boolean;
  mode: "edit" | "preview";
  page: {
    pageId: number;
    pageName: string;
    remark: string;
    isPublic: number;
    isEdit: number;
    stgState: 1 | 2 | 3 | 4; // 1:未保存 2:已保存 3:已发布 4:已回滚
    preState: 1 | 2 | 3 | 4; // 1:未保存 2:已保存 3:已发布 4:已回滚
    prdState: 1 | 2 | 3 | 4; // 1:未保存 2:已保存 3:已发布 4:已回滚
    stgPublishId: number;
    prePublishId: number;
    prdPublishId: number;
    previewImg: string;
    userId: string;
    // 页面配置数据
    config: {
      props: any;
      // 页面综合样式(scopeCss + scopeStyle)
      style: React.CSSProperties;
      scopeCss: string;
      scopeStyle: React.CSSProperties;
      events: EventType[];
      api: {
        sourceType: "json" | "api";
        id: string;
        source: any;
      };
    };
    events: Array<{ name: string; value: string }>;
    // 页面全局接口
    apis: { [key: string]: ApiType };
    elements: ComponentType[] | any;
    elementsMap: { [key: string]: ComponentType } | any;
    // 页面变量
    variables: PageVariable[];
    variableData: { [key: string]: any };
    // 表单数据
    formData: { [key: string]: any };
    // 全局拦截器
    interceptor: {
      headers?: {
        key: string;
        value: string;
      }[];
      timeout: number;
      timeoutErrorMessage: string;
      requestInterceptor?: string;
      responseInterceptor?: string;
    };
  };
  isUpdateToolbar: boolean; // 更新遮罩
  selectedElement: { type: string; id: string } | undefined;
}

export interface PageAction {
  setTheme: (theme: "light" | "dark") => void;
  updateCollapsed: () => void;
  addElement: (element: any) => void; // 添加元素
  addChildElements: (element: any) => void;
  setFormData: (payload: any) => void; // 设置表单数据
  setSelectedElement: (payload: any) => void;
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
  setFormData({ name, value, type }: any) {
    set(
      produce((state) => {
        if (type === "override") {
          state.page.formData[name] = value;
        } else {
          state.page.formData[name] = {
            ...state.page.formData[name],
            ...value,
          };
        }
      })
    );
  },
  // 编辑器
  mode: "edit",
  page: {
    pageId: 0,
    pageName: "",
    remark: "",
    isPublic: 1,
    isEdit: 1,
    stgState: 1,
    preState: 1,
    prdState: 1,
    stgPublishId: 0,
    prePublishId: 0,
    prdPublishId: 0,
    previewImg: "",
    userId: "",
    config: {
      props: {},
      style: {},
      scopeCss: "",
      scopeStyle: {},
      events: [],
      api: {
        sourceType: "json",
        id: "",
        source: {},
        sourceField: "",
      },
    },
    events: [],
    // 页面全局接口
    apis: {},
    elements: [],
    elementsMap: {},
    // 页面变量定义列表
    variables: [],
    // 页面变量数据
    variableData: {},
    // 表单数据
    formData: {},
    // 全局拦截器
    interceptor: {
      headers: [{ key: "", value: "" }],
      timeout: 8,
      timeoutErrorMessage: "请求超时，请稍后再试",
    },
  },
  isUpdateToolbar: false, // 更新遮罩
  // 添加组件
  addElement: (element: ComponentType) => {
    set(
      produce((state: PageState) => {
        state.page.elements.push({
          id: element.id,
          parentId: element.parentId,
          type: element.type,
          name: element.name,
          elements:
            element.elements?.map((item) => ({
              id: item.id,
              parentId: element.id,
              type: item.type,
              name: item.name,
            })) || [],
        });
        const childElement = cloneDeep({
          ...element,
          elements: undefined,
          remoteUrl: element.remoteUrl,
          remoteConfigUrl: element.remoteConfigUrl,
          remoteCssUrl: element.remoteCssUrl,
        });
        if (element.config.props.formItem) {
          childElement.config.props.formItem.name = createId(element.type, 6);
        }
        // 添加当前组件对象
        state.page.elementsMap[element.id] = childElement;
        // 添加子组件对象
        element.elements?.map((item) => {
          state.page.elementsMap[item.id] = item;
        });
      })
    );
  },
  // 添加子组件
  addChildElements(element: ComponentType) {
    set(
      produce((state) => {
        function deepFind(list: ComItemType[]) {
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            // 根据parentId先找到当前组件的父组件
            if (item.id == element.parentId) {
              if (item.elements === undefined) {
                item.elements = [];
              }
              item.elements.push({
                id: element.id,
                parentId: element.parentId,
                type: element.type,
                name: element.name,
                elements:
                  element.elements?.map((item) => ({
                    id: item.id,
                    parentId: element.id,
                    type: item.type,
                    name: item.name,
                    elements: [],
                  })) || [],
              });
              const childElement = cloneDeep({
                ...element,
                elements: undefined,
                remoteUrl: element.remoteUrl,
                remoteConfigUrl: element.remoteConfigUrl,
                remoteCssUrl: element.remoteCssUrl,
              });
              if (element.config.props.formItem) {
                childElement.config.props.formItem.name = createId(
                  element.type,
                  6
                );
              }
              // 添加当前组件对象
              state.page.elementsMap[element.id] = childElement;
              // 添加子组件对象
              element.elements?.map((item) => {
                state.page.elementsMap[item.id] = item;
              });
              break;
            } else if (item.elements?.length) {
              deepFind(item.elements);
            }
          }
          return list;
        }
        deepFind(state.page.elements);
        state.isUpdateToolbar = !state.isUpdateToolbar;
      })
    );
  },
  selectedElement: undefined, // 当前选中的组件
  // 设置选中的组件列表
  setSelectedElement(payload: any) {
    set(() => {
      return { selectedElement: payload };
    });
  },
}));

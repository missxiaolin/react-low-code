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
import { createId, getElement } from "@/utils/util";

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
  savePageInfo: (pageInfo: any) => void;
  addApi: (api: ApiType) => void; // 添加接口
  updateApi: (api: ApiType) => void; // 更新接口
  removeApi: (name: string) => void; // 删除接口
  addElement: (element: any) => void; // 添加元素
  addChildElements: (element: any) => void;
  setFormData: (payload: any) => void; // 设置表单数据
  setSelectedElement: (payload: any) => void;
  moveElements: (payload: any) => void; // 移动元素
  removeElements: (payload: any) => void; // 删除元素
  editElement: (payload: any) => void; // 编辑元素
  dragSortElements: (payload: any) => void; // 拖拽排序
  addVariable: (payload: PageVariable) => void; // 添加变量
  editVariable: (payload: PageVariable) => void; // 编辑变量
  removeVariable: (name: string) => void; // 删除变量
  setInterceptor: (payload: any) => void; // 设置拦截器
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
  savePageInfo: (payload: any) =>
    set(
      produce((state) => {
        if (payload.type === "props") {
          state.page.config.props = payload.props;
        } else if (payload.type === "style") {
          // 如果是style，则直接更新
          state.page.config.scopeCss = payload.scopeCss;
          state.page.config.scopeStyle = payload.scopeStyle;
          state.page.config.style = payload.style;
        } else if (payload.type === "events") {
          state.page.config.events = payload.events || [];
        } else if (payload.type === "api") {
          state.page.config.api = payload.api;
        } else {
          state.page = Object.assign(state.page, payload);
        }
      })
    ),
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
  // 组件排序
  moveElements(payload: any) {
    set(
      produce((state) => {
        const { componentId, direction } = payload;
        function deepFind(list: ComponentType[]) {
          for (let index = 0; index < list.length; index++) {
            const item = list[index];
            if (item.id == componentId) {
              if (direction === "up" && index > 0) {
                [list[index], list[index - 1]] = [list[index - 1], list[index]];
              } else if (direction === "down" && list.length - 1 > index) {
                [list[index], list[index + 1]] = [list[index + 1], list[index]];
              }
              break;
            } else if (item.elements?.length) {
              deepFind(item.elements);
            }
          }
        }
        deepFind(state.page.elements);
      })
    );
  },
  removeElements(payload: any) {
    set(
      produce((state) => {
        const id = payload;
        function deepFind(list: ComponentType[]) {
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.id == id) {
              list.splice(i, 1);
              delete state.page.elementsMap[id];

              // 递归删除相互引用的嵌套父子组件
              const deepRemove = (id: string) => {
                // 删除子组件
                Object.values(state.page.elementsMap).map((item: any) => {
                  if (item.parentId == id) {
                    delete state.page.elementsMap[item.id];
                    deepRemove(item.id);
                  }
                  return item;
                });
              };
              deepRemove(id);
              break;
            } else if (item.elements?.length) {
              deepFind(item.elements);
            }
          }
        }
        deepFind(state.page.elements);
        state.selectedElement = undefined;
      })
    );
  },
  // 更新组件属性、样式
  editElement(payload: any) {
    set(
      produce((state) => {
        const item = state.page.elementsMap[payload.id];
        // 属性修改
        if (payload.type === "props") {
          item.config.props = payload.props;
          // Tabs标签对象需要同步属性值到Tab组件中
          if (item.type === "Tabs") {
            const { element: parentItem } = getElement(
              state.page.elements,
              payload.id
            );
            if (parentItem?.elements.length === payload.props.items.length) {
              parentItem?.elements.map((item: any, index: any) => {
                Object.assign(
                  state.page.elementsMap[item.id].config.props,
                  payload.props.items[index]
                );
              });
            } else {
              parentItem?.elements.map((item: any, index: any) => {
                if (
                  !payload.props.items.find(
                    (prop: { id: string }) => prop.id === item.id
                  )
                ) {
                  parentItem?.elements.splice(index, 1);
                  delete state.page.elementsMap[item.id];
                  // 递归删除相互引用的嵌套父子组件
                  const deepRemove = (id: string) => {
                    // 删除子组件
                    Object.values(state.page.elementsMap).map((item: any) => {
                      if (item.parentId == id) {
                        delete state.page.elementsMap[item.id];
                        deepRemove(item.id);
                      }
                      return item;
                    });
                  };
                  deepRemove(item.id);
                }
              });
            }
          }
          // Tab对象需要同步属性值到Tabs组件中
          if (item.type === "Tab") {
            state.page.elementsMap[item.parentId].config.props.items.map(
              (item: { key: string; label: string }) => {
                if (item.key === payload.id) {
                  item.label = payload.props.label;
                }
              }
            );
          }
        } else if (payload.type === "style") {
          // 如果是style，则直接更新
          item.config.scopeCss = payload.scopeCss;
          item.config.scopeStyle = payload.scopeStyle;
          item.config.style = payload.style;
        } else if (payload.type === "events") {
          item.config.events = payload.events || [];
        } else if (payload.type === "api") {
          item.config.api = payload.api;
          if (payload.api.sourceType !== "api") {
            item.config.api.id = undefined;
          } else {
            // 如果ID存在，更新一下数据源字段即可。
            if (payload.api.id) {
              state.page.apis[payload.api.id].sourceField =
                payload.api.sourceField;
            }
          }
        }
        state.isUpdateToolbar = !state.isUpdateToolbar;
      })
    );
  },
  // 组件大纲拖拽排序
  dragSortElements({ id, list, parentId }: any) {
    set(
      produce((state) => {
        state.page.elements = list;
        state.page.elementsMap[id].parentId = parentId;
      })
    );
  },
  addApi: (api) => {
    set(
      produce((state) => {
        state.page.apis[api.id] = api;
      })
    );
  },
  updateApi: (api) => {
    set(
      produce((state) => {
        Object.assign(state.page.apis[api.id], api);
      })
    );
  },
  removeApi: (id) => {
    set(
      produce((state) => {
        delete state.page.apis[id];
      })
    );
  },
  // 添加变量
  addVariable(payload: PageVariable) {
    set(
      produce((state) => {
        state.page.variables.push(payload);
      })
    );
  },
  // 更新变量
  editVariable(payload: PageVariable) {
    set(
      produce((state) => {
        const index = state.page.variables.findIndex(
          (item: PageVariable) => item.name == payload.name
        );
        if (index > -1) {
          state.page.variables[index] = payload;
        }
      })
    );
  },
  // 删除变量
  removeVariable(name: string) {
    set(
      produce((state) => {
        state.page.variables = state.page.variables.filter(
          (item: PageVariable) => item.name !== name
        );
      })
    );
  },
  setInterceptor(payload: any) {
    set(
      produce((state) => {
        state.page.interceptor = payload;
      })
    );
  },
}));

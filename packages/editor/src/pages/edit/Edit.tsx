import { ConfigProvider, theme as AntdTheme } from "antd";
import { useDrop } from "react-dnd";
import React, { useEffect, useState } from "react";
import { IDragTargetItem } from "@/types/index";
import { usePageStore } from "@/stores/pageStore";
import { useDebounceFn } from "ahooks"; // 使用ahooks的防抖函数
import { createId, checkComponentType, getElement } from "@/utils/util";
import { getComponent } from "@/packages/index";
import Toolbar from "@/components/Toolbar/index";
import "./index.scss";
import { message } from "@/utils/AntdGlobal";
import Page from "@/packages/Page/Page";
import PageConfig from "@/packages/Page/Schema";
import storage from "@/utils/storage";

export default function Edit() {
  // 悬浮组件 - 展示悬浮条
  const [hoverTarget, setHoverTarget] = useState<HTMLElement | null>(null);

  const {
    theme,
    mode,
    addElement,
    selectedElement,
    setSelectedElement,
    page,
    savePageInfo,
    addChildElements,
    removeElements,
  } = usePageStore((state) => state);
  const { elementsMap, elements } = page;
  const [loaded, setLoaded] = useState(false); // 是否加载完成

  useEffect(() => {
    savePageInfo({
      config: PageConfig.config,
      events: PageConfig.events,
    });
    setLoaded(true);
    return () => {
      setHoverTarget(null); // 清空悬浮组件
      setSelectedElement(undefined); // 清空选中
    };
  }, []);
  // 当页面和用户有交互时，增加刷新和返回提示。
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     // Cancel the event as stated by the standard.
  //     event.preventDefault();
  //     // Chrome requires returnValue to be set.
  //     event.returnValue = "";
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  // 拖拽接收
  const [, drop] = useDrop({
    accept: "MENU_ITEM",
    async drop(item: IDragTargetItem, monitor: any) {
      // 此处必须检测该组件是否已经被放入完成，如果已经放置到其它容器中，直接返回。
      if (monitor.didDrop()) return;
      // 生成默认配置
      const {
        config,
        events,
        methods = [],
        elements = [],
      }: any = (await getComponent(item.type + "Config"))?.default || {};
      if (
        !checkComponentType(
          item.type,
          selectedElement?.id,
          selectedElement?.type,
          elementsMap
        )
      ) {
        message.info("请把表单项放在Form容器内");
        return;
      }
      const childElement =
        elements.map(async (child: IDragTargetItem) => {
          const {
            config,
            events,
            methods = [],
          }: any = (await getComponent(child.type + "Config"))?.default || {};
          return {
            id: createId(child.type),
            name: child.name,
            type: child.type,
            parentId: item.id,
            config,
            events,
            methods,
          };
        }) || [];
      Promise.all(childElement).then((res) => {
        addElement({
          type: item.type,
          name: item.name,
          id: item.id,
          config,
          events,
          methods,
          elements: res,
        });
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleClick: any = (event: MouseEvent) => {
    event.stopPropagation();
    if (mode === "preview") return;
    const target = event.target as HTMLElement;
    // 如果当前点击的不是自定义组件，需要获取最近的组件对象
    const targetDom = target.closest("[data-id]") as HTMLElement;
    if (targetDom) {
      const id = targetDom?.dataset.id as string;
      if (id === selectedElement?.id) return;
      // 保存在store中，用于更新配置面板
      setSelectedElement({
        id,
        type: targetDom?.dataset.type,
      });
      setHoverTarget(null);
    } else if (selectedElement?.id) {
      setSelectedElement(undefined);
    }
  };
  // 鼠标悬浮事件
  const handleOver = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (mode === "preview") return;
    // 如果当前点击的不是自定义组件，需要获取最近的组件对象
    const targetDom = target.closest("[data-id]") as HTMLElement;
    if (targetDom) {
      const componentid = targetDom?.dataset.id as string;
      if (
        componentid === selectedElement?.id ||
        componentid === hoverTarget?.dataset.id
      )
        return;
      setHoverTarget(targetDom);
    } else if (hoverTarget) {
      setHoverTarget(null);
    }
    event.stopPropagation();
  };
  const { run }: any = useDebounceFn(handleOver, { wait: 150 });

  // 深度递归复制
  function deepCopy(list: any[], parentId: string) {
    for (let i = 0; i < list.length; i++) {
      const pId = createId(list[i].id.split("_")[0]);
      addChildElements({
        ...elementsMap[list[i].id],
        parentId,
        elements: [],
        id: pId,
      });
      if (list[i].elements?.length > 0) {
        deepCopy(list[i].elements, pId);
      }
    }
  }

  // 复制
  const copyElement: any = () => {
    // @ts-ignore
    storage.set("copy_component", selectedElement?.id);
  };

  // 粘贴
  const pastElement: any = () => {
    const id = storage.get("copy_component");
    if (!id) {
      return message.info("暂无复制内容");
    }
    let parentId = elementsMap[id]?.parentId;
    if (selectedElement?.id !== id) {
      parentId = selectedElement?.id;
    }
    // 如果没有父组件，在页面最外层先复制一个元素
    if (!parentId) {
      const { element: current } = getElement(elements, id);
      const newId = createId(id.split("_")[0]);
      addElement({
        ...elementsMap[id],
        elements: [],
        id: newId,
      });

      // 如果该元素存在子元素，需要递归复制
      deepCopy(current?.elements || [], newId);
    } else {
      const { element: current } = getElement(elements, id);
      const newId = createId(id.split("_")[0]);
      addChildElements({
        ...elementsMap[id],
        elements: [],
        parentId,
        id: newId,
      });
      // 如果该元素存在子元素，需要递归复制
      deepCopy(current?.elements || [], newId);
    }
  };
  const delElement: any = () => {
    if (selectedElement) {
      removeElements(selectedElement.id);
    }
  };

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        hashed: false,
        algorithm: AntdTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme || "#1677ff",
          colorLink: theme || "#1677ff",
          colorInfo: theme || "#1677ff",
        },
      }}
    >
      {/* 编辑器 */}
      <div ref={drop} className={mode === "edit" ? "xl-editor" : "xl-preview"}>
        {/* 页面渲染 */}
        <div
          id="editor"
          className="page-wrapper"
          style={
            mode === "preview"
              ? { height: "calc(100vh - 64px)", overflow: "auto", padding: 0 }
              : { height: "100%" }
          }
          onClick={handleClick}
          onMouseOver={run}
        >
          {mode === "edit" && (
            <Toolbar
              copyElement={copyElement}
              pastElement={pastElement}
              delElement={delElement}
              hoverTarget={hoverTarget}
            />
          )}
          <React.Suspense fallback={<div>Loading...</div>}>
            {loaded && <Page />}
          </React.Suspense>
        </div>
      </div>
    </ConfigProvider>
  );
}

import { ConfigProvider, theme as AntdTheme } from "antd";
import { useDrop } from "react-dnd";
import React, { useEffect, useState } from "react";
import { IDragTargetItem } from "@/types/index";
import { usePageStore } from "@/stores/pageStore";
import { createId } from "@/utils/util";
import { getComponent } from "@/packages/index";
import "./index.scss";
import Page from "@/packages/Page/Page";

export default function Edit() {
  const { theme, mode, addElement } = usePageStore((state) => state);
  const [loaded, setLoaded] = useState(false); // 是否加载完成

  useEffect(() => {
    setLoaded(true);
  }, []);
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
      // if (!checkComponentType(item.type, selectedElement?.id, selectedElement?.type, elementsMap)) {
      //   message.info('请把表单项放在Form容器内');
      //   return;
      // }
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
        >
          <React.Suspense fallback={<div>Loading...</div>}>
            {loaded && <Page />}
          </React.Suspense>
        </div>
      </div>
    </ConfigProvider>
  );
}

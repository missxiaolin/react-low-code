import { Outlet } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ConfigProvider, Splitter } from "antd";
import style from "./edit.module.scss";
import Header from "./components/edit/header/header";
import React, { useState, lazy } from "react";
import SpinLoading from "@/components/SpinLoading";

const Menu = lazy(() => import("./components/edit/menu/index"));
const ConfigPanel = lazy(() => import("./components/edit/configPanel/index"));

export default function EditLayout() {
  const [sizes, setSizes] = useState<(number | string)[]>([
    320,
    window.innerWidth - 640,
    320,
  ]);

  return (
    <div className={style.app}>
      <Header />
      <DndProvider backend={HTML5Backend}>
        {/* 编辑器 */}
        <div style={{ height: "calc(100vh - 64px)", width: "100%" }}>
          <ConfigProvider
            theme={{
              components: {
                Splitter: {
                  colorFill: "#e8e9eb",
                  controlItemBgActive: "#7d33ff",
                  controlItemBgActiveHover: "#7d33ff",
                },
              },
            }}
          >
            <Splitter onResize={setSizes}>
              <Splitter.Panel collapsible size={sizes[0]} min={320}>
                <React.Suspense fallback={<SpinLoading />}>
                  <Menu />
                </React.Suspense>
              </Splitter.Panel>
              <Splitter.Panel size={sizes[1]}>
                <Outlet />
              </Splitter.Panel>
              <Splitter.Panel
                collapsible
                size={sizes[2]}
                min={320}
                style={{
                  height: "100%",
                }}
              >
                <React.Suspense fallback={<SpinLoading />}>
                  <ConfigPanel />
                </React.Suspense>
              </Splitter.Panel>
            </Splitter>
          </ConfigProvider>
        </div>
      </DndProvider>
    </div>
  );
}

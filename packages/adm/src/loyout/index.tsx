import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { useProjectStore } from "../stores/pageStore";
import Logo from "./components/logo";
import MenuComponent from "./components/menu";
import HeaderComponent from "./components/header";

export default function Admin() {
  const collapsed = useProjectStore((state) => state.collapsed);

  return (
    <>
      {/* 左右布局 */}
      <Layout style={{ flexDirection: "row", height: "100vh" }}>
        <div
          style={{
            width: collapsed ? 80 : 256,
            background: "var(--ant-color-bg-container)",
          }}
        >
          <Logo />
          <MenuComponent />
        </div>
        {/* 右侧内容渲染 */}
        <div
          style={{
            width: collapsed ? "calc(100vw - 80px)" : "calc(100vw - 256px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <HeaderComponent />
          <div
            style={{
              flex: 1,
              padding: "20px",
            }}
          >
            <Outlet />
          </div>
        </div>
      </Layout>
    </>
  );
}

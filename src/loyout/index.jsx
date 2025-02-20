import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { usePageStore } from "../stores/pageStore";
import Logo from "./components/logo";
import MenuComponent from "./components/menu";

export default function Admin() {
  const collapsed = usePageStore((state) => state.collapsed);

  return (
    <>
      {/* 左右布局 */}
      <Layout style={{ flexDirection: "row", height: "100vh" }}>
        <div
          style={{
            width: collapsed ? 80 : 256,
            borderRight: "1px solid #e8e9eb",
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
          }}
        >
          <Outlet />
        </div>
      </Layout>
    </>
  );
}

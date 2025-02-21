import { Empty } from "antd";

export default function ConfigPanel() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Empty description="暂无配置" />
    </div>
  );
}

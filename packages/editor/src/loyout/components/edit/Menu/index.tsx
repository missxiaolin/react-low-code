import { Col, Row, Tabs, Tooltip, Space } from "antd";
import ComponentPanel from "./ComponentPanel";
import {
  AppstoreOutlined,
  QuestionCircleOutlined,
  PartitionOutlined,
  CodeOutlined,
  FunctionOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { Suspense, lazy } from "react";
import SpinLoading from "@/components/SpinLoading";

// 组件大纲
const OutlinePanel = lazy(() => import("./OutlinePanel"));
// 页面源码
const CodingPanel = lazy(() => import("./CodingPanel"));
// 页面变量
const VariableList = lazy(() => import("./Variable/VariableList"));

export default function Menu() {
  const panels = [
    {
      key: "ComponentPanel",
      icon: <AppstoreOutlined />,
      label: "组件",
      title: (
        <Space>
          <span>组件物料</span>
          <Tooltip title="无需拖拽，直接点击就能添加到画布中。">
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      ),
      component: () => {
        return <ComponentPanel />;
      },
    },
    {
      key: "OutlinePanel",
      icon: <PartitionOutlined />,
      label: "大纲",
      title: (
        <Space>
          <span>页面大纲</span>
          <Tooltip title="组件支持拖拽排序">
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      ),
      component: () => {
        return <OutlinePanel />;
      },
    },
    {
      key: "CodingPanel",
      icon: <CodeOutlined />,
      label: "源码",
      title: <span>页面JSON</span>,
      component: () => {
        return <CodingPanel />;
      },
    },
    {
      key: "Variable",
      icon: <FunctionOutlined />,
      label: "变量",
      title: <span>页面变量</span>,
      component: () => {
        return <VariableList />;
      },
    },
  ];

  return (
    <>
      <Tabs
        size={"small"}
        defaultActiveKey={panels[0].key}
        tabPosition="left"
        tabBarStyle={{ width: "50px", height: "calc(100vh - 64px)" }}
        className={styles["left-tool"]}
        centered={true}
        items={panels.map((item) => {
          return {
            key: item.key,
            label: (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <div>{item.icon}</div>
                <div>{item.label}</div>
              </div>
            ),
            children: (
              <div style={{ marginLeft: -10, marginRight: 10 }}>
                <Row
                  style={{ height: 46 }}
                  align={"middle"}
                  justify={"space-between"}
                >
                  <Col>
                    <span style={{ fontWeight: "bold" }}>{item.title}</span>
                  </Col>
                </Row>
                <Suspense fallback={<SpinLoading />}>
                  {item.component?.()}
                </Suspense>
              </div>
            ),
          };
        })}
      ></Tabs>
    </>
  );
}

/**
 * 组件配置列表
 */
export interface SysComItem {
  type: string;
  title: string;
  hidden?: boolean;
  data: Array<{
    icon: string;
    name: string;
    type: string;
    hidden?: boolean;
  }>;
}

const components = [
  {
    type: "Container",
    title: "容器组件",
    data: [
      {
        icon: "",
        name: "Flex容器",
        type: "Flex",
      },
      {
        icon: "",
        name: "Card容器",
        type: "Card",
      },
      {
        icon: "",
        name: "Form容器",
        type: "Form",
      },
      {
        icon: "",
        name: "Div容器",
        type: "Div",
      },
    ],
  },
];

export default components;

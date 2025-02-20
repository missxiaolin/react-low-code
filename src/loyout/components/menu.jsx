import React, { useEffect, useState } from "react";
import { usePageStore } from "../../stores/pageStore";
import { Menu } from "antd";
import { admRouter } from "../../route/index";

export default function MenuComponent() {
  const [menuList, setMenuList] = useState([]);
  const collapsed = usePageStore((state) => state.collapsed);
  const theme = usePageStore((state) => state.theme);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const getTreeMenu = (data) => {
    let arr = [];
    data.forEach((item) => {
      if (item.meat && !item.meat.hideInMenu) {
        let obj = {
          label: item.meat.title,
          key: item.path,
          path: item.path,
          icon: item.meat.icon,
        };
        if (item.children) {
          obj.children = getTreeMenu(item.children);
        }
        arr.push(obj);
      }
    });
    return arr;
  };

  useEffect(() => {
    const menuItem = getTreeMenu(admRouter);
    setMenuList(menuItem);
  }, []);

  const onClick = (e) => {
    console.log(e);
  };

  return (
    <div
      style={{
        width: collapsed ? 79 : 255,
        background: "#001529",
        overflowX: "hidden",
      }}
    >
      <Menu
        onClick={onClick}
        selectedKeys={selectedKeys}
        theme={theme}
        style={{
          height: "calc(100vh - 64px)",
          border: "none",
          overflowY: "auto",
        }}
        mode="inline"
        inlineCollapsed={collapsed}
        items={menuList}
      />
    </div>
  );
}

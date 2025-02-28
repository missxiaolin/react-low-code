import { useEffect, useState } from "react";
import { usePageStore } from "../../stores/pageStore";
import { Menu } from "antd";
import { admRouter } from "../../router/index";

export default function MenuComponent() {
  const [menuList, setMenuList] = useState([]);
  const collapsed = usePageStore((state) => state.collapsed);
  const [selectedKeys, _] = useState([]);

  const getTreeMenu = (data: any) => {
    const arr: any = [];
    data.forEach((item: any) => {
      if (item.meat && !item.meat.hideInMenu) {
        const obj: any = {
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

  const onClick = (e: any) => {
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

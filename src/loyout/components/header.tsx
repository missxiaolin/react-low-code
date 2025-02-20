import style from "./header.module.scss";
import { usePageStore } from "../../stores/pageStore";
import { Dropdown } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SkinOutlined,
} from "@ant-design/icons";

export default function Header() {
  const { collapsed, setTheme, updateCollapsed, theme } = usePageStore(
    (state) => state
  );

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            setTheme("light");
          }}
        >
          <span>light</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => {
            setTheme("dark");
          }}
        >
          <span>dark</span>
        </div>
      ),
    },
  ];

  return (
    <div className={style.header}>
      <div className={style["header-left"]}>
        {!collapsed ? (
          <MenuFoldOutlined onClick={updateCollapsed} />
        ) : (
          <MenuUnfoldOutlined onClick={updateCollapsed} />
        )}
      </div>
      <div className={style["header-right"]}>
        <div className={style["theme-switcher"]}>
          <Dropdown menu={{ items }} placement="bottom">
            <div className={style["theme-switcher-item"]}>
              <SkinOutlined className={style["theme-icon"]} />
            </div>
          </Dropdown>
        </div>
        <div className={style["user-info"]}>
          <UserOutlined className={style["user-icon"]} /> Admin
        </div>
      </div>
    </div>
  );
}

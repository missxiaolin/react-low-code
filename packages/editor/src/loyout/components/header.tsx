import style from "./header.module.scss";
import { usePageStore } from "../../stores/pageStore";
import { Switch } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  MoonFilled,
  SunOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

export default function Header() {
  const { collapsed, setTheme, updateCollapsed, theme } = usePageStore(
    (state) => state
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );
  }, [theme]);

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
          <Switch
            checkedChildren={<MoonFilled />}
            unCheckedChildren={<SunOutlined />}
            defaultChecked
            checked={theme == "dark" ? true : false}
            onChange={(val) => {
              setTheme(val ? "dark" : "light");
              document.documentElement.setAttribute(
                "data-theme",
                val ? "dark" : "light"
              );
            }}
          />
        </div>
        <div className={style["user-info"]}>
          <UserOutlined className={style["user-icon"]} /> Admin
        </div>
      </div>
    </div>
  );
}

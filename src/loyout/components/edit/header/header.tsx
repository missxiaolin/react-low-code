import style from "./header.module.scss";
import { usePageStore } from "@/stores/pageStore";
import { MoonFilled, SunOutlined } from "@ant-design/icons";
import { Switch, Button } from "antd";
import { useEffect } from "react";

export default function Header() {
  const { setTheme, theme } = usePageStore((state) => state);
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );
  }, [theme]);

  return (
    <div className={style["header-box"]}>
      <div className={style["header-left"]}>
        {theme == "dark" ? (
          <img
            src="/imgs/lintcode-drank.png"
            alt=""
            className={style["logo-img"]}
          />
        ) : (
          <img src="/imgs/lintcode.png" alt="" className={style["logo-img"]} />
        )}
      </div>
      <div className={style["header-right"]}>
        <div className={style["header-theme"]}>
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
        <div className={style["save-box"]}>
          <Button type="primary">保存</Button>
        </div>
      </div>
    </div>
  );
}

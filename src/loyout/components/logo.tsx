import styles from "./logo.module.scss";
import { useNavigate } from "react-router-dom";
import { usePageStore } from "@/stores/pageStore";

export default function Logo() {
  const { theme, collapsed } = usePageStore((state) => state);
  const navigate = useNavigate();

  return (
    <div
      className={styles.logo}
      onClick={() => {
        navigate(`/`);
      }}
    >
      {!collapsed ? (
        theme == "dark" ? (
          <img
            src="/imgs/lintcode-drank.png"
            alt=""
            className={styles["logo-img"]}
          />
        ) : (
          <img src="/imgs/lintcode.png" alt="" className={styles["logo-img"]} />
        )
      ) : (
        ""
      )}
    </div>
  );
}

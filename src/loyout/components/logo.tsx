import styles from "./logo.module.scss";
import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <div
      className={styles.logo}
      onClick={() => {
        navigate(`/`);
      }}
    ></div>
  );
}

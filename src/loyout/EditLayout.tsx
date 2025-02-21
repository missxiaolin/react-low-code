import { Outlet } from "react-router-dom";
import style from "./edit.module.scss";
import Header from "./components/edit/header";

export default function EditLayout() {
  return (
    <div className={style.app}>
      <Header />
      <Outlet />
    </div>
  );
}

import MarsRender from "@/packages/MarsRender/MarsRender";
import { usePageStore } from "@/stores/pageStore";
import React, { useEffect } from "react";
import { handleActionFlow } from "@/packages/utils/action";
import styles from "./page.module.scss";

/**
 * @param props 组件本身属性
 * @param style 组件样式
 * @returns
 */
const Page: React.FC = () => {
  const page = usePageStore((state) => state.page);
  const { config, elements } = page;

  useEffect(() => {
    config.events?.forEach((event) => {
      if (event.actions?.length > 0) {
        handleActionFlow(event.actions, {});
      }
    });
  }, [config.events]);

  return (
    <div style={config.style} id="page" className={styles.page}>
      {<MarsRender elements={elements || []} />}
    </div>
  );
};
export default Page;

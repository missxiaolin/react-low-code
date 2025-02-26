import styles from "./index.module.scss";

/**
 * 标题渲染
 */
const TitleStyle = (props: any) => {
  return <h2 className={styles.title}>{props.children}</h2>;
};

export default TitleStyle;

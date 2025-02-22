/**
 * 动态加载css
 * @param src
 * @returns Promise
 */
export const loadStyle = (id: string, src: string) => {
  if (!src) return;
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return;
    // 创建一个新的link元素
    const link = document.createElement("link");

    // 设置link元素的属性
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = src;
    link.onload = resolve;
    link.onerror = reject;
    link.setAttribute("id", id);
    // 将link元素添加到DOM的head部分
    document.getElementsByTagName("HEAD")[0].appendChild(link);
  });
};

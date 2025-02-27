import parse from "style-to-object";

/**
 * 生成UUID
 * @returns
 */
export function generateUUID(): string {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  const randomMethod = () => {
    if (crypto?.getRandomValues) {
      return crypto.getRandomValues(new Uint8Array(1))[0];
    } else {
      return Math.floor(Math.random() * 256);
    }
  };
  return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (Number(c) ^ (randomMethod() & (15 >> (Number(c) / 4)))).toString(16)
  );
}

/**
 * 解析CSS样式
 */
export const parseStyle = (inputCss: string) => {
  const cssObject: { [key: string]: string } = {};
  // 如果CSS发生变化，需要把文本转换为Object对象
  if (inputCss) {
    try {
      // 删除注释、删除.mars{}，只保留中间部分
      inputCss = inputCss
        .replace(/\/\*.*\*\//, "")
        .replace(/(\.?\w+{)/, "")
        .replace("}", "");
      parse(inputCss, (name, value) => {
        // 把中划线语法替换为驼峰
        cssObject[
          name.replace(/-\w/g, (item) => item.toUpperCase().replace("-", ""))
        ] = value;
      });
    } catch (error) {
      // 如果报错，说明CSS没写完，不能生成对应object，此时直接返回，不需要保存
      return;
    }
  }
  return cssObject;
};

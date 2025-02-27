import components from "@/config/components";
import { ComItemType, ComponentType } from "@/types";
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
 * 生成组件ID
 * @param name 组件类型名称
 * @returns 新名称
 */
export const createId = (name: string, len: number = 10) => {
  return (
    name +
    "_" +
    Number(Math.random().toString().substring(2, 12) + Date.now())
      .toString(36)
      .slice(0, len)
  );
};

/**
 * 查找某组件的所有父元素类型
 * @param id 组件ID
 * @param elementsMap 所有组件映射对象
 * @returns
 */
function findParentTypesById(
  id: string,
  elementsMap: { [id: string]: ComponentType }
) {
  const types = [elementsMap[id].type];
  let parentItem = elementsMap[id];
  while (parentItem.parentId) {
    const parentType = elementsMap[parentItem.parentId].type;
    if (parentType) {
      types.push(parentType);
    }
    parentItem = elementsMap[parentItem.parentId];
  }
  return types;
}

/**
 * 判断组件是否允许添加
 * 主要判断表单组件只能添加到Form或者SearchForm中
 */
export const checkComponentType = (
  type: string,
  parentId: string = "",
  parentType: string = "",
  elementsMap: { [id: string]: ComponentType }
) => {
  const childFormList = components
    .find((item) => item.type === "FormItems")
    ?.data.map((item) => item.type);
  if (!parentType) {
    if (childFormList?.includes(type)) {
      return false;
    }
    return true;
  } else {
    if (childFormList?.includes(type)) {
      const types = findParentTypesById(parentId, elementsMap);
      if (types.includes("Form") || types.includes("SearchForm")) return true;
      return false;
    }
  }
  return true;
};

/**
 * 递归获取元素的相对位置(相对于pageWrapper)
 */

export function getBoundingClientRect(element: any) {
  let offsetTop = 0;
  let offsetLeft = 0;
  const { width, height } = element.getBoundingClientRect();
  while (element) {
    // 如果是顶级元素，则直接跳出循环
    if (element.id === "editor") {
      offsetTop -= element.offsetTop;
      break;
    }
    offsetTop += element.offsetTop;
    offsetLeft += element.offsetLeft;
    element = element.offsetParent;
  }

  return {
    width: width,
    height: height,
    top: offsetTop,
    left: offsetLeft,
  };
}

/**
 * 递归查找组件
 * element：返回当前元素
 * index：返回当前元素在父级中的索引
 * elements：返回父级列表
 */
export const getElement = (
  elements: ComItemType[],
  id?: string
): { element: ComItemType | null; index: number; elements: ComItemType[] } => {
  if (!id) return { element: null, index: -1, elements: [] };
  for (let i = 0; i < elements.length; i++) {
    const item = elements[i];
    if (item.id == id) {
      return { element: item, index: i, elements };
    } else if (item.elements?.length) {
      const result = getElement(item.elements, id);
      if (result.element) return result;
    }
  }
  return { element: null, index: -1, elements: [] };
};

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

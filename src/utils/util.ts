import components from "@/config/components";
import { ComponentType } from "@/types";

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

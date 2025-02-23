import { Button } from "antd";
import { IDragTarget } from "@/types/index";
import { checkComponentType, createId } from "@/utils/util";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { useState } from "react";
import { usePageStore } from "@/stores/pageStore";
import { getComponent } from "@/packages/index";
import { message } from "@/utils/AntdGlobal";

export default function DragMenuItem(props: IDragTarget) {
  const { addElement, selectedElement, page, addChildElements } = usePageStore(
    (state) => state
  );
  const { elementsMap } = page;
  // 生成组件ID
  const [id, setId] = useState(createId(props.type));
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "MENU_ITEM",
      item: {
        id,
        type: props.type,
        name: props.name,
      },
      end: () => {
        setId(createId(props.type));
      },
      collect: (monitor: DragSourceMonitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }),
    [id]
  );
  const handleClick = async (item: IDragTarget) => {
    // 生成默认配置
    const {
      config,
      events,
      methods = [],
      elements = [],
    } = (await getComponent(item.type + "Config"))?.default || {};
    const newId = createId(item.type);
    if (
      !checkComponentType(
        item.type,
        selectedElement?.id,
        selectedElement?.type,
        elementsMap
      )
    ) {
      message.info("请把表单项放在Form容器内");
      return;
    }
    const childElement =
      elements.map(async (child: IDragTarget & { id: string }) => {
        const {
          config,
          events,
          methods = [],
        }: any = (await getComponent(child.type + "Config"))?.default || {};
        return {
          id: child.id || createId(child.type),
          name: child.name,
          type: child.type,
          parentId: newId,
          config,
          events,
          methods,
        };
      }) || [];
    Promise.all(childElement).then((res) => {
      if (selectedElement) {
        addChildElements({
          type: item.type,
          name: item.name,
          elements: res,
          parentId: selectedElement.id,
          id: newId,
          config,
          events,
          methods,
        });
      } else {
        addElement({
          type: item.type,
          name: item.name,
          id: newId,
          elements: res,
          config,
          events,
          methods,
        });
      }
    });
  };
  return (
    <Button type="default" block ref={drag} onClick={() => handleClick(props)}>
      {props.name}
    </Button>
  );
}

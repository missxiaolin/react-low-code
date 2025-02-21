import { Button } from "antd";
import { IDragTarget } from "@/types/index";
import { createId } from "@/utils/util";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { useState } from "react";
import { getComponent } from "@/packages/index";

export default function DragMenuItem(props: IDragTarget) {
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
    const newId = createId(item.type); // 生成组件ID
  };
  return (
    <Button type="default" block ref={drag} onClick={() => handleClick(props)}>
      {props.name}
    </Button>
  );
}

import { memo } from "react";
import { ComItemType } from "@/types/index";
import * as antd from "antd";

export const Material = memo(({ item }: { item: ComItemType }) => {
  return <div>bame</div>;
});

const MarsRender = memo(({ elements = [] }: { elements: ComItemType[] }) => {
  return (
    <>
      {elements.map((item) => {
        if (!item) return <></>;
        return <Material item={item} key={item.id}></Material>;
      })}
    </>
  );
});

export default MarsRender;

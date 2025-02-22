import { memo, useEffect, useState, forwardRef, Suspense } from "react";
import { ComItemType, ConfigType } from "@/types/index";
import { usePageStore } from "@/stores/pageStore";
import * as antd from "antd";
import React from "react";
import dayjs from "dayjs";
import * as Plots from "@ant-design/plots";
import { getComponent } from "@/packages/index";
import { loadStyle } from "@/packages/utils/util";
import { handleActionFlow } from "@/packages/utils/action";
import { setComponentRef } from "@/packages/utils/useComponentRefs";
import { omit } from "lodash-es";
declare const window: any;

export const Material = memo(({ item }: { item: ComItemType }) => {
  const [Component, setComponent] = useState<any>(null);
  const [config, setConfig] = useState<ConfigType>();
  const page = usePageStore((state) => state.page);
  const { elementsMap, variableData, formData } = page;

  function initContext() {
    window.React = window.React || React;
    window.dayjs = window.dayjs || dayjs;
    window.antd = window.antd || antd;
    window.Plots = window.Plots || Plots;
  }

  useEffect(() => {
    if (elementsMap[item.id].remoteUrl) {
      initContext();
      loadStyle(item.type, elementsMap[item.id].remoteCssUrl as string);
      import(elementsMap[item.id].remoteUrl || "").then((res) => {
        setComponent(() => {
          return forwardRef(res.default);
        });
      });
    } else {
      setComponent(getComponent(item.type));
    }
    setConfig(elementsMap[item.id].config);
  }, []);

  // 生成事件函数，挂载到组件上，组件中的按钮在触发事件时，会执行这里的事件函数
  const createEvents = () => {
    const eventFunction: { [key: string]: (params: any) => void } = {};
    const events = config?.events || [];

    // 没有配置事件流，直接返回
    if (!events?.length) {
      return {};
    }
    // 把重复的事件push到数组中（一个点击事件，可能有多个事件流）
    const obj: { [key: string]: any[] } = {};
    events.forEach((event) => {
      if (event.actions?.length > 0) {
        obj[event.eventName] = (obj[event.eventName] || []).concat([
          event.actions,
        ]);
      }
    });
    // 遍历对象，按顺序执行事件流
    for (const key in obj) {
      eventFunction[key] = (params: any) => {
        // 同一个事件：循环执行多个事件流
        obj[key].forEach((actions) => {
          handleActionFlow(actions, params);
        });
      };
    }
    return eventFunction;
  };

  if (Component && config?.props.showOrHide !== false) {
    return (
      <Suspense fallback={<antd.Spin size="default"></antd.Spin>}>
        <Component
          id={item.id}
          type={item.type}
          config={{
            ...config,
            props: { ...omit(config?.props, ["showOrHide"]) },
          }}
          elements={item.elements || []}
          // 把事件函数传递给子组件，子组件触发对应事件时，会执行回调函数
          {...createEvents()}
          ref={(ref: any) => setComponentRef(item.id, ref)}
        />
      </Suspense>
    );
  }

  return null;
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

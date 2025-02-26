import { Suspense, lazy, memo, useEffect, useState } from "react";
import { ConfigProvider, Form, Tabs } from "antd";
import type { TabsProps } from "antd";
import { useDebounceFn } from "ahooks";
import { usePageStore } from "@/stores/pageStore";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { message } from "@/utils/AntdGlobal";
import { defaultsDeep } from "lodash-es";
import copy from "copy-to-clipboard";
import SpinLoading from "@/components/SpinLoading";
import { getComponent } from "@/packages/index";
import styles from "./index.module.scss";

// 属性设置器
const SetterRender = lazy(() => import("../SetterRender/index"));
// 样式配置
const StyleConfig = lazy(() => import("@/components/StyleConfig/index"));

const ConfigPanel = memo(() => {
  const { selectedElement, savePageInfo, editElement, page } = usePageStore(
    (state) => state
  );
  const pageProps = page.config.props;
  const { pageName, elementsMap } = page;

  const [form] = Form.useForm();
  const [ComponentConfig, setComponentConfig] = useState<any>(null); // 组件配置
  const [isCopy, setCopy] = useState<boolean>(false); // 是否复制

  /**
   * 表单初始化
   * 当配置中的输入的值发生变化后，需要再次渲染
   */
  useEffect(() => {
    form.resetFields();
    if (selectedElement) {
      const remoteConfigUrl =
        elementsMap[selectedElement.id]?.remoteConfigUrl || "";
      if (remoteConfigUrl) {
        /* @vite-ignore */
        import(remoteConfigUrl).then((res = {}) => {
          setComponentConfig(res.default);
          form.setFieldsValue(res.default?.config.props || {});
        });
      } else {
        // 生成组件
        getComponent(selectedElement.type + "Config").then((res: any) => {
          const item = res.default;
          setComponentConfig(item);
          // defaults是为了继承页面中新增的配置项
          form.setFieldsValue(elementsMap[selectedElement.id]?.config.props);
        });
      }
      form.setFieldValue("id", selectedElement.id);
    } else {
      // 获取页面配置
      getComponent("PageConfig").then((res: any) => {
        const item = res.default;
        setComponentConfig(item);
        // defaults是为了继承页面中新增的配置项
        form.setFieldsValue({
          pageName,
          ...defaultsDeep({ ...pageProps }, item.config.props),
        });
      });
    }
    return () => {
      setComponentConfig(null);
      form.resetFields();
    };
  }, [selectedElement?.id, pageName]);

  // 接收表单值
  const handleValueChange = (values: any) => {
    if (selectedElement?.id) {
      editElement({
        id: selectedElement.id,
        type: "props",
        props: values,
      });
    } else {
      savePageInfo({
        type: "props",
        props: values,
      });
    }
  };

  const { run } = useDebounceFn(
    () => {
      handleValueChange(form.getFieldsValue());
    },
    { wait: 300 }
  );

  // 复制组件ID
  const handleCopy = () => {
    copy(selectedElement?.id || pageName);
    message.info("复制成功");
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 15 },
  };

  const items: TabsProps["items"] = [
    {
      label: "属性",
      key: "props",
      children: (
        <Form
          form={form}
          style={{ paddingBottom: 20 }}
          {...formLayout}
          layout="horizontal"
          labelAlign="right"
          onValuesChange={run}
        >
          <div className={styles.widget}>
            {selectedElement?.id ? (
              <span className={styles.text}>组件ID：{selectedElement?.id}</span>
            ) : (
              <span className={styles.text}>页面：{pageName}</span>
            )}
            {isCopy ? (
              <CheckOutlined className={styles.ml5} />
            ) : (
              <CopyOutlined onClick={handleCopy} className={styles.ml5} />
            )}
          </div>
          <Suspense fallback={<SpinLoading />}>
            <SetterRender attrs={ComponentConfig?.attrs || []} form={form} />
          </Suspense>
        </Form>
      ),
    },
    {
      key: "style",
      label: `样式`,
      children: (
        <Suspense fallback={<SpinLoading />}>
          <StyleConfig />
        </Suspense>
      ),
    },
    {
      key: "event",
      label: `事件`,
      children: <div>事件</div>,
    },
    {
      key: "api",
      label: `数据`,
      children: <div>数据</div>,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
        },
        components: {
          Tabs: {
            titleFontSize: 14,
          },
          Form: {
            itemMarginBottom: 15,
          },
          InputNumber: {
            paddingInline: 8,
          },
        },
      }}
    >
      <Tabs
        className={styles["attr-box"]}
        centered
        defaultActiveKey="props"
        items={items}
      />
    </ConfigProvider>
  );
});

export default ConfigPanel;

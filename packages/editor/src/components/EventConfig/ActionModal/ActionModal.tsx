import { Modal, Form } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import styles from "./index.module.scss";
// 公共组件
import SendParams from "./SendParams";

// 页面
import JumpLinkAction from "./JumpLinkAction";
import ReloadPageAction from "./ReloadPageAction";

// 其他
import RunScriptAction from "./RunScriptAction";
import CopyAction from "./CopyAction";

const ActionModal = (props: any, ref: any) => {
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<any>({});
  const [fn, setFn] = useState<any>({});
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const items = [
    {
      label: "页面",
      key: "page-nav",
      children: [
        {
          label: "跳转链接",
          key: "jumpLink",
          render: () => {
            return <JumpLinkAction form={form} />;
          },
        },
        {
          label: "刷新页面",
          key: "reloadPage",
          render: () => {
            return <ReloadPageAction />;
          },
        },
      ],
    },
    {
      label: "其他",
      key: "other-nav",
      children: [
        {
          label: "复制内容",
          key: "copy",
          render: () => {
            return <CopyAction />;
          },
        },
        {
          label: "脚本运行",
          key: "script",
          render: () => {
            return <RunScriptAction />;
          },
        },
      ],
    },
  ];

  /**
   * 确认后，需要把当前表单的值写入事件对象中
   * 1. name: 事件行为名称。
   * 2. data: 事件行为参数。
   * 3. fn: EventList模块中传递的函数。
   * 4. values: 当前选中的行为所对应的表单值。
   */
  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      // 变量赋值需要进行数据转换
      if (
        values.assignmentType === "assignment" &&
        values.assignmentWay === "static"
      ) {
        if (
          values.variableType === "array" ||
          values.variableType === "object"
        ) {
          try {
            values.value =
              typeof values.value === "string"
                ? JSON.parse(values.value || "")
                : values.value || "";
          } catch (error) {
            console.error(error);
            return;
          }
        }
      }
      fn.callback({
        actionType: action.key,
        actionName: action.label,
        ...values,
      });
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setVisible(false);
  };

  // 点击动作，加载对应动作组件
  const handleClick = (item: any) => {
    form.resetFields();
    if (item.key === "variable") {
      form.setFieldsValue({
        assignmentType: "assignment",
        assignmentWay: "static",
      });
    } else if (item.key === "showConfirm") {
      form.setFieldsValue({
        type: "confirm",
        title: "确认",
        content: "确定要执行此操作吗？",
        okText: "确认",
        cancelText: "取消",
      });
    } else if (item.key === "message") {
      form.setFieldsValue({
        type: "success",
        content: "操作成功",
        duration: 3,
      });
    } else if (item.key === "notification") {
      form.setFieldsValue({
        type: "info",
        message: "通知",
        description: "操作成功",
        placement: "topRight",
        duration: 4.5,
      });
    } else if (item.key === "setTimeout") {
      form.setFieldsValue({
        duration: 3,
      });
    } else if (item.key === "visible") {
      form.setFieldsValue({
        showType: "static",
        showResult: "show",
        expression: "",
      });
    } else if (item.key === "disable") {
      form.setFieldsValue({
        disableType: "static",
        disableResult: true,
        expression: "",
      });
    } else if (item.key === "sendMessage") {
      form.setFieldsValue({
        msgType: "text",
        content: "你好，我是飞书机器人",
      });
    } else if (item.key === "script") {
      form.setFieldsValue({
        scripts: `/**
* 触发动作后，会执行该函数
* 上下文: context
* 变量: variable
* 事件流参数: eventParams
*/
function run(){
    return context.eventParams;
}
`,
      });
    }
    setAction({
      key: item.key,
      label: item.label,
      render: item.render,
    });
  };

  useImperativeHandle(ref, () => {
    return {
      open(values: any, callback: () => void) {
        setFn({
          callback,
        });
        form.resetFields();
        if (values?.actionType) {
          for (let i = 0; i < items.length; i++) {
            const actionItem = items[i].children.filter(
              (action) => action.key === values.actionType
            )?.[0];
            if (actionItem) {
              setAction({
                key: actionItem.key,
                label: actionItem.label,
                render: actionItem.render,
              });
              // 初始化对应事件行为表单
              form.setFieldsValue(values);
              break;
            }
          }
        } else {
          setAction({});
          form.resetFields();
        }
        setVisible(true);
      },
    };
  });

  return (
    <Modal
      title="事件行为配置"
      width={800}
      open={visible}
      okText="确认"
      cancelText="取消"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={styles.actionBox}>
        <div className={styles.menuAction}>
          <ul>
            {items.map((item: any) => {
              return (
                <li key={item.key} className={styles.category}>
                  <span className={styles.navTitle}>{item.label}</span>
                  <ul>
                    {item.children.map((child: any) => {
                      return (
                        <li
                          key={child.key}
                          className={`${styles.subItem} ${
                            action.key === child.key ? styles.checked : ""
                          }`}
                          onClick={() => handleClick(child)}
                        >
                          <span>{child.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.content}>
          <Form form={form} {...formLayout}>
            {action?.key ? (
              <>
                {action.render?.()}
                <SendParams />
              </>
            ) : (
              <div style={{ textAlign: "center", lineHeight: "300px" }}>
                请选择要执行的动作
              </div>
            )}
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef(ActionModal);

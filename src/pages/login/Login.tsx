import { useNavigate } from "react-router-dom";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input, InputNumber } from "antd";
import { LockOutlined, SafetyOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import style from "./index.module.scss";

type FieldType = {
  userName: string;
  code?: number;
  userPwd: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [type, setType] = useState("login"); // login | register
  const [form] = Form.useForm();

  // 类型切换
  const onChange = () => {
    setType(type == "login" ? "regist" : "login");
    form.setFieldsValue({
      userName: "",
      userPwd: "",
    });
  };

  // 生成验证码
  const handleCreateCode = () => {
    form.validateFields(["userName"]).then(async () => {
      setLoading1(true);
      try {
        // await sendEmail({ email: userName });
        setCount(60);
        setLoading1(false);
      } catch {
        setLoading1(false);
      }
    });
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (
    values: FieldType
  ) => {
    setLoading2(true);
    navigate("/");
    setLoading2(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count > 0) {
        setCount(count - 1);
      }
    }, 1000);

    // 清理函数
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className={style.container}>
      <div className={style.login}>
        <div className={style.left}>
          <img src="/imgs/login-bg.png" />
        </div>
        <div className={style.form}>
          {type === "login" ? (
            <div className={style.title}>
              <span>登录</span>
            </div>
          ) : (
            <div className={style.title}>邮箱注册</div>
          )}
          <Form
            name="basic"
            layout="vertical"
            className={style.form}
            onFinish={onFinish}
            size="large"
            form={form}
          >
            <Form.Item<FieldType>
              name="userName"
              rules={[
                { required: true, message: "请输入邮箱" },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "请输入正确的邮箱",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入个人邮箱"
                autoComplete="off"
                allowClear
              />
            </Form.Item>
            {type === "regist" && (
              <Form.Item>
                <Flex gap={20}>
                  <Form.Item<FieldType>
                    name="code"
                    noStyle
                    rules={[{ required: true, message: "请输入验证码" }]}
                  >
                    <InputNumber
                      prefix={<SafetyOutlined />}
                      style={{ width: "100%" }}
                      placeholder="验证码"
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={handleCreateCode}
                    disabled={count > 0}
                    loading={loading1}
                  >
                    {count > 0 ? count + "s" : "获取验证码"}
                  </Button>
                </Flex>
              </Form.Item>
            )}

            <Form.Item<FieldType>
              style={{ marginTop: 32 }}
              name="userPwd"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                autoComplete="off"
                allowClear
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 40 }}>
              <Button type="primary" block htmlType="submit" loading={loading2}>
                {type === "login" ? "登录" : "注册"}
              </Button>
            </Form.Item>
            <Form.Item style={{ marginTop: 40 }}>
              <Flex justify="center" gap={20}>
                <a onClick={onChange}>
                  {type === "login" ? "没有账号？去注册" : "已有账号？去登录"}
                </a>
              </Flex>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

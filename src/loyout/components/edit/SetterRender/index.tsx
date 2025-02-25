import React, { memo } from "react";
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Slider,
  FormInstance,
  Tooltip,
  Popover,
} from "antd";
import * as icons from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { SchemaType } from "@/packages/types";
import { CaretDownOutlined } from "@ant-design/icons/lib";
import styles from "./index.module.scss";

interface IAttrs {
  attrs: SchemaType[];
  form: FormInstance;
}

const SetterRender = memo(({ attrs, form }: IAttrs) => {
  console.log(attrs);
  return <>1</>;
});

export default SetterRender;

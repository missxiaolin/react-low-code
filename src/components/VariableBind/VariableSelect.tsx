import { Button, Collapse, Form, Modal, Popover, Tree } from "antd";
import type { CollapseProps } from "antd";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import {
  DownOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { usePageStore } from "@/stores/pageStore";
import VsEditor from "../VsEditor";
import { getElement } from "@/utils/util";
import styles from "./variable.module.scss";
import { cloneDeep } from "lodash-es";

const SelectVariableModal: any = (
  { onSelect }: { onSelect: (record: any) => void },
  ref: any
) => {};

export default memo(forwardRef(SelectVariableModal));

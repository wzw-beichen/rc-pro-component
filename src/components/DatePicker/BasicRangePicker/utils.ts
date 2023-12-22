import { TimeRangePickerProps } from "antd";
import dayjs from "dayjs";

export const getRangePresets: () => TimeRangePickerProps["presets"] = () => [
  {
    label: "今天",
    key: "1d",
    value: [dayjs().startOf("day"), dayjs().endOf("day")],
  },
  {
    label: "最近七天",
    key: "7d",
    value: [dayjs().subtract(7, "d").startOf("day"), dayjs().endOf("day")],
  },
  {
    label: "最近半个月",
    key: "15d",
    value: [dayjs().subtract(15, "d").startOf("day"), dayjs().endOf("day")],
  },
  {
    label: "最近一个月",
    key: "1M",
    value: [dayjs().subtract(1, "M").startOf("day"), dayjs().endOf("day")],
  },
  {
    label: "最近六个月",
    key: "6M",
    value: [dayjs().subtract(6, "M").startOf("day"), dayjs().endOf("day")],
  },
  {
    label: "最近一年",
    key: "1y",
    value: [dayjs().subtract(1, "y").startOf("day"), dayjs().endOf("day")],
  },
];

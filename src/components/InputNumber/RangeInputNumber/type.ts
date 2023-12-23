import { InputNumberProps } from "antd";

export type ChangeType = "min" | "max";

export type ValueType = number | null;
export type RangeInputNumberProps<T extends number | string = number> = {
  minProps?: InputNumberProps<T>;
  maxProps?: InputNumberProps<T>;
  fieldNames?: {
    /** 默认minValue */
    minKey?: string;
    /** 默认maxValue */
    maxKey?: string;
  };
  onChange?: (value: Record<string, ValueType>) => void;
  value?: Record<string, ValueType>;
};

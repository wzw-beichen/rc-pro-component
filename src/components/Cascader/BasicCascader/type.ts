import { CascaderProps } from "antd/es/cascader";
import { Merge } from "c-fn-utils";

export type OptionItem = {
  value: string;
  label: string;
  children?: OptionItem[];
  disabled?: boolean;
};

export type OnSingleChange<OptionType> = (
  value: (string | number)[] | string | number,
  selectOptions: OptionType[]
) => void;

export type BasicCascaderProps<T = OptionItem> = Merge<
  CascaderProps<T>,
  {
    /** value为最后一级 */
    lastLevel?: boolean;
    onChange?: OnSingleChange<OptionItem>;
    value?: string | string[];
    valueType?: "string" | "array";
  }
>;

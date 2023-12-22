import React, { useMemo } from "react";
import { Cascader } from "antd";
import { pickLevelTreeArray } from "c-fn-utils";
import { BasicCascaderProps, OptionItem } from "./type";

const options: OptionItem[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const BasicCascader = (props: BasicCascaderProps) => {
  const {
    onChange,
    multiple,
    lastLevel = true,
    valueType = "array",
    value,
    ...others
  } = props;

  const handleChange = (
    value: (string | number)[],
    selectedOptions: OptionItem[]
  ) => {
    if (lastLevel) {
      let lastValue: (string | number)[] | string | number =
        value?.slice(-1)?.[0];
      if (valueType === "array") {
        lastValue = value?.slice(-1);
      }
      onChange?.(lastValue, selectedOptions);
      return;
    }
    onChange?.(value, selectedOptions);
  };

  const casaderVal = useMemo(() => {
    if (value && lastLevel) {
      let targetValue = value as string;
      if (valueType === "array") {
        targetValue = Array.isArray(value) ? value[0] : null;
      }
      return pickLevelTreeArray(options, targetValue, {
        callback: (item) => item.value,
      });
    }
    return [];
  }, [value, lastLevel]) as (string | number)[];

  return (
    <Cascader
      allowClear
      placeholder="请选择"
      options={options}
      onChange={handleChange as any}
      multiple={multiple}
      value={casaderVal}
      {...others}
    />
  );
};

export default BasicCascader;

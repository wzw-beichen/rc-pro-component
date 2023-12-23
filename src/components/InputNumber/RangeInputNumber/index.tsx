import React from "react";
import { isNumber } from "c-fn-utils";
import PrecisionInputNumber from "../PrecisionInputNumber";
import { RangeInputNumberProps, ChangeType, ValueType } from "./type";
import { defaultConfig } from "../constants";

const RangeInputNumber = (props: RangeInputNumberProps) => {
  const { fieldNames, onChange, value, minProps, maxProps } = props;
  const { minKey = "minValue", maxKey = "maxValue" } = fieldNames || {};

  const { onBlur: minBlur, ...minOthers } = minProps || {};
  const { onBlur: maxBlur, ...maxOthers } = maxProps || {};

  const minValue = value?.[minKey];
  const maxValue = value?.[maxKey];

  const handleChange = (val: ValueType, type: ChangeType) => {
    const changeKey = type === "min" ? minKey : maxKey;
    const changeValue = {
      ...value,
      [changeKey]: val,
    };
    triggerChange(changeValue);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    type: ChangeType
  ) => {
    let minVal: number | boolean = isNumber(minValue);
    let maxVal: number | boolean = isNumber(maxValue);
    if (minVal && maxVal) {
      minVal = Math.min(minValue, maxValue);
      maxVal = Math.max(minValue, maxValue);

      triggerChange({
        [minKey]: minVal,
        [maxKey]: maxVal,
      });
    }
    let func = minBlur;
    if (type === "max") {
      func = maxBlur;
    }
    func?.(e);
  };

  const triggerChange = (val: Record<string, number | null>) => {
    onChange?.(val);
  };

  return (
    <div>
      <PrecisionInputNumber
        value={minValue}
        onChange={(val) => handleChange(val, "min")}
        onBlur={(e) => handleBlur(e, "min")}
        {...defaultConfig}
        {...minOthers}
      />
      <span style={{ margin: "0 2px" }}> ~</span>
      <PrecisionInputNumber
        value={maxValue}
        onChange={(val) => handleChange(val, "max")}
        onBlur={(e) => handleBlur(e, "max")}
        {...defaultConfig}
        {...maxOthers}
      />
    </div>
  );
};

export default RangeInputNumber;

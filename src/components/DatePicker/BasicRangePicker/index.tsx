import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { toArray } from "c-fn-utils";
import { BasicRangePickerProps, RangeValue } from "./type";
import { getRangePresets } from "./utils";

const { RangePicker } = DatePicker;

const BasicRangePicker = (props: BasicRangePickerProps) => {
  const {
    value,
    lessThanToday = true,
    onChange,
    rangeConfig,
    valueType = "dayjs",
    picker,
    presetsFunc,
    ...others
  } = props;
  const { unit = "M", value: rangeValue = 1 } = rangeConfig || {};
  const [dates, setDates] = useState<RangeValue>(null);

  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    let tooLate = false;
    let tooEarly = false;
    let isLessThanToday = false;
    if (unit) {
      tooLate = dates[0] && current.diff(dates[0], unit) >= rangeValue;
      tooEarly = dates[1] && dates[1].diff(current, unit) >= rangeValue;
    }
    if (lessThanToday) {
      isLessThanToday = current > dayjs().endOf("day");
    }
    return tooLate || tooEarly || isLessThanToday;
  };

  const handleChange = (
    rangeValue: RangeValue,
    dateStrings: [string, string]
  ) => {
    if (valueType === "dayjs") {
      onChange?.(rangeValue, dateStrings);
    }
    if (valueType === "string") {
      onChange?.(dateStrings, rangeValue);
    }
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const defaultPresets = getRangePresets();

  const dayjsValue = toArray(value).map((item) => dayjs(item)) as [
    Dayjs,
    Dayjs
  ];

  return (
    <RangePicker
      value={dates || dayjsValue}
      disabledDate={disabledDate}
      onCalendarChange={(val) => {
        setDates(val);
      }}
      onChange={handleChange}
      onOpenChange={onOpenChange}
      changeOnBlur
      presets={presetsFunc ? presetsFunc(defaultPresets) : defaultPresets}
      {...others}
    />
  );
};

export default BasicRangePicker;

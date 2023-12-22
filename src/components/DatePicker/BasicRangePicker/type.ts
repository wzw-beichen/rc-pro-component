import { TimeRangePickerProps } from "antd";
import { RangePickerProps } from "antd/es/date-picker/generatePicker";
import { Merge } from "c-fn-utils";
import { Dayjs, OpUnitType, QUnitType } from "dayjs";

export type RangeValue<T = Dayjs | null> = [T, T] | null;

export type BasicRangePickerProps = Merge<
  RangePickerProps<Dayjs>,
  {
    /** 选择是否小于今天 */
    lessThanToday?: boolean;
    rangeConfig?: {
      // https://dayjs.gitee.io/docs/zh-CN/display/difference
      // 各个传入的单位对大小写不敏感，支持缩写和复数。 请注意，缩写是区分大小写的。
      // day	d	日
      // week	w	Week of Year
      // quarter	Q	Quarter
      // month	M	月份 (一月 0， 十二月 11)
      // year	y	Year
      // hour	h	Hour
      // minute	m	Minute
      // second	s	Second
      // millisecond	ms	Millisecond
      unit?: QUnitType | OpUnitType;
      value?: number;
    };
    valueType?: "string" | "dayjs";
    onChange?: (
      rangeValue: RangeValue | RangeValue<string>,
      dateStrings: RangeValue<string> | RangeValue
    ) => void;
    presetsFunc?: (
      config: TimeRangePickerProps["presets"]
    ) => TimeRangePickerProps["presets"];
  }
>;

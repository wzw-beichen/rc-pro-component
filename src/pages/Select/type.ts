export type LabelValueItem<T = string | number | null> = {
  label: string;
  value?: T;
};

export type FilterType =
  // 首字母匹配
  | "firstLetter"
  // 全拼音匹配
  | "fullPinyin"
  // 汉字匹配
  | "character";

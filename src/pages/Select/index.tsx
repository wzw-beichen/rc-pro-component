import React from "react";
import { Select, SelectProps } from "antd";
import { getPINYINArr } from "./utils";
import { FilterType, LabelValueItem } from "./type";

const options = [
  "唐三藏",
  "艾欧尼亚",
  "祖安",
  "诺克萨斯",
  "班德尔城",
  "皮尔特沃夫",
  "战争学院",
  "巨神峰",
  "雷瑟守备",
  "裁决之地",
  "黑色玫瑰",
  "暗影岛",
  "钢铁烈阳",
  "水晶之痕",
  "均衡教派",
  "影流",
  "守望之海",
  "征服之海",
  "卡拉曼达",
  "皮城警备",
  "藏行将还",
].map((item) => ({ label: item, value: item }));

type Props = SelectProps<LabelValueItem> & {
  /** filterOption过滤类型 */
  filterType?: FilterType[];
};

const BasicSelect = (props: Props) => {
  const { filterType = ["firstLetter", "fullPinyin", "character"] } = props;

  const handleChange = () => {};

  const handleFilterOption = (inputValue: string, option?: LabelValueItem) => {
    const { label = "" } = option || {};
    const isExist = getPINYINArr(inputValue, label, filterType);
    return isExist;
  };

  return (
    <Select
      showSearch={options?.length > 10}
      style={{ width: 120 }}
      onChange={handleChange}
      options={options}
      placeholder="请选择"
      filterOption={handleFilterOption}
    />
  );
};
export default BasicSelect;

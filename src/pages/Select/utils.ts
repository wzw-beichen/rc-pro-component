import { pinyin } from "pinyin-pro";
import { FilterType } from "./type";

export const getPINYINArr = (
  searchValue?: string,
  label?: string,
  filterType?: FilterType[]
): boolean => {
  if (!searchValue) return true;
  if (!label) return false;
  const array = label
    .split("")
    .filter(Boolean)
    .map((item) => {
      return pinyin(item, {
        type: "array",
        multiple: true,
        toneType: "none",
      });
    });
  let newArr: string[] = [];
  if (filterType?.includes("character")) {
    newArr = [...newArr, label];
  }
  if (filterType?.includes("firstLetter")) {
    newArr = [...newArr, ...serialArray(firstLetterArray(array))];
  }
  if (filterType?.includes("fullPinyin")) {
    newArr = [...newArr, ...serialArray(array)];
  }
  return newArr.some((item) => item.includes(searchValue));
};

const firstLetterArray = (array: string[][]): string[][] => {
  const newArray = array.map((item) => {
    const arr = item.reduce<string[]>(
      ((set) => (total, str) => {
        const firstLetter = str[0];
        if (!set.has(firstLetter)) {
          set.add(firstLetter);
          total.push(firstLetter);
        }
        return total;
      })(new Set()),
      []
    );
    return arr;
  });
  return newArray;
};

const serialArray = (array: string[][]): string[] => {
  if (!array || !Array.isArray(array)) return [];
  return array.reduce((prev, cur) => {
    const totalArr: string[] = [];
    prev.forEach((value) => {
      cur.forEach((item) => {
        totalArr.push([value, item].join(""));
      });
    });
    return totalArr;
  });
};

import { get as getValue, set as setValue, toArray } from "c-fn-utils";
import { InternalNamePath, NamePath, Store } from "./type";

/**
 * Convert name to internal supported format.
 * This function should keep since we still thinking if need support like `a.b.c` format.
 * 'a' => ['a']
 * 123 => [123]
 * ['a', 123] => ['a', 123]
 */
export const getNamePath = (path: NamePath | null): InternalNamePath => {
  return toArray(path);
};

export const cloneByNamePathList = (
  store: Store,
  // [["name"]]
  namePathList: InternalNamePath[]
) => {
  let newStore = {};
  namePathList.forEach((namePath) => {
    const value = getValue(store, namePath);
    newStore = setValue(newStore, namePath, value);
  });
  return newStore;
};

// Like `shallowEqual`, but we not check the data which may cause re-render
type SimilarObject = string | number | object;
export const isSimilar = (source: SimilarObject, target: SimilarObject) => {
  if (source === target) {
    return true;
  }

  if ((!source && target) || (source && !target)) {
    return false;
  }

  if (
    !source ||
    !target ||
    typeof source !== "object" ||
    typeof target !== "object"
  ) {
    return false;
  }

  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);
  const keys = new Set([...sourceKeys, ...targetKeys]);

  return Array.from(keys).every((key) => {
    const sourceValue = (source as Record<string, any>)[key];
    const targetValue = (target as Record<string, any>)[key];

    if (
      typeof sourceValue === "function" &&
      typeof targetValue === "function"
    ) {
      return true;
    }
    return sourceValue === targetValue;
  });
};

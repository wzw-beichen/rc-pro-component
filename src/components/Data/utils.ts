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

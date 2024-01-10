import { NotifyInfo } from "../DataStore/type";
import { InternalNamePath, StoreValue } from "../type";
import { ShouldUpdate } from "./type";

export const requireUpdate = (
  shouldUpdate: ShouldUpdate,
  prev: StoreValue,
  next: StoreValue,
  prevValue: StoreValue,
  nextValue: StoreValue,
  info: NotifyInfo
): boolean => {
  if (typeof shouldUpdate === "function") {
    return shouldUpdate(
      prev,
      next,
      "source" in info ? { source: info.source } : {}
    );
  }
  return prevValue !== nextValue;
};

/**
 * Check if `namePathList` includes `namePath`.
 * @param namePathList A list of `InternalNamePath[]`
 * @param namePath Compare `InternalNamePath`
 * @param partialMatch True will make `[a, b]` match `[a, b, c]`
 */
// namePathList = [[a, b]] namePath =[a, b, c]
// paritalMath = false ===> false
// partialMath = true ====> true
export const containsNamePath = (
  namePathList: InternalNamePath[],
  namePath: InternalNamePath,
  partialMatch = false
) => {
  return (
    namePathList.length &&
    namePathList.some((path) => matchNamePath(namePath, path, partialMatch))
  );
};

/**
 * Check if `namePath` is super set or equal of `subNamePath`.
 * @param namePath A list of `InternalNamePath`
 * @param subNamePath Compare `InternalNamePath`
 * @param partialMatch True will make `[a, b]` match `[a, b, c]`
 */
// namePath = [a, b, c] subNamePath = [a, b]
// paritalMath = false ===> false
// partialMath = true ====> true
const matchNamePath = (
  namePath: InternalNamePath,
  subNamePath: InternalNamePath | null,
  partialMatch = false
) => {
  if (!namePath.length || !subNamePath.length) {
    return false;
  }
  if (!partialMatch && namePath.length !== subNamePath.length) {
    return false;
  }
  return subNamePath.every((nameUnit, i) => namePath[i] === nameUnit);
};

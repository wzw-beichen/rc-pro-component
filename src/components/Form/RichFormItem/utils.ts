/**
 * @name 合并props对象
 * @param originProps 原props对象
 * @param patchProps 需要添加合并到props对象
 * @param isAll 是否全部添加
 * @returns composeProps 合并后的props对象
 */
export const composeProps = <T extends Record<string, any>>(
  originProps: T,
  patchProps: Partial<T>,
  isAll?: boolean
) => {
  const composedProps: Record<string, any> = {
    ...originProps,
    ...(isAll ? patchProps : {}),
  };

  Object.keys(patchProps).forEach((key) => {
    const func = patchProps[key];
    if (typeof func === "function") {
      composedProps[key] = (...args: any[]) => {
        func(...args);
        originProps[key]?.(...args);
      };
    }
  });
  return composedProps;
};

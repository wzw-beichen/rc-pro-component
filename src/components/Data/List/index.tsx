import React, { ReactNode, useContext, useMemo, useRef } from "react";
import { NamePath, StoreValue } from "../type";
import { Meta, ShouldUpdate } from "../Field/type";
import ListContext, { ListContextProps } from "./ListContext";
import Field from "../Field";
import FieldContext from "../Field/FieldContext";
import { getNamePath } from "../utils";
import { warning } from "rc-util";
import { arrayExchange } from "c-fn-utils";

export type ListField = {
  name: number;
  key: number;
  isListField: boolean;
};

export type ListOperations = {
  add: (defaultValue?: StoreValue, index?: number) => void;
  remove: (index: number | number[]) => void;
  move: (from: number, to: number) => void;
};

export type ListProps<Values = any> = {
  name?: NamePath<Values>;
  initialValue?: any[];
  children?: (
    fields: ListField[],
    operations: ListOperations,
    meta: Meta
  ) => JSX.Element | ReactNode;

  /** @private Passed by Data.List props. Do not use since it will break by path check. */
  isListField?: boolean;
};

const List = <Values = any,>(props: ListProps<Values>) => {
  const { name, initialValue, children, isListField } = props;

  // Data组件里面就会传递，dataInstance
  const context = useContext(FieldContext);
  // 多List嵌套取里面的prefixName，只有一个的话为null
  const wrapperListContext = useContext(ListContext);

  const keyRef = useRef({
    keys: [] as number[],
    id: 0,
  });

  const keyManager = keyRef.current;

  const prefixName = useMemo(() => {
    const parentPrefixName = getNamePath(context.prefixName) || [];
    return [...parentPrefixName, ...getNamePath(name)];
  }, [context.prefixName, name]);

  const fieldContext = useMemo(
    () => ({
      ...context,
      prefixName,
    }),
    [context, prefixName]
  );

  // List context
  const listContext = useMemo<ListContextProps>(
    () => ({
      getKey: (namePath) => {
        const len = prefixName.length;
        const pathName = namePath[len];
        return [keyManager.keys[pathName as number], namePath.slice(len + 1)];
      },
    }),
    [prefixName]
  );

  console.log("listContext", listContext);
  // User should not pass `children` as other type.
  if (typeof children !== "function") {
    warning(false, "Data.List only accepts function as children.");
    return null;
  }

  const shouldUpdate: ShouldUpdate = (prevValue, nextValue, { source }) => {
    // internal 里面的 onChange
    // external 外部的 setFieldsValue
    if (source === "internal") {
      return false;
    }
    return prevValue !== nextValue;
  };

  return (
    <ListContext.Provider value={listContext}>
      <FieldContext.Provider value={fieldContext}>
        <Field
          name={[]}
          shouldUpdate={shouldUpdate}
          initialValue={initialValue}
          isList
          isListField={isListField ?? !!wrapperListContext}
        >
          {({ value, onChange }, meta) => {
            const { getFieldValue } = context;
            const getNewValue = () => {
              const values = getFieldValue(prefixName || []) as StoreValue[];
              return values || [];
            };

            /**
             * Always get latest value in case user update fields by `data` api.
             */
            const operations: ListOperations = {
              add: (defaultValue, index?: number) => {
                // Mapping keys
                const newValue = getNewValue();
                if (index >= 0 && index <= newValue.length) {
                  keyManager.keys = [
                    ...keyManager.keys.slice(0, index),
                    keyManager.id,
                    ...keyManager.keys.slice(index),
                  ];
                  onChange([
                    ...newValue.slice(0, index),
                    defaultValue,
                    ...newValue.slice(index),
                  ]);
                } else {
                  if (index < 0 || index > newValue.length) {
                    warning(
                      false,
                      "The second parameter of the add function should be a valid positive number."
                    );
                  }
                  keyManager.keys = [...keyManager.keys, keyManager.id];
                  onChange([...newValue, defaultValue]);
                }
                keyManager.id += 1;
              },
              remove: (index) => {
                const newValue = getNewValue();
                const indexSet = new Set(
                  Array.isArray(index) ? index : [index]
                );
                if (indexSet.size <= 0) {
                  return;
                }

                keyManager.keys = keyManager.keys.filter(
                  (_, keysIndex) => !indexSet.has(keysIndex)
                );
                // Trigger store change
                onChange(
                  newValue.filter((_, valueIndex) => !indexSet.has(valueIndex))
                );
              },
              move: (from, to) => {
                if (from === to) return;

                const newValue = getNewValue();
                // Do not handle out of range
                if (
                  from < 0 ||
                  from >= newValue.length ||
                  to < 0 ||
                  to >= newValue.length
                ) {
                  return;
                }
                keyManager.keys = arrayExchange(keyManager.keys, from, to);
                onChange(arrayExchange(newValue, from, to));
              },
            };

            let listValue = (value as any[]) || [];
            return children(
              listValue.map((_, index) => {
                let key = keyManager.keys[index];
                if (key === undefined) {
                  keyManager.keys[index] = keyManager.id;
                  key = keyManager.keys[index];
                  keyManager.id += 1;
                }
                return {
                  name: index,
                  key,
                  isListField: true,
                };
              }),
              operations,
              meta
            );
          }}
        </Field>
      </FieldContext.Provider>
    </ListContext.Provider>
  );
};

export default List;

import React from "react";
import { Form, FormInstance, FormItemProps } from "antd";
import { pickObjectField } from "c-fn-utils";

type RelatedKey = string | number;
type Props = FormItemProps & {
  children: (
    changedValue: Record<string, any>,
    form: FormInstance
  ) => JSX.Element;
  relatedKey: Array<RelatedKey[] | RelatedKey>;
};
const FormItemShouldUpdate = (props: Props) => {
  const { children, relatedKey, ...others } = props;

  const handleShouldUpdate = (
    prevValues: Record<string, any>,
    nextValues: Record<string, any>
  ) => {
    if (relatedKey) {
      return relatedKey.some((key) => {
        if (Array.isArray(key)) {
          const prevValue = pickObjectField(prevValues, key);
          const nextValue = pickObjectField(nextValues, key);
          return prevValue !== nextValue;
        }
        return prevValues[key] !== nextValues[key];
      });
    }
    return false;
  };

  return (
    <Form.Item shouldUpdate={handleShouldUpdate} {...others}>
      {(form) => {
        const values = form.getFieldsValue();
        const changedValue = relatedKey.reduce<Record<string, any>>(
          (total, key) => {
            if (Array.isArray(key)) {
              const keyStr = key.join("_");
              const val = pickObjectField(values, key);
              total[keyStr] = val;
              return total;
            }
            total[key] = values[key];
            return total;
          },
          {}
        );
        return children(changedValue, form);
      }}
    </Form.Item>
  );
};

export default FormItemShouldUpdate;

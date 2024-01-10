import { ReactNode } from "react";
import { Store } from "../type";
import { DataInstance } from "../DataStore/type";
import { FieldData } from "../Field/type";

export type RenderProps = (
  values: Store,
  data: DataInstance
) => JSX.Element | ReactNode;

export type DataProps<Values = any> = {
  initialValues?: Store;
  data?: DataInstance<Values>;
  children?: RenderProps | ReactNode;
  component?: false | string | React.FC<any> | React.ComponentClass<any>;
  name?: string;
  onValuesChange?: Callbacks["onValuesChange"];
  onFieldsChange?: Callbacks["onFieldsChange"];
  /** 当字段被删除时保留字段值, 默认true */
  preserve?: boolean;
};

export type Callbacks<Values = any> = {
  onValuesChange?: (changedValues: Store, values: Values) => void;
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
};

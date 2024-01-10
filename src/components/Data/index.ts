import InternalData from "./Data";
import useData from "./useData";
import Field from "./Field";

type InternalDataType = typeof InternalData;

type CompoundedComponent = InternalDataType & {
  useData: typeof useData;
  Item: typeof Field;
};

const Data = InternalData as CompoundedComponent;

Data.Item = Field;
Data.useData = useData;

export { Data, Field, useData };

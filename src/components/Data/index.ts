import InternalData from "./Data";
import useData from "./useData";
import Field from "./Field";
import { DataProvider } from "./Data/DataContext";
import List from "./List";

type InternalDataType = typeof InternalData;

type CompoundedComponent = InternalDataType & {
  useData: typeof useData;
  Item: typeof Field;
  DataProvider: typeof DataProvider;
  List: typeof List;
};

const Data = InternalData as CompoundedComponent;

Data.Item = Field;
Data.useData = useData;
Data.DataProvider = DataProvider;
Data.List = List;

export { Data, Field, useData };

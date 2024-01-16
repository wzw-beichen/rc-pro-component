import React, { ReactNode, createContext, useContext } from "react";
import { DataInstance } from "../DataStore/type";
import { FieldData } from "../Field/type";

export type Datas = Record<string, DataInstance>;

export type DataChangeInfo = {
  changedFields: FieldData[];
  datas: Datas;
};
export type DataProviderProps = {
  onDataChange?: (name: string, info: DataChangeInfo) => void;
  children?: ReactNode;
};

export type DataContextProps = DataProviderProps & {
  triggerDataChange?: (name: string, changedFields: FieldData[]) => void;
  registerData: (name: string, data: DataInstance) => void;
  unregisterData: (name: string) => void;
};

const DataContext = createContext<DataContextProps>({
  triggerDataChange: () => {},
  registerData: (...rest) => {
    // console.log("registerData", rest);
  },
  unregisterData: () => {},
});

const DataProvider = (props: DataProviderProps) => {
  const { onDataChange, children } = props;

  const dataContext = useContext(DataContext);

  const datasRef = React.useRef<Datas>({});

  return (
    <DataContext.Provider
      value={{
        ...dataContext,
        // =========================================================
        // =                  Global Data Control                  =
        // =========================================================

        triggerDataChange: (name, changedFields) => {
          if (onDataChange) {
            onDataChange(name, {
              changedFields,
              datas: datasRef.current,
            });
          }
          dataContext.triggerDataChange(name, changedFields);
        },
        registerData: (name, data) => {
          if (name) {
            datasRef.current = {
              ...datasRef.current,
              [name]: data,
            };
          }
          dataContext.registerData(name, data);
        },
        unregisterData: (name) => {
          const newDatas = { ...datasRef.current };
          delete newDatas[name];
          datasRef.current = newDatas;
          dataContext.unregisterData(name);
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataProvider };

export default DataContext;

import { useRef, useState } from "react";
import { DataStore } from "../DataStore";
import { DataInstance } from "../DataStore/type";

const useData = <Values = any>(
  data?: DataInstance<Values>
): [DataInstance<Values>] => {
  const dataRef = useRef<DataInstance>();
  const [, forceUpdate] = useState({});

  if (!dataRef.current) {
    if (data) {
      dataRef.current = data;
    } else {
      // Create a new DataStore if not provided
      const forceReRender = () => {
        forceUpdate({});
      };

      const dataStore = new DataStore(forceReRender);
      dataRef.current = dataStore.getData();
    }
  }
  return [dataRef.current];
};

export default useData;

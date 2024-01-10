#### useData
```
import { useRef, useState } from "react";
import { DataStore } from "./dataStore";

const useData = (data) => {
  const dataRef = useRef();
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
```
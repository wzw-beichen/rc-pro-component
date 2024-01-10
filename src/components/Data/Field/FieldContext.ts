import { createContext } from "react";
import { InternalDataInstance } from "../DataStore/type";

const warningFunc: any = () => {};

const FieldContext = createContext<InternalDataInstance>({
  getFieldValue: warningFunc,
  getFieldsValue: warningFunc,
  setFields: warningFunc,
  setFieldValue: warningFunc,

  getInternalHooks: () => {
    return {
      dispath: warningFunc,
      initEntityValue: warningFunc,
      registerField: warningFunc,
      useSubscribe: warningFunc,
      setInitialValues: warningFunc,
      destoryData: warningFunc,
      setCallbacks: warningFunc,
      getFields: warningFunc,
      setPreserve: warningFunc,
      getInitialValue: warningFunc,
      registerWatch: warningFunc,
    };
  },
});

export default FieldContext;

import { createContext } from "react";
import { InternalDataInstance } from "../DataStore/type";
import warning from "rc-util/lib/warning";

const warningFunc: any = () => {
  warning(
    false,
    "Can not find DataContext. Please make sure you wrap Field under Data."
  );
};

const FieldContext = createContext<InternalDataInstance>({
  getFieldValue: warningFunc,
  getFieldsValue: warningFunc,
  resetFields: warningFunc,
  setFields: warningFunc,
  setFieldValue: warningFunc,
  setFieldsValue: warningFunc,

  getInternalHooks: () => {
    return {
      dispatch: warningFunc,
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

import React, {
  ForwardRefRenderFunction,
  ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import FieldContext from "../Field/FieldContext";
import DataContext from "./DataContext";
import useData from "../useData";
import { HOOK_MARK } from "../constants";
import { DataProps } from "./type";
import {
  DataInstance,
  InternalDataInstance,
  InternalHooks,
} from "../DataStore/type";
import { Store } from "../type";
import ListContext from "../List/ListContext";
import { FieldData } from "../Field/type";
import { isSimilar } from "../utils";

const InternalData: ForwardRefRenderFunction<DataInstance, DataProps> = (
  props,
  ref
) => {
  const {
    initialValues,
    data,
    children,
    component: Component = "div",
    fields,
    name,
    preserve,
    onValuesChange,
    onFieldsChange,
    ...others
  } = props;

  const dataContext = useContext(DataContext);

  const [dataInstance] = useData(data);

  const {
    useSubscribe,
    setInitialValues,
    setCallbacks,
    setPreserve,
    destoryData,
    registerWatch,
  } = (dataInstance as InternalDataInstance).getInternalHooks(
    HOOK_MARK
  ) as InternalHooks;

  // Pass ref with data instance
  useImperativeHandle(ref, () => dataInstance);

  // Register data into Context
  React.useEffect(() => {
    dataContext.registerData(name, dataInstance);
    return () => {
      dataContext.unregisterData(name);
    };
  }, [dataContext, dataInstance, name]);

  setCallbacks({
    onValuesChange,
    onFieldsChange: (changedFields, ...rest) => {
      dataContext.triggerDataChange(name, changedFields);

      if (onFieldsChange) {
        onFieldsChange(changedFields, ...rest);
      }
    },
  });

  setPreserve(preserve);

  // Set initial value, init store value when first mount
  const mountRef = useRef(false);
  setInitialValues(initialValues as Store, !mountRef.current);
  if (!mountRef.current) {
    mountRef.current = true;
  }

  /** 组件销毁时会触发destoryData方法 */
  useEffect(() => {
    return () => {
      destoryData();
      // unRegisterWatch();
    };
  }, []);

  // Prepare children by `children` type
  let childrenNode = children as ReactNode;
  const childrenRenderProps = typeof children === "function";
  if (childrenRenderProps) {
    const values = data?.getFieldsValue(true);
    childrenNode = children(values, dataInstance);
  }

  // Not use subscribe when using render props
  useSubscribe(!childrenRenderProps);

  // Listen if fields provided. We use ref to save prev data here to avoid additional render
  const prevFieldsRef = useRef<FieldData[] | undefined>();

  useEffect(() => {
    if (!isSimilar(fields || [], prevFieldsRef.current || [])) {
      dataInstance.setFields(fields || []);
    }
    prevFieldsRef.current = fields;
  }, [fields, dataInstance]);

  const dataContextValue = useMemo(
    () => ({
      ...(dataInstance as InternalDataInstance),
    }),
    [dataInstance]
  );

  const wrappedNode = (
    <ListContext.Provider value={null}>
      <FieldContext.Provider value={dataContextValue}>
        {childrenNode}
      </FieldContext.Provider>
    </ListContext.Provider>
  );
  if (Component === false) {
    return wrappedNode;
  }

  return <Component {...others}>{wrappedNode}</Component>;
};

const Data = forwardRef<DataInstance, DataProps>(InternalData) as (<
  Values = any
>(
  props: React.PropsWithChildren<DataProps<Values>> &
    React.RefAttributes<DataInstance<Values>>
) => React.ReactElement) & { displayName?: string };

export default Data;

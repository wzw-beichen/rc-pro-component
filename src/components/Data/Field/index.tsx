import React, { isValidElement, useContext } from "react";
import { Component, ReactNode } from "react";
import { HOOK_MARK } from "../constants";
import { InternalNamePath, NamePath, Store, StoreValue } from "../type";
import {
  DataInstance,
  InternalDataInstance,
  InternalHooks,
} from "../DataStore/type";
import { EventArgs, FieldEntity, Meta, MetaEvent, ShouldUpdate } from "./type";
import FieldContext from "./FieldContext";
import { getNamePath } from "../utils";
import { get as getValue, defaultGetValueFormEvent } from "c-fn-utils";
import { requireUpdate, containsNamePath } from "./utils";
import isEqual from "rc-util/lib/isEqual";
import ListContext from "../List/ListContext";
import { warning } from "rc-util";

type ChildProps = {
  [name: string]: any;
};

export type InternalFieldProps<Values = any> = {
  children?:
    | ReactNode
    | ((
        control: ChildProps,
        meta: Meta,
        form: DataInstance<Values>
      ) => ReactNode);
  /**
   * Set up `dependencies` field.
   * 设置依赖字段
   * When dependencies field update and current field is touched,
   */
  dependencies?: NamePath[];
  getValueFromEvent?: (...args: EventArgs) => StoreValue;
  /** 字段名，支持数组 */
  name?: InternalNamePath;
  normalize?: (
    value: StoreValue,
    prevValue: StoreValue,
    allValues: StoreValue
  ) => StoreValue;
  shouldUpdate?: ShouldUpdate<Values>;
  trigger?: string;
  valuePropName?: string;
  getValueProps?: (value: StoreValue) => Record<string, unknown>;
  /** 设置子元素默认值，如果与Data的`initialValues`冲突则以Data为准 */
  initialValue?: any;
  onReset?: () => void;
  onMetaChange?: (meta: MetaEvent, oldMeat: MetaEvent | null) => void;

  /**
   * 当字段被删除时保留字段值, 默认为true
   * 当 `preserve` 为false时，不会保留字段值，有默认值仍会使用默认值，无默认值则清空
   */
  preserve?: boolean;

  /** @private Passed by Data.List props. Do not use since it will break by path check. */
  isList?: boolean;

  /** @private Passed by Data.List props. Do not use since it will break by path check. */
  isListField?: boolean;
  /**
   * 将`context`作为`prop`，而不是`context`api传递.
   * 因为类组件无法在构造函数中获取`context`.
   */
  fieldContext?: InternalDataInstance;
};

export type FieldProps<Values = any> = Omit<
  InternalFieldProps<Values>,
  "name" | "fieldContext"
> & {
  name?: NamePath<Values>;
};

export type FieldState = {
  resetCount: number;
};

class Field extends Component<InternalFieldProps, FieldState> {
  public static defaultProps = {
    trigger: "onChange",
    valuePropName: "value",
  };

  public state = {
    resetCount: 0,
  };

  private cancelRegisterField:
    | ((
        isListField?: boolean,
        preserve?: boolean,
        namePath?: InternalNamePath
      ) => void)
    | null = null;

  private mounted = false;

  // touched 触摸; 接触; 移动; 触及;
  private touched = false;

  private dirty = false;

  // ============================== Subscriptions ==============================
  constructor(props: InternalFieldProps) {
    super(props);
    // Register on init
    if (props.fieldContext) {
      const { getInternalHooks } = props.fieldContext;
      const { initEntityValue } = getInternalHooks(HOOK_MARK) as InternalHooks;

      initEntityValue(this);
    }
  }

  public componentDidMount() {
    const { fieldContext, shouldUpdate } = this.props;

    this.mounted = true;

    // Register on init
    if (fieldContext) {
      const { getInternalHooks } = fieldContext;
      const { registerField } = getInternalHooks(HOOK_MARK) as InternalHooks;
      this.cancelRegisterField = registerField(this);
    }

    if (shouldUpdate) {
      this.reRender();
    }
  }

  public componentWillUnmount() {
    this.cancelRegiser();

    this.triggerMetaEvent(true);
    this.mounted = false;
  }

  public cancelRegiser = () => {
    const { preserve, name, isListField } = this.props;

    if (this.cancelRegisterField) {
      this.cancelRegisterField(isListField, preserve, name);
    }
    this.cancelRegisterField = null;
  };

  // =========== 方法 ===========
  public getNamePath = (): InternalNamePath => {
    const { name, fieldContext } = this.props;
    const { prefixName = [] } = fieldContext as InternalDataInstance;

    return name !== undefined ? [...prefixName, ...name] : [];
  };

  public reRender = () => {
    this.forceUpdate();
  };

  public refresh = () => {
    if (!this.mounted) return;

    /**
     * Clean up current node.
     */
    this.setState(({ resetCount }) => ({
      resetCount: resetCount + 1,
    }));
  };

  // Event should only trigger when meta changed
  private metaCache: MetaEvent = null;

  private triggerMetaEvent = (destory?: boolean) => {
    const { onMetaChange } = this.props;
    if (onMetaChange) {
      const meta = { ...this.getMeta(), destory };
      if (!isEqual(meta, this.metaCache)) {
        onMetaChange(meta, this.metaCache);
      }
      this.metaCache = meta;
    } else {
      this.metaCache = null;
    }
  };
  // ========================= Field Entity Interfaces =========================
  // Trigger by store update. Check if need update the component
  public onStoreChange: FieldEntity["onStoreChange"] = (
    prevStore,
    namePathList,
    info
  ) => {
    const { store, type } = info;
    const { shouldUpdate, dependencies = [], onReset } = this.props;

    const namePath = this.getNamePath();
    const prevValue = this.getValue(prevStore);
    const currValue = this.getValue(store);

    // namePathList = [[A], [B]] namePath = [A]
    // 完全匹配，查找改变的Field自身
    // 当为setFieldsValue时，namePathList为null
    const namePathMatch =
      namePathList && containsNamePath(namePathList, namePath);
    // console.log("namePathMatch", namePathList, namePath, namePathMatch);
    // internal 里面的 onChange
    // extennal 外部的 setFieldsValue
    // `setFieldsValue` is a quick access to update related status
    if (
      type === "valueUpdate" &&
      info.source === "external" &&
      prevValue !== currValue
    ) {
      this.touched = true;
      this.dirty = true;

      this.triggerMetaEvent();
    }
    switch (type) {
      case "reset": {
        if (!namePathList || namePathMatch) {
          // Clean up state
          this.touched = false;
          this.dirty = false;

          this.triggerMetaEvent();
          onReset?.();

          this.reRender();
          return;
        }
        break;
      }
      case "setField": {
        const { data } = info;
        // [[A], [B]] [A]
        if (namePathMatch) {
          if ("touched" in data) {
            this.touched = data.touched;
          }

          this.dirty = true;

          this.triggerMetaEvent();
          this.reRender();
          return;
        }
        // [[A], [B]] [A, B] 部分匹配
        if ("value" in data && containsNamePath(namePathList, namePath, true)) {
          // setFieldValue会部分匹配
          // Contains path with value should also check
          this.reRender();
          return;
        }
        // Handle update by `setField` with `shouldUpdate`
        if (
          shouldUpdate &&
          !namePath.length &&
          // 若Field props中存在shouldUpdate方法，则传递prevStore、store、info进行自定义验证，返回true则更新，false则不更新
          // 若不存在shouldUpdate方法，只需要对比prevValue !== currValue
          requireUpdate(
            shouldUpdate,
            prevStore,
            store,
            prevValue,
            currValue,
            info
          )
        ) {
          this.reRender();
          return;
        }
        break;
      }

      case "dependenciesUpdate": {
        const dependencyList = dependencies.map(getNamePath);

        if (
          dependencyList.some((dependency) =>
            containsNamePath(info.relatedFields, dependency)
          )
        ) {
          this.reRender();
          return;
        }
        break;
      }
      default:
        // namePathMatch 部分匹配
        // 1. If `namePath` exists in `namePathList`, means it's related value and should update
        //      For example <List name="list"><Field name={['list', 0]}></List>
        //      If `namePathList` is [['list']] (List value update), Field should be updated
        //      If `namePathList` is [['list', 0]] (Field value update), List shouldn't be updated
        // 2.
        //   2.1 If `dependencies` is set, `name` is not set and `shouldUpdate` is not set,
        //       don't use `shouldUpdate`. `dependencies` is view as a shortcut if `shouldUpdate`
        //       is not provided
        //   2.2 If `shouldUpdate` provided, use customize logic to update the field
        //       else to check if value changed
        if (
          namePathMatch ||
          ((!dependencies.length || namePath.length || shouldUpdate) &&
            // 若Field props中存在shouldUpdate方法，则传递prevStore、store、info进行自定义验证，返回true则更新，false则不更新
            // 若不存在shouldUpdate方法，只需要对比prevValue !== currValue
            requireUpdate(
              shouldUpdate,
              prevStore,
              store,
              prevValue,
              currValue,
              info
            ))
        ) {
          this.reRender();
          return;
        }
        break;
    }

    if (shouldUpdate === true) {
      this.reRender();
    }
  };

  public isFieldTouched = () => !!this.touched;

  public isFieldDirty = () => {
    // Touched or validate or has initialValue
    const { initialValue, fieldContext } = this.props;
    if (this.dirty || initialValue !== undefined) {
      return true;
    }

    const { getInternalHooks } = fieldContext;
    const { getInitialValue } = getInternalHooks(HOOK_MARK);

    // Data set initialValue
    if (getInitialValue(this.getNamePath()) !== undefined) {
      return true;
    }
    return false;
  };

  public isListField = () => !!this.props.isListField;

  public isList = () => !!this.props.isList;

  public isPreserve = () => !!this.props.preserve;

  // ============================= Child Component =============================
  public getMeta = (): Meta => {
    const meta = {
      touched: this.isFieldTouched(),
      dirty: this.isFieldDirty(),
      name: this.getNamePath(),
    };
    return meta;
  };

  // Only return validate child node. If invalidate, will do nothing about field.
  public getOnlyChild = (
    children: InternalFieldProps["children"]
  ): {
    child: ReactNode | null;
    isFunction: boolean;
  } => {
    const { fieldContext } = this.props;

    // Support render props
    // render props没有透传onChange、value值
    // 需要透传的话需要克隆一下child将onChange、value传递进去
    if (typeof children === "function") {
      const meta = this.getMeta();
      const controlled = this.getControlled();
      const nodeChildren = children(controlled, meta, fieldContext);
      let childNode = nodeChildren;
      if (!Array.isArray(nodeChildren)) {
        childNode = React.cloneElement(
          nodeChildren as React.ReactElement,
          controlled
        );
      }
      return {
        ...this.getOnlyChild(childNode),
        isFunction: true,
      };
    }
    // Filed element only
    const childList = React.Children.toArray(children);

    if (childList.length !== 1 || !isValidElement(childList[0])) {
      return {
        child: childList,
        isFunction: false,
      };
    }
    return {
      child: childList[0],
      isFunction: false,
    };
  };

  // ============================== Field Control ==============================
  public getValue = (store?: Store) => {
    const { fieldContext } = this.props;
    const { getFieldsValue } = fieldContext;
    const namePath = this.getNamePath();
    const newStore = store || getFieldsValue(true);
    return getValue(newStore, namePath);
  };

  public getControlled = (childProps: ChildProps = {}) => {
    const {
      trigger,
      getValueFromEvent,
      normalize,
      valuePropName,
      getValueProps,
      fieldContext,
    } = this.props;

    const namePath = this.getNamePath();
    const { getInternalHooks, getFieldsValue } = fieldContext;
    const { dispatch } = getInternalHooks(HOOK_MARK);

    // 未传name，value会是store
    const value = this.getValue();

    // 设置getValueProps之后，自定义valuePropName会失效。
    const mergedGetValueProps =
      getValueProps || ((val: StoreValue) => ({ [valuePropName]: val }));

    // 重写trigger方法，实现更新store值，并触发组件自身传递的trigger方法
    const originTriggerFunc = childProps[trigger];
    const control = {
      ...childProps,
      ...mergedGetValueProps(value),
    };

    control[trigger] = (...args: EventArgs) => {
      // Mark as touched
      this.touched = true;
      this.dirty = true;

      this.triggerMetaEvent();

      let newValue: StoreValue;
      // 设置如何将 event 的值转换成字段值
      // 例如 onChage事件参数给你，你转换给value返回回来即可
      // defaultGetValueFromEvent事件逻辑 valuePropName = "value"
      // event.target存在valuePropName，则会取event.target[valuePropName]
      // 不然会直接取event
      if (getValueFromEvent) {
        newValue = getValueFromEvent(...args);
      } else {
        newValue = defaultGetValueFormEvent(valuePropName, ...args);
      }
      if (normalize) {
        newValue = normalize(newValue, value, getFieldsValue(true));
      }
      dispatch({
        type: "updateValue",
        namePath,
        value: newValue,
      });
      originTriggerFunc?.(...args);
    };
    return control;
  };

  render() {
    const { resetCount } = this.state;
    const { children } = this.props;

    const { child, isFunction } = this.getOnlyChild(children);
    let returnChildNode = children;

    if (isFunction) {
      returnChildNode = child;
    } else if (isValidElement(child)) {
      const newProps = this.getControlled(child.props);
      // cloneElement 给child加value、onChange等事件
      returnChildNode = React.cloneElement(child, newProps);
    } else {
      returnChildNode = child;
    }

    return <React.Fragment key={resetCount}>{returnChildNode}</React.Fragment>;
  }
}

const WrapperField = <Values = any,>(props: FieldProps<Values>) => {
  const { name, ...restProps } = props;
  const fieldContext = useContext(FieldContext);
  const listContext = useContext(ListContext);

  const namePath = name !== undefined ? getNamePath(name) : undefined;

  let key = "keep";
  if (!restProps.isListField) {
    key = `_${(namePath || []).join("_")}`;
  }

  // Warning if it's a directly list field.
  // We can still support multiple level field preserve.
  if (
    restProps.isListField &&
    restProps.preserve === false &&
    namePath.length <= 1
  ) {
    warning(false, "`preserve` should not apply on Data.List fields.");
  }

  return (
    <div>
      {!restProps.shouldUpdate && (
        <span style={{ marginRight: 10 }}>
          {namePath?.toString() || "无name"}:
        </span>
      )}
      <Field
        key={key}
        name={namePath}
        fieldContext={fieldContext}
        isListField={!!listContext}
        {...restProps}
      />
    </div>
  );
};
export default WrapperField;

import {
  get as getValue,
  set as setValue,
  NameMap,
  matchNamePath,
} from "c-fn-utils";
import { merge } from "rc-util/lib/utils/set";
import warning from "rc-util/lib/warning";
import { HOOK_MARK, INVALIDATE_NAME_PATH } from "../constants";
import {
  FilterFunc,
  GetFieldsValueConfig,
  InternalDataInstance,
  InternalHooks,
  NotifyInfo,
  ReducerAction,
  WatchCallBack,
  WatchCallBackType,
} from "./type";
import { InternalNamePath, NamePath, Store } from "../type";
import { cloneByNamePathList, getNamePath } from "../utils";
import {
  FieldData,
  FieldEntity,
  InternalFieldData,
  InvalidateFieldEntity,
} from "../Field/type";
import { StoreValue } from "antd/es/form/interface";
import { Callbacks } from "../Data/type";
import { containsNamePath } from "../Field/utils";

export class DataStore {
  private dataHooked = false;

  private forceRootUpdate: () => void;

  private subscribable = true;

  private store: Store = {};

  private fieldEntities: FieldEntity[] = [];

  private initialValues: Store = {};

  private callbacks: Callbacks = {};

  private preserve?: boolean | null = null;

  constructor(forceReRender: () => void) {
    this.forceRootUpdate = forceReRender;
  }

  public getData: () => InternalDataInstance = () => {
    return {
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      resetFields: this.resetFields,
      setFields: this.setFields,
      setFieldValue: this.setFieldValue,
      setFieldsValue: this.setFieldsValue,
      _init: true,

      getInternalHooks: this.getInternalHooks,
    };
  };

  // ======================== Internal Hooks ========================
  private getInternalHooks = (key: string): InternalHooks | null => {
    if (key === HOOK_MARK) {
      this.dataHooked = true;

      return {
        dispatch: this.dispatch,
        initEntityValue: this.initEntityValue,
        registerField: this.registerField,
        useSubscribe: this.useSubscribe,
        setInitialValues: this.setInitialValues,
        destoryData: this.destoryData,
        setCallbacks: this.setCallbacks,
        getFields: this.getFields,
        setPreserve: this.setPreserve,
        getInitialValue: this.getInitialValue,
        registerWatch: this.registerWatch,
      };
    }

    warning(
      false,
      "`getInternalHooks` is internal usage. Should not call directly."
    );
    return null;
  };

  private useSubscribe = (subscribable: boolean) => {
    this.subscribable = subscribable;
  };

  /**
   * 记录上一个数据卸载配置preserve为false的实体字段，
   * 这需要用初始值`initialValues`而不是存储值`store`重新填充。
   */
  private prevWithoutPreserves: NameMap<boolean> | null = null;

  private setInitialValues = (initialValues: Store, init: boolean) => {
    this.initialValues = initialValues || {};
    if (init) {
      let nextStore = merge(this.initialValues, this.store);
      // 我们将考虑上个数据卸载字段。
      // 当Field`preserve`为false时，我们需要用初始值`initialValues`来填充，而不是存储值`store`。
      this.prevWithoutPreserves?.map(({ key: namePath }) => {
        nextStore = setValue(
          nextStore,
          namePath,
          getValue(initialValues, namePath)
        );
      });
      this.prevWithoutPreserves = null;

      this.updateStore(nextStore);
    }
  };

  // Data销毁时会触发，记录preserve的值
  private destoryData = () => {
    const prevWithoutPreserves = new NameMap<boolean>();
    const entities = this.getFieldEntities(true);

    entities.forEach((entity) => {
      const preserve = entity.isPreserve();
      const namePath = entity.getNamePath();

      // 当 `prevserve` 为 `false` 时，则保存起来，当组件重新渲染需要赋值的时候根据 `this.prevWithoutPreserves`
      // 来决定时使用 `store` 还是 `initialValues` 中的值
      if (!this.isMergedPreserve(preserve)) {
        prevWithoutPreserves.set(namePath, true);
      }
    });
    this.prevWithoutPreserves = prevWithoutPreserves;
  };

  private getInitialValue = (namePath: InternalNamePath) => {
    const initValue = getValue(this.initialValues, namePath) as Record<
      string,
      any
    >;

    // Not cloneDeep when without `namePath`
    return namePath.length && initValue ? merge(initValue) : initValue;
  };

  private setCallbacks = (callbacks: Callbacks) => {
    this.callbacks = callbacks;
  };

  private setPreserve = (preserve?: boolean) => {
    this.preserve = preserve;
  };

  // ============================= Watch ============================
  private watchList: WatchCallBack[] = [];

  private registerWatch: InternalHooks["registerWatch"] = (callback) => {
    this.watchList.push(callback);

    // 取消监听
    return () => {
      this.watchList = this.watchList.filter((fn) => fn !== callback);
    };
  };

  private notifyWatch = (
    namePath: InternalNamePath[] = [],
    info?: WatchCallBackType
  ) => {
    // No need to cost perf when nothing need to watch
    if (this.watchList.length) {
      const value = this.getFieldsValue();
      const allValue = this.getFieldsValue(true);

      this.watchList.forEach((callback) => {
        callback(value, allValue, namePath, info);
      });
    }
  };

  // ========================== Dev Warning =========================
  private timeoutId: NodeJS.Timeout | null = null;

  private warningUnhooked = () => {
    if (
      process.env.NODE_ENV !== "production" &&
      !this.timeoutId &&
      typeof window !== "undefined"
    ) {
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;

        if (!this.dataHooked) {
          warning(
            false,
            "Instance create by `useData` is not connected to by any Data element. Forget to pass `data` prop?"
          );
        }
      });
    }
  };

  // ============================ Store =============================
  private updateStore = (nextStore: Store) => {
    this.store = nextStore;
  };

  // ============================ Fields ============================
  /**
   * Get registered field entities.
   * @param pure Only return field which has a `name`. Default: false
   */
  private getFieldEntities = (pure = false) => {
    if (!pure) {
      return this.fieldEntities;
    }

    return this.fieldEntities.filter((field) => field.getNamePath().length);
  };

  // 把fieldEntities转为nameMap格式 { key: field.getNamePath(), value: field }
  private getFieldsMap = (pure: boolean = false) => {
    const cache = new NameMap<FieldEntity>();

    const fieldEntities = this.getFieldEntities(pure);
    fieldEntities.forEach((field) => {
      const namePath = field.getNamePath();
      cache.set(namePath, field);
    });
    return cache;
  };

  private getFieldEntitiesForNamePathList = (
    nameList?: NamePath[] | null
  ): (FieldEntity | InvalidateFieldEntity)[] => {
    if (!nameList) {
      return this.getFieldEntities(true);
    }
    const cache = this.getFieldsMap(true);
    return nameList.map((name) => {
      const namePath = getNamePath(name);

      return cache.get(namePath) || { [INVALIDATE_NAME_PATH]: namePath };
    });
  };

  private getFieldsValue = (
    nameList?: NamePath[] | true | GetFieldsValueConfig,
    filterFunc?: FilterFunc
  ): Store => {
    // Fill args
    // 根据参数不同处理 `nameList`, `filterFunc`
    let mergedNameList: NamePath[] | true;
    let mergedFilterFunc: FilterFunc;
    let mergedStrict: boolean;

    if (nameList === true || Array.isArray(nameList)) {
      mergedNameList = nameList;
      mergedFilterFunc = filterFunc;
    } else if (nameList && typeof nameList === "object") {
      mergedStrict = nameList.strict;
      mergedFilterFunc = nameList.filter;
    }

    if (nameList === true && !mergedFilterFunc) {
      return this.store;
    }
    // 通过 `NameList` 获取完全匹配 `FieldEntities`
    // 当 `NameList` 为 `null` 时， 返回所有带 `name` 的 `Field`
    // 会存在 `NameList` 有未注册的 `namePath`，若是这种情况，则返回 `{ [INVALIDATE_NAME_PATH]: namePath }`
    const fieldEntities = this.getFieldEntitiesForNamePathList(
      Array.isArray(mergedNameList) ? mergedNameList : null
    );

    const filteredNameList: NamePath[] = [];

    fieldEntities.forEach((entity) => {
      const namePath =
        INVALIDATE_NAME_PATH in entity
          ? entity[INVALIDATE_NAME_PATH]
          : entity.getNamePath();
      // 当 `strict` 时为 `true` 时，则不取 `List` 上的值，改为取每个 `Field` 上的值
      // 当 `strict` 为 `true` 时会仅匹配 `Field` 的值。例如 `{ list: [{ bamboo: 1, little: 2 }] }` 中，
      // 如果 `List` 仅绑定了 `bamboo` 字段，那么 g`etFieldsValue({ strict: true })` 会只获得 `{ list: [{ bamboo: 1 }] }`
      if (mergedStrict) {
        if ((entity as FieldEntity)?.isList?.()) {
          return;
        }
      } else if (!mergedNameList && (entity as FieldEntity).isListField?.()) {
        // 当 `strict` 为 false，不取 `Field` 上的值，直接取 `List` 的值
        // 当 `List` 有匹配 `Item` 的值，也会一起返回，因为是直接获取的 `List` 的值
        return;
      }

      if (!mergedFilterFunc) {
        filteredNameList.push(namePath);
      } else {
        const meta = "getMeta" in entity ? entity.getMeta() : null;
        if (mergedFilterFunc(meta)) {
          filteredNameList.push(namePath);
        }
      }
    });

    return cloneByNamePathList(this.store, filteredNameList.map(getNamePath));
  };

  public getFieldValue = (name: NamePath) => {
    this.warningUnhooked();

    const namePath = getNamePath(name);
    return getValue(this.store, namePath);
  };

  /**
   * Reset Field with field `initialValue` prop.
   * Can pass `entities` or `namePathList` or just nothing.
   */
  // 使用字段initialValue prop重置Field
  // 可以传递entities、namePathList或者什么都不传递
  // 传entities 只会重置传递entities Field
  // 传namePathList 只会重置传递 `namePathList` 的 `Field`
  // 不传递则会重置所有带有 `name` 的 `Field`
  // 优先级 `entities` > `namePathList` > 不传递
  private resetWithFieldInitialValue = (
    info: {
      entities?: FieldEntity[];
      // 二维数组
      namePathList?: InternalNamePath[];
      // Skip reset 存在是否跳过，默认false
      skipExist?: boolean;
    } = {}
  ) => {
    // Create cache
    const cache = new NameMap<Set<{ entity: FieldEntity; value: any }>>();

    const fieldEntities = this.getFieldEntities(true);
    fieldEntities.forEach((field) => {
      const { initialValue } = field.props;
      const namePath = field.getNamePath();

      // Record only if has `initialValue`
      // 当Field上存在initialValue prop，重置的时候需要判断是否需要重置
      if (initialValue !== undefined) {
        const records = cache.get(namePath) || new Set();
        // 存在name相同，records归在一起
        records.add({ entity: field, value: initialValue });

        cache.set(namePath, records);
      }
    });

    // Reset
    const resetWithFields = (entities: FieldEntity[]) => {
      entities.forEach((field) => {
        const { initialValue } = field.props;

        if (initialValue !== undefined) {
          const namePath = field.getNamePath();
          const dataInitialValue = this.getInitialValue(namePath);

          if (dataInitialValue !== undefined) {
            // Warning if conflict with form initialValues and do not modify value
            // 如果与数据初始值冲突且不修改值，则发出警告。
            // 数据已经设置初始值了，`Field` 无法覆盖初始值
            // `Data` 上 `initialValues` 设置了初始值，且 `Field` 上也设置了初始值, 以 `Data` 上为准，`Field` 设置初始值无法覆盖。
            // 一般情况下 优先级 `data` `initialValues` > `Field` `initialValue`
            // 但是当 `Data` `initalValues` 里面对于 `namePath`的值为 `undefined` 时，
            // 对应 `namePath` 的 `Field` `initialValue` 有值，以 `Field` 初始值为准。
            // 因为只判断了是否等于 `undefined` ，而没有去判断 `initialValue` 是否存在于 `Data` `initialValues` 上
            warning(
              false,
              `Data already set 'initialValues' with path '${namePath.join(
                "."
              )}'. Field can not overwrite it.`
            );
          } else {
            const records = cache.get(namePath);

            if (records && records.size > 1) {
              // Warning if multiple field set `initialValue`and do not modify value
              // 多 `Field` (相同name)设置 `initialValue` 且不修改值，则发出警告。
              // `decide` 决定; `which one` 哪一个
              warning(
                false,
                `Multiple Field with path '${namePath.join(
                  "."
                )}' set 'initialValue'. Can not decide which one to pick.`
              );
            } else if (records) {
              // `store` 上可能存在值，需要在取一下 `store` 上 `namePath` 的值，为 `undefined` 在更新初始值，
              // 当 `store` 上存在值，可以设置 `skipExist` 来控制是否使用 `Field` 上初始值来更新
              // `skipExist` `true` 跳过 不修改值  `false` 不跳过 用 `value` 修改 `store` 中的值
              const originValue = this.getFieldValue(namePath);
              const isListField = field.isListField();

              // Set `initialValue`
              if (
                !isListField &&
                (!info.skipExist || originValue === undefined)
              ) {
                const recordList = Array.from(records);
                const nextStore = setValue(
                  this.store,
                  namePath,
                  recordList[0]?.value
                );
                this.updateStore(nextStore);
              }
            }
          }
        }
      });
    };

    // 处理参数传递不同需要重置的Field，放在requiredFieldEntities里面
    let requiredFieldEntities: FieldEntity[] = [];
    if (info.entities) {
      requiredFieldEntities = info.entities;
    } else if (info.namePathList) {
      info.namePathList.forEach((namePath) => {
        const records = cache.get(namePath);

        if (records) {
          requiredFieldEntities.push(
            ...Array.from(records).map((r) => r.entity)
          );
        }
      });
    } else {
      requiredFieldEntities = fieldEntities;
    }

    resetWithFields(requiredFieldEntities);
  };

  // 重置Fields，
  // 若重置方法不传参数，则重置所有Field。
  // 若重置传了参数，则只重置与参数相关的Field。
  // `data` 上 `initialValues`  `Field` 上 `initialValue`
  private resetFields = (nameList?: NamePath[]) => {
    const prevStore = this.store;
    if (!nameList) {
      const nextStore = merge(this.initialValues);

      // `store` 变为 `initialValues`
      this.updateStore(nextStore);

      this.resetWithFieldInitialValue();
      this.notifyObservers(prevStore, null, { type: "reset" });
      this.notifyWatch([], "reset");
      return;
    }

    let namePathList = nameList.map(getNamePath);
    // const fieldEntities = this.getFieldEntities(true);
    // namePathList = namePathList.filter(
    //   (namePath) =>
    //     fieldEntities.filter((field) =>
    //       containsNamePath([namePath], field.getNamePath())
    //     ).length === 1
    // );
    // Reset by `nameList`
    namePathList.forEach((namePath) => {
      const initialValue = this.getInitialValue(namePath);

      // 仅需要将 `store` 中 `namePath` 重置 `initialValue`
      const nextStore = setValue(this.store, namePath, initialValue);
      this.updateStore(nextStore);
    });

    this.resetWithFieldInitialValue({
      namePathList,
    });
    this.notifyObservers(prevStore, namePathList, { type: "reset" });
    this.notifyWatch(namePathList, "reset");
  };

  // setFieldValue也是直接调用的setFields
  private setFields = (fields: FieldData[]) => {
    const prevStore = this.store;
    const namePathList: InternalNamePath[] = [];

    fields.forEach((fieldData) => {
      const { name, ...data } = fieldData;
      const namePath = getNamePath(name);
      namePathList.push(namePath);

      if ("value" in data) {
        const nextStore = setValue(this.store, namePath, data.value);
        this.updateStore(nextStore);
      }
      // 单个单个触发，也可以将fieldData数据加进数组，使用namePathList
      this.notifyObservers(prevStore, [namePath], {
        type: "setField",
        data: fieldData,
      });
    });

    this.notifyWatch(namePathList, "setField");
  };

  private getFields = (): InternalFieldData[] => {
    const entities = this.getFieldEntities(true);
    const fields = entities.map((field) => {
      const namePath = field.getNamePath();
      const meta = field.getMeta();

      const fieldData = {
        ...meta,
        name: namePath,
        value: this.getFieldValue(namePath),
      };

      Object.defineProperty(fieldData, "originRCField", {
        value: true,
      });
      return fieldData;
    });

    return fields;
  };

  // =========================== Observer ===========================
  /**
   * This only trigger when a field is on constructor to avoid we get initialValue too late
   * 这只会在构造函数上有字段时触发，以避免我们获取initialValue太晚
   * `Field` `constructor` 上就会触发，该方法目的是将 `Field` 上 `initialValue` 放到 `store` 里面去
   * `Data` 上未设置 `Field` 初始值 `(initialValues)` ，才将 `Field` 上的`initialValue` 放到 `store` 里面，不然会使用 `Data` 上的初始值
   */
  private initEntityValue = (entity: FieldEntity) => {
    const { initialValue } = entity.props;

    console.log("initEntityValue", initialValue);
    if (initialValue !== undefined) {
      const namePath = entity.getNamePath();
      const prevValue = getValue(this.store, namePath);
      // 当 Data 设置了初始值，Field 上设置初始值无效
      // 当 Data 为当前 Field 设置了初始值，则不会再将 Field initialValue 的值放进 store 里面
      // 注意：当 Data 设置 Field 初始值为 undefined ，也会使用 Field 上的 initialValue
      // 若需要 Data initialValues 优先级始终大于 Field initialValue ，可以判断当前name是否存在于 initialValues
      if (prevValue === undefined) {
        const nextStore = setValue(this.store, namePath, initialValue);
        this.updateStore(nextStore);
      }
    }
  };

  // 合并Preserve
  private isMergedPreserve = (fieldPreserve?: boolean) => {
    // 优先使用Field自身的preserve, 其次使用Data传递的preserve
    // 若都无，则使用默认值true
    const mergedPreserve =
      fieldPreserve !== undefined ? fieldPreserve : this.preserve;

    return mergedPreserve ?? true;
  };

  private registerField = (entity: FieldEntity) => {
    this.fieldEntities.push(entity);
    const namePath = entity.getNamePath();
    this.notifyWatch([namePath], "register");

    // Set initial values
    const { initialValue } = entity.props;
    if (initialValue !== undefined) {
      const prevStore = this.store;

      // 当 `store` 存在值，则不用 `initialValue` 覆盖 `store` 的值
      this.resetWithFieldInitialValue({
        entities: [entity],
        skipExist: true,
      });
      // 调用 `resetWithFieldInitialValue` 更新 `store`，通知 `Field` 渲染
      this.notifyObservers(prevStore, [namePath], {
        type: "valueUpdate",
        source: "register",
      });
    }

    // un-register field callback
    return (
      isListField?: boolean,
      preserve?: boolean,
      subNamePath: InternalNamePath = []
    ) => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity);

      // Clean up store value if not preserve
      // `preserve` 当字段被删除时保留字段值,默认为 `true`，为 `true` 不需要改变 `store` 。
      // 当 `preserve` 为 `false` 时，需要去判断与初始值是否一样，不一样则需要重置到初始值
      // 并且通知相关订阅者
      // 当是 `ListField` 为 `true` 时，则需要其下子 `Field` 也要卸载
      if (
        !this.isMergedPreserve(preserve) &&
        (!isListField || subNamePath.length > 1)
      ) {
        const defaultValue = isListField
          ? undefined
          : this.getInitialValue(namePath);

        const currValue = this.getFieldValue(namePath);

        // Field组件unmount value与默认值一样则不发生任何事，
        // 不一样则需要重置到默认值，且通知订阅者
        if (
          namePath.length &&
          currValue !== defaultValue &&
          this.fieldEntities.every(
            (field) =>
              // Only reset when no namePath exist
              // 仅当不存在namePath时重置
              !matchNamePath(field.getNamePath(), namePath)
          )
        ) {
          const prevStore = this.store;

          const nextStore = setValue(prevStore, namePath, defaultValue);
          this.updateStore(nextStore);

          // Notify that field is unmount
          // 通知 Field 卸载
          this.notifyObservers(prevStore, [namePath], {
            type: "remove",
          });

          this.notifyWatch([namePath], "unRegister");

          // Dependencies update
          this.triggerDependenciesUpdate(prevStore, namePath);
        }
      }
    };
  };

  private dispatch = (action: ReducerAction) => {
    switch (action.type) {
      case "updateValue": {
        const { namePath, value } = action;
        this.updateValue(namePath, value);
        return;
      }
      default:
      // Currently we don't have other action. Do nothing.
    }
  };

  private notifyObservers = (
    prevStore: Store,
    namePathList: InternalNamePath[] | null,
    info: NotifyInfo
  ) => {
    // 当children是方法时，则useSubscribe为false，useSubscribe(!(typeof children === "function"));
    // 当被订阅，直接调用Field里面onStoreChange，
    // 不然直接调用forceRootUpdate更新Field
    if (this.subscribable) {
      const mergedInfo = {
        ...info,
        store: this.getFieldsValue(true),
      };
      this.getFieldEntities().forEach(({ onStoreChange }) => {
        onStoreChange(prevStore, namePathList, mergedInfo);
      });
    } else {
      this.forceRootUpdate();
    }
  };

  /**
   * Notify dependencies children with parent update
   * We need delay to trigger validate in case Field is under render props
   */
  private triggerDependenciesUpdate = (
    prevStore: Store,
    namePath: InternalNamePath
  ) => {
    const childrenFields = this.getDependencyChildrenFields(namePath);

    this.notifyObservers(prevStore, childrenFields, {
      type: "dependenciesUpdate",
      relatedFields: [namePath, ...childrenFields],
    });

    return childrenFields;
  };

  private updateValue = (namePath: InternalNamePath, value: StoreValue) => {
    const prevStore = this.store;
    // namePath为空数组时，会直接返回value，详情查看rc-util set实现
    const nextStore = setValue(this.store, namePath, value);
    // value为字符串，value[name];

    // 更新 `store`
    this.updateStore(nextStore);

    // 通知 `Field` 渲染
    this.notifyObservers(prevStore, [namePath], {
      type: "valueUpdate",
      source: "internal",
    });
    this.notifyWatch([namePath], "valueUpdate");

    // Dependencies update
    // 对应依赖Field更新
    const childrenFields = this.triggerDependenciesUpdate(prevStore, namePath);

    // trigger callback function
    const { onValuesChange } = this.callbacks;
    if (onValuesChange) {
      // [["name"]]
      const changedValues = cloneByNamePathList(this.store, [namePath]);
      onValuesChange(changedValues, this.getFieldsValue());
    }

    this.triggerOnFieldsChange([namePath, ...childrenFields]);
  };

  // Let all child Field get update.
  private setFieldsValue = (store: Store) => {
    const prevStore = this.store;

    if (store) {
      const nextStore = merge(this.store, store);
      this.updateStore(nextStore);

      this.notifyObservers(prevStore, null, {
        type: "valueUpdate",
        source: "external",
      });

      this.notifyWatch(null, "valueUpdate");
    }
  };

  private setFieldValue = (name: NamePath, value: any) => {
    this.setFields([
      {
        name,
        value,
      },
    ]);
  };

  private getDependencyChildrenFields = (rootNamePath: InternalNamePath) => {
    const children: Set<FieldEntity> = new Set();
    const childrenFields: InternalNamePath[] = [];

    const dependenciesFields = new NameMap<Set<FieldEntity>>();
    // 将 `Fields` 通过 `name` , `dependencies` 关联起来，生成关联Map
    // kvs: Map(3) {"string:AA": Set(2)[BB, FF], "string:BB": Set(1)[CC], "string:CC": Set(1)[DD]}
    /**
     * Generate maps
     * Can use cache to save perf if user report performance issue with this
     */
    // 生成maps
    // 如果用户反馈性能问题，可以使用缓存保存性能
    // 需要遍历全部Field的dependencies。
    // 例如：组件卸载、onCahnge改变
    // AA ---> BB ---> CC --->DD
    // AA ---> FF
    // AA卸载
    // kvs: Map(3) {"string:AA": Set(2)[BB, FF], "string:BB": Set(1)[CC], "string:CC": Set(1)[DD]}
    // BB卸载
    // kvs: Map(3) {"string:AA": Set(1)[FF], "string:BB": Set(1)[CC], "string:CC": Set(1)[DD]}
    // CC卸载
    // kvs: Map(3) {"string:AA": Set(2)[BB, FF], "string:CC": Set(1)[DD]}
    // FF卸载
    // kvs: Map(3) {"string:AA": Set(1)[BB], "string:BB": Set(1)[CC], "string:CC": Set(1)[DD]}
    this.getFieldEntities().forEach((field) => {
      const { dependencies } = field.props;

      (dependencies || []).forEach((dependency) => {
        const dependencyNamePath = getNamePath(dependency);

        /** 会存在多个依赖于一个Field，所以用dependencyNamePath来做key值，Field来做value值 */
        dependenciesFields.update(dependencyNamePath, (fields = new Set()) => {
          fields.add(field);
          return fields;
        });
      });
    });

    const fillChildren = (rootNamePath: InternalNamePath) => {
      const fields = dependenciesFields.get(rootNamePath) || new Set();

      fields.forEach((field) => {
        /** 会存在相同name，Field相同不需要再次循环 */
        if (!children.has(field)) {
          children.add(field);

          const fieldNamePath = field.getNamePath();
          // 需判断Field是否需要更新,
          // 无初始值或者内部dirty为false，则不需要更新
          // dirty默认为false，当setFieldValue，trigger(默认onChange)，
          // setFieldsValue，验证则会变为true，当reset时，会将dirty变为false。
          if (field.isFieldDirty() && fieldNamePath.length) {
            childrenFields.push(fieldNamePath);
            // 依赖嵌套
            // AA ---> BB ---> CC --->DD
            // AA ---> FF
            fillChildren(fieldNamePath);
          }
        }
      });
    };

    fillChildren(rootNamePath);

    return childrenFields;
  };

  // 触发FieldsChange事件
  private triggerOnFieldsChange = (namePathList?: InternalNamePath[]) => {
    const { onFieldsChange } = this.callbacks;

    if (onFieldsChange) {
      const fields = this.getFields();

      const changedFields = fields.filter(({ name: fieldName }) =>
        containsNamePath(namePathList, fieldName)
      );

      if (changedFields.length) {
        onFieldsChange(changedFields, fields);
      }
    }
  };
}

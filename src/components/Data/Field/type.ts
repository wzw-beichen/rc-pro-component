import { NotifyInfo } from "../DataStore/type";
import { INVALIDATE_NAME_PATH } from "../constants";
import { InternalNamePath, NamePath, Store, StoreValue } from "../type";

export type ValueNotifyInfo = NotifyInfo & {
  store: Store;
};

export type FieldEntity = {
  onStoreChange: (
    prevStore: Store,
    namePathList: InternalNamePath[] | null,
    info: ValueNotifyInfo
  ) => void;
  getNamePath: () => InternalNamePath;
  isFieldTouched: () => boolean;
  isPreserve: () => boolean;
  isList: () => boolean;
  isListField: () => boolean;
  isFieldDirty: () => boolean;
  getMeta: () => Meta;
  props: {
    initialValue?: any;
    dependencies?: NamePath[];
    isListField?: boolean;
  };
};

export type InvalidateFieldEntity = {
  [INVALIDATE_NAME_PATH]: InternalNamePath;
};

export type Meta = {
  touched?: boolean;
  name: InternalNamePath;
  dirty?: boolean;
};

export type InternalFieldData = Meta & {
  value: StoreValue;
};

/**
 * Used by `setFields` config
 */
export type FieldData = Partial<Omit<InternalFieldData, "name">> & {
  name: NamePath;
};

export type EventArgs = any[];

export type ShouldUpdate<Values = any> =
  | ((
      prevValues: Values,
      nextValues: Values,
      info: { source?: string }
    ) => boolean)
  | boolean;

export type MetaEvent = Meta & {
  destory?: boolean;
};

### DataStore

#### getData 

##### getFieldsMap
该方法目的是将 `FieldsEntities` 转化为 `{ key: NamePath, value: FieldEntity }`
```
private getFieldsMap = (pure = fasle) => {
  const cache = new NameMap<FieldEntity>();

  const fieldEntities = this.getFieldEntities(pure);
  fieldEntities.forEach(entity => {
    const namePath = entity.getNamePath();
    cache.set(namePath, entity);
  });

  return cache;
}
```
##### getFieldEntitiesForNameList
该方法的目的是将 `nameList` 转化为对应 `FieldEntities`  
```
private getFieldEntitiesForNameList = (nameList?: NamePath[]) => {
  if (!nameList) {
    return this.getFieldEntities(true);
  }
  const cache = this.getFieldsMap(true);
  return nameList.map(name => {
    const namePath = this.getNamePath(name);

    return cache.get(namePath) || { INVALIDATE_NAME_PATH: namePath}
  })
}
```
##### getFieldsValue
参数整合， 根据参数不同，处理成一样，方便后缀操作
* nameList
  * `NamePath[]`
  * `true`
  * `GetFieldsValueConfig`
* filterFunc  

定义合并后的参数 `mergedNameList` ,  `meredStrict` ,  `mergedFilterFunc`
```
let mergedNameList;
let mergedStrict;
let mergedFilterFunc;
```
`NamePath[]` | `true`
```
if (nameList === true || Array.isArray(nameList)) {
  mergedNameList = nameList;
  mergedFilterFunc = filterFunc
}
```
`GetFieldsValueConfig`
```
if (nameList && typeof nameList === "object") {
  mergedStrict = nameList.strict;
  mergedFilterFunc = nameList.filter
}
```
* 根据合并后的参数对 `store` 进行取值  
  * `mergedNameList === true && !mergedFilterFunc`
  ```
  if (mergedNameList === true && !mergedFilterFunc) {
    return this.store;
  }
  ```
  * 根据 `mergedNameList` 调用 `getFieldEntitiesForNameList` 方法 获取 `fieldEntities`
  * 定义 `filterdNameList` , 循环 `fieldEntities` 进行过滤
  * 根据不同 `entity` 处理 `namePath`，会存在获取未存在的 `Field`
  ```
  const namePath = INVALIDATE_NAME_PATH in entity
    ? entity[INVALIDATE_NAME_PATH]
    : entity.getNamePath();
  ```
  ```
  const fieldEntities = this.getFieldEntitiesForNameList(
    Array.isArray(mergedNameList) ? mergedNameList : null
  )
  ```
  * `mergedStrict`
    * 描述: 当 `strict` 为 `true` 时会仅匹配 `Field` 的值。例如 `{ list: [{ bamboo: 1, little: 2 }] }` 中，如果 `List` 仅绑定了 `bamboo` 字段，那么 `getFieldsValue({ strict: true })` 会只获得 `{ list: [{ bamboo: 1 }] }`
    * true  精确匹配
      不直接取 `List` 的值，取 `List.Field` 值，这样就会仅匹配 `Field` 值
    ```
    if (mergedStrict) {
      if (entity?.isList?.()) return;
    }
    ```
    * false  
    直接取 `List` 的值，`List.Field` 值直接过滤，因为 `List` 值包含了 `List.Field` 值
    ```
    else if (!mergedNameList && entity?.isListField?.()) {
      return;
    }
    ```
  * mergedFilterFunc
    * 描述：用于过滤一些字段值，`meta` 会返回字段相关信息。例如可以用来获取仅被用户修改过的值等等
    * 无
    ```
    if (!mergedFilterFunc) {
      filterdNameList.push(namePath);
    }
    ```
    * 有  
    ```
    if (mergedFilterFunc) {
      const meta = "getMeta" in entity ? entity.getMeta() : null;

      if (mergedFilterFunc(meta)) {
        filterNameList.push(namePath);
      }
    }
    ```
最后循环 `filterdNameList` 去 `store` 取值赋值到新 `store`里面然后返回即可
```
return cloneByNamePathList(this.store, filterdNameList.map(getNamePath))
```
```
private getFieldsValue = () => {

}
```

##### getFieldValue
```
public getFieldValue = () => {
    const namePath = getNamePath(name);
    return getValue(this.store, namePath);
}
```

##### resetWithFieldInitialValue
该方法目的将 `Field` 上的 `initialValue` 的值赋值到 `store` 中  

使用字段`Field` `initialValue` 更新 `store`  

传 `entities` 只会重置传递 `entities` `Field`  

传 `namePathList` 只会重置传递 `namePathList` 的 `Field`  

不传递则会重置所有带有 `name` 的 `Field`  

参数优先级 `entities` > `namePathList` > 不传递  

* 筛选出所有带有 `name` 的 `Field`
```
const fieldEntities = this.getFieldEntities(true);
```
* 循环 `fieldEntities` ， 将有 `initialValue` 的 `Field` 存起来 `cache`
注意：会存在多个相同 `name`  

* 根据参数不同处理 `requiredFieldEntities`
  * entities
  * namePathList
  * 不传  

* 循环 `requiredFieldEntities`
  * `Data` 已设置 `inititlValue`
  * 多个相同 `name` `Field`
  * `Field` `inititalValue`
    * `store` 已存在 `value`, `skipExist` 为 `false` 则覆盖`store` 中的值
    * `skipExist` 为 `true`, 则跳过，不覆盖 `store` 的值
```
private resetWithFieldInitialValue = (info?: {
  entities?: FieldEntity[];
  namePathList?: InternalNamePath[];
  skipExist?: boolean;
}) => {
  const cache = new NameMap<Set<{ entity: FieldEntity; value: any }>>()

  const fieldEntities = this.getFieldEntities(true);
  fieldEntities.forEach(field => {
    const { initialValue } = field.props;
    const namePath = field.getNamePath();

    if (initialValue !== undefined) {
      const records = cache.get(namePath) || new Set();
      
      records.add({ entity: field, value: initialValue });
      cache.set(namePath, records)
    }
  })

  // Reset
  const resetWithFields = (entities: FieldEntity[]) => {
    entities.forEach(field => {
      const { initialValue } = field.props;
       
        if (initialValue !== undefined) {
          const namePath = field.getNamePath();
          const dataInitialValue = this.getInitialValue(this.store, namePath);

          if (dataInitialValue !== undefined) {
            warning(
              false,
              `Data already set 'initialValues' with path '${namePath.join(
                "."
              )}'. Field can not overwrite it.`
            );
          } else {
            const records = cache.get(namePath);

            if (records && records.size > 1) {
              warning(
                false,
                `Multiple Field with path '${namePath.join(
                  "."
                )}' set 'initialValue'. Can not decide which one to pick.`
              );
            } else if (records) {
                const originValue = this.getFieldValue(namePath);
                const isListField = field.isListField();
                
                // Set `initialValue`
                if (!isListField && (!info.skipExist || originValue === undefined)) {
                    const recordList = Array.from(records);
                    const nextStore = setValue(this.store, namePath, recordList[0]?.value);
                    this.updateStore(nextStore);
                }
            }
          }

       }
    })
  }

  let requiredFieldEntities: FieldEntity = fieldEntities;
  if (info.entities) {
    requiredFieldEntities = info.entities;
  } else if (info.namePathList) {
    requiredFieldEntities = [];

    info.namePathList.forEach(namePath => {
        const records = cache.get(namePath);

        if (records.size) {
           requiredFieldEntities.push(...Array.from(records).map(r => r.entity))
        }
    })
  }

  resetWithFields(requiredFieldEntities) 
}
```

##### resetFields
`Data` 的 `initialValues` 拥有最高优先级  

`Field` 的 `initialValue` 次之   

多个同 `name` `Item` 都设置 `initialValue` 时，则 `Item` 的 `initialValue` 不生效，若 `Data` 未设置多 `name` 的 `initialValues` ，
则会重置为 `undefined`, 可以稍作改动，使不改变当前值，不重置  


1. `nameList` 不传，则重置所有 `Fields`  

* 将 `store` 变为 `Data` 上的 `initialValues`
```
const nextStore = merge(this.initialValues);
this.updateStore(nextStore);
```
* 在重置带有 `initialValue` 的 `Field` , 调用 `resetWithFieldInitialValue`
```
this.resetWithFieldInitialValue();
```
* 通知订阅的组件 `Field` ，`store` 改变通知 `Field`， 由 `Field` 内部判断是否重新渲染
```
this.notifyObservers(preStore, null, { type: "reset"  })
```
* 通知订阅的方法
```
this.notifyWatch([], "reset");
```
```
const prevStore = this.store;
if (!nameList) {
   const nextStore = merge(this.initialValues);
   // `store` 变为 `initialValues`
   this.updateStore(nextStore);

   this.resetWithFieldInitialValue();
   this.notifyObservers(preStore, null, { type: "reset"  });
   this.notifyWatch([], "reset");
   return;
}
```
2. 传 `nameList` ，则只重置传递为 `nameList` 的 `Fields`

* 传递`nameList` ，将包含在 `nameList` 的 `Field` 重置到 `initialValues`， 未包含在的值无需改变
```
const namePathList = nameList.map(getNamePath);

// Reset by `namePathList`
namePathList.forEach((namePath) => {
    const initialValue = this.getInitialValue(namePath);

    // 仅需要将 `store` 中 `namePath` 重置 `initialValue`
    const nextStore = setValue(this.store, namePath, initialValue);
    this.updateStore(nextStore);
})
```
* 在重置带有 `initialValue` 的 `Field` , 调用 `resetWithFieldInitialValue`
```
this.resetWithFieldInitialValue({ namePathList });
```
* 通知订阅的组件 `Field` ，`store` 改变通知 `Field`， 由 `Field` 内部判断是否重新渲染
```
this.notifyObservers(preStore, namePathList, { type: "reset"  })
```
* 通知订阅的方法
```
this.notifyWatch(namePathList, "reset");
```

```
private resetFields = (nameList?: NamePath[]) => {
  const prevStore = this.store;

  if (!nameList) {
    const nextStore = merge(this.initialValues);
    this.updateStore(nextStore);

    this.resetWithFieldInitialValue();
    this.notifyObservers(prevStore, null, { type: "reset" });
    this.notifyWatch([], "reset");
    return;
  }
  namePathList.forEach((namePath) => {
    const initialValue = this.getInitialValue(namePath);
    const nextStore = setValue(this.store, namePath, initialValue);
    this.updateStore(nextStore);
  });

  this.resetWithFieldInitialValue({
    namePathList
  })
  this.notifyObservers(prevStore, namePathList, { type: "reset" })
  this.notifyWatch(namePathList, "reset")
}
```

##### setFields

##### setFieldValue

#### getInternalHooks

##### dispath

##### initEntityValue
`Field` `constructor` 上就会触发， 该方法目的是将 `Field` 上 `initialValue` 放到 `store` 里面去  

`Data` 上未设置 `Field` 初始值 `(initialValues)` ，才将 `Field` 上的`initialValue` 放到 `store` 里面，不然会使用 `Data` 上的初始值  

`Field` 的初始值优先级    
`Data` 的 `initialValues` 拥有最高优先级  
`Field` 的 `initialValue` 次之  

注意：当 `Data` 设置 `Field` 初始值为 `undefined` ，也会使用 `Field` 上的 `initialValue`  
若需要 `Data` `initialValues` 优先级始终大于 `Field` `initialValue` ，可以判断 `Field` `name`是否存在于 `initialValues`  

```
private initEntityValue = (field: FieldEntity) => {
  const { initialValue } = field.props;
  if (initialValue !== undefined) {
    const namePath = field.getNamePath();
    const prevValue = getValue(this.store, namePath);

    if (prevValue === undefined) {
        const nextStore = setValue(this.store, namePath, initialValue);
        this.updateStore(nextStore);
    }
  }
}
```

##### registerField
```
private registerField = (entity) => {
    this.fieldEntities.push(entity);
    const namePath = entity.getNamePath();

    return () => {
        this.fieldEntities = this.fieldEntities.filter(item => item !== entity);
    }
}
```

##### useSubscribe

##### setInitialValues

##### destoryData

##### setCallbacks

##### getFields

##### setPreserve

##### getInitialValue

##### registerWatch

##### 

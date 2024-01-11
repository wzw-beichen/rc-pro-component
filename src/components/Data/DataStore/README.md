### DataStore

#### getData 

##### getFieldValue
```
public getFieldValue = () => {
    const namePath = getNamePath(name);
    return getValue(this.store, namePath);
}
```
##### getFieldsValue

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

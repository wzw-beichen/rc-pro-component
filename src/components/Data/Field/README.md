#### Field
`constructor` 用上层传下来的在props中的 `fieldContext` ，`initEntityValue` 传递 `this` 将 `initialValue` 赋值到 `store` 中存储.
```
constructor(props) {
    super(props);
    // Register on init
    if (props.fieldContext) {
    const { getInternalHooks } = props.fieldContext;
    const { initEntityValue } = getInternalHooks(HOOK_MARK);
    initEntityValue(this);
    }
}

```

##### getNamePath
```
public getNamePath = () => {
    const { name, fieldContext } = this.props;
    const { prefixName = [] } = fieldContext;
    return name !== undefined ? [...prefixName, ...name] : []
}
```

#### DataStore
##### initEntityValue
```
private initEntitValue = (entity) => {
    const { initialValue } = entity.props;
    // 当Data设置了初始值，Field上设置初始值无效
    if (initialValue !== undefined) {
        const namePath = entity.getPathName();
        const prevValue = getValue(this.store, namePath);
        if (prevValue === undefined) {
            const nextStore = setValue(this.store, namePath, initialValue);
            this.updateStore(nextStore);
        }
    }
}
```
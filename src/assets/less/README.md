#### [fix: 解决外部引入less，webpack别名报错](https://www.cnblogs.com/fanqiuzhuji/p/12598863.html)

##### webpack.config.js增加配置
```
// webpack.config.js
resolve: {
  alias: {
    "@assets": path.resolve(__dirname, "./src/assets"),
  }
}
```
#####  tsconfig.json增加配置
```
// tsconfig.json
{
    "extends": ["./path.json"]
}
```
```
// path.json 
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```
将
```
@import "@assets/less/theme.less";
```
替换成
```
@import "~@assets/less/theme.less";
```


`CSS loader` 会把把非根路径的url解释为 `相对路径` ， 加 `~` 前缀才会解释成 `模块路径`

##### 配置less和less的全局变量
安装 `style-resource` 插件
```
npm install -D style-resources-loader
```
webpack.config.js增加less解析
```
// webpack.config.js
// test: /\.module\.less$/
// use: [] use在最后面添加以下配置
{
  loader: "style-resources-loader",
  options: {
    patterns: [
      path.resolve(__dirname, "./src/assets/less/theme.less"),
    ],
  },
},
```
```
// webpack.config.js
// test: /\.less$/
// use: [] use在最后面添加以下配置
{
  loader: "style-resources-loader",
  options: {
    patterns: [
      path.resolve(__dirname, "./src/assets/less/theme.less"),
    ],
  },
},
```
技术栈: webpack5 + React18 + TS  
工程化: eslint + prettier + husky + git hooks

#### 项目初始化
```
  mkdir demo
  cd demo
  npm init
  git init
```
#### React和Babel引入
```
  npm i -S react react-dom
```
安装 `Babel` 来提高兼容性:
```
 npm i -D @babel/core @babel/preset-env @babel/preset-react
```
. `@babel/core` : babel转码的核心引擎  
. `@babel/preset-env` : 添加对ES5、ES6的支持  
. `@babel/preset-react` : 添加对JSX的支持  
. `@babel/plugin-proposal-class-properties` : 对React中class的支持  

##### Babel配置
create `.babelrc` file  
```
 {
    "presets": ["@babel/react", "@babel/env"],
    "plugins": ["@babel/plugin-proposal-class-properties"]
 }
```
##### Babel Plugin
`Babel`是代码转换器，借助`Babel`，我们可以使用最流行的js写法，而`plugin`就是实现`Babel`功能的核心。  
![](https://pic2.zhimg.com/80/v2-155e707aaaa58174263ac67879558019_1440w.webp)

#### Webpack引入
```
 npm i -D webpack webpack-cli webpack-dev-server 
 html-webpack-plugin
```
. `webpack` : webpack插件的核心依赖  
. `webpack-cli` : 为插件提供命令行工具  
. `webpack-dev-server` : 帮助启动live server  
. `html-webpack-plugin` : 帮助创建HTML模版  

##### 安装loader
```
 npm i -D babel-loader style-loader css-loader
```
.babel-loader: 此 package 允许你使用 `Babel` 和 `webpack` 转译 `JavaScript` 文件  
.style-loader: 把 `CSS` 插入到 `DOM` 中  
.css-loader: `css-loader` 会对 `@import` 和 `url()` 进行处理，就像 js 解析 `import/require()` 一样  
##### Webpack基本配置
新建 `webpack.config.js` 文件
```
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  /** 入口，开始打包的起点 */
  entry: "./src/index.js",
  /** 输出 */
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "js/[name].[hash:8].js",
  },
  /** 能够实时重新加载的基本的 web server */
  devServer: {
    port: 8000,
  },
  module: {
    rules: [
      {
        /** 使用loader的文件类型 */
        test: /\.jsx?$/,
        /** 排除所有符合条件的模块 */
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
  ],
};
```

#### package.json基本配置
```
"scripts": {
  "start": "webpack serve --mode development --open --hot",
  "build": "webpack --mode production"
}
```
.mode: process.env.NODE_ENV --> development, 为modules和chunks启用有意义的名称  
.open: 告诉server在服务启动后打开默认浏览器  
.hot: 开启热更新  
#### 写一个React Demo
##### 创建index.js
`src/index.js`
```
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Index = () => {
  return (
    <div className="app_main">
      <h1>Hello!!</h1>
      <h2>Welcome to your First React App..!</h2>
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
```
##### 创建index.css
`src/index.css`
```
.app_main {
  position: absolute;
  inset: 0;
  padding-top: 200px;
  text-align: center;
  background: #009688;
  color: #fff;
}
```
##### 创建index.html
`public/index.html`
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>手动配置React环境</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
最后，执行npm start，项目会启动在8080端口。
#### Typescript配置
```
  npm i -D typescript ts-loader @types/node @types/react @types/react-dom
```
. `typescript` : TypeScript的主要引擎  
. `ts-loader` : 转义.ts --> .js 并打包  
. `@types/node` `@types/react` `@types/react-dom` : 对 `node` 、 `react` 、 `react dom` 类型的定义  
##### 同时在根目录加入tsconfig.json来对ts编译进行配置：
```
//_tsconfig.json_
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "Node"
  }
}
```
##### 最后在webpack中添加对ts的支持。  
添加对ts、tsx文件支持并设置解析loader
```
//_webpack.config.js_
{
  test: /\.tsx?$/,
  exclude: /node_modules/,
  loader: "ts-loader",
},
```
##### 设置resolve属性，来指定文件如何被解析：
```
//_webpack.config.js_
{
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
}
```
##### rename入口
```
//_webpack.config.js_
entry: "./src/index.tsx",
```

##### 更新index.js ---> index.tsx
`src/index.tsx`
```
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Index = () => {
  const name: string = "Hello!!!";
  return (
    <div className="app_main">
      <h1 className="app_main_name">{name}</h1>
      <h2>
        Welcome to your First React App..!!!!!!
      </h2>
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
```
上述我们的配置其实相当于执行了一次：
```
create-react-app my-app --template typescript
```
在这种流程下很是麻烦，将 *.ts 提供给 TypeScript，然后将运行的结果提供给 Babel，而且还要借助很多loader。
![](https://pic2.zhimg.com/80/v2-71524b0ce8060a2b3ca0c3afcef6af65_1440w.webp)
Babel7中提供的babel-loader就可以完美进行编译ts，这种方式直接简化了过程。
![](https://pic1.zhimg.com/80/v2-075236094670f0dd75c9cf23e8e5d1cc_1440w.webp)
```
module: {
  rules: [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
      ],
    }
  ]
},
```
那么为什么还要在项目中使用ts-loader呢？  
. `ts-loader` 在内部是调用了 TypeScript 的官方编译器 -- tsc。所以，ts-loader 和 tsc 是共享 `tsconfig.json`，所以会提供完整的报错信息，ts-loader也与 `vscode` 提供的语法校验表现一致  
.而 `@babel/preset-typescript` 有的时候会无法提供完整的报错信息和类型提示  
#### 管理资源
`webpack` 只能理解 `Javascript` 和 `JSON` 文件，这是 `webpack` 开箱可用的自带能力。`loader` 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效的模块中。  
loader中， `test` 属性可以识别出哪些文件会被转换； `use` 属性可以定义出转换时，应该是用哪个loader。  
##### Less
```
 npm i -D less less-loader
```
webpack配置：
```
//_webpack.config.js_
{
  test: /\.less$/,
  exclude: /\.module\.less$/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        importLoaders: 2,
        sourceMap: true,
      },
    },
    {
      loader: "less-loader",
      options: {
        sourceMap: true,
      },
    },
  ],
}
```
##### 创建index.less
`src/index.less`
```
.app_main {
    position: absolute;
    inset: 0;
    padding-top: 200px;
    text-align: center;
    background: #009688;
    color: #fff;

    &_name {
        background-color: red;
        padding: 16px;
    }
}
```
##### 更新index.tsx
`src/index.tsx`
```
import React from "react";
import ReactDOM from "react-dom";
import "./index.less";

const Index = () => {
  const name: string = "Hello!!!";
  return (
    <div className="app_main">
      <h1 className="app_main_name">{name}</h1>
      <h2>
        Welcome to your First React App..!!!!!!
      </h2>
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
```
##### 支持CSS Module
`css-loader` `modules` [localIdentName](https://webpack.docschina.org/loaders/css-loader/#localidentname)
```
{
  test: /\.module\.less$/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        importLoaders: 2,
        sourceMap: true,
        modules: {
          localIdentName: "[path][name]__[local]",
        },
      },
    },
    {
      loader: "less-loader",
      options: {
        sourceMap: true,
      },
    },
  ],
}
```
##### 创建App文件夹
`App/index.tsx`
```
import React from "react";
import styles from "./index.module.less";

const App = () => {
  const name: string = "Hello App";
  return (
    <div>
      <h1 className="app_main_name">{name}</h1>
      <h2 className={styles.app_main_text}>Welcome to your App..!!!!!!</h2>
    </div>
  );
};

export default App;
```
`App/index.module.less`
```
.app_main_text {
    background: red;
    color: #fff;
}
```
##### 更新index.tsx
`src/index.tsx`
```
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import styles from "./index.module.less";
import "./index.less";

const Index = () => {
  const name: string = "Hello!!!";
  return (
    <div className="app_main">
      <h1 className="app_main_name">{name}</h1>
      <h2 className={styles.app_main_text}>
        Welcome to your First React App..!!!!!!
      </h2>
      <App />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
```
`src/index.module.less`
```
.app_main_text {
    padding: 16px;
    background: rebeccapurple;
    color: yellow;
}
```
##### 支持alias
```
// webpack.config.js
resolve: {
  alias: {
    "@components": path.resolve(__dirname, "./src/components"),
    "@constants": path.resolve(__dirname, "./src/constants"),
  },
}
```
```
// tsconfig.json
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src"],
    "@components/*": ["./src/components/*"],
    "@constants/*": ["./src/constants/*"],
    "@constants": ["./src/constants"]
  }
}
```
##### 配置git hooks
1、`husky`（操作git钩子的工具）
```
npm install husky -D
```
2、使用（添加husky文件夹）
```
npm set-script prepare "husky install"
npm run prepare // 在这之后会生成一个husky文件夹
```
3、`commitlint`（commit 信息校验工具，不符合则报错）  
作用：通过钩子函数，判断提交的信息是否符合规范，不规范就不让提交
```
npm i @commitlint/cli @commitlint/config-conventional -D
```
4、执行以下命令，在husky文件夹下自动生成 `commit-msg` 文件
```
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```
5、`commitizen`（基于 Node.js 的 git commit 命令行工具，生成标准化的 message）
```
npm install commitizen -D
// 安装 commitizen，如此一来可以快速使用 cz 或 git cz 命令进行启动。
```
6、`cz-git`  
作用：指定提交文字规范，一款工程性更强，高度自定义，标准输出格式的 commitizen 适配器。
```
npm install cz-git -D
```
```
// package.json
"config": {
  "commitizen": {
    "path": "node_modules/cz-git"
  }
}
```
7、在项目根目录新建`commitlint.config.js`
```
MAC可以使用以下命令创建文件
echo >commitlint.config.js
```
```
// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"], // 检测规则
  rules: {},
  prompt: {
    messages: {
      type: "选择你要提交的类型 :",
      scope: "选择一个提交范围（可选）:",
      customScope: "请输入自定义的提交范围 :",
      subject: "填写简短精炼的变更描述 :\n",
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixsSelect: "选择关联issue前缀（可选）:",
      customFooterPrefixs: "输入自定义issue前缀 :",
      footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      confirmCommit: "是否提交或修改commit ?",
    },
    types: [
      { value: "feat: 特性", name: "特性: 🚀 新增功能", emoji: "🚀" },
      { value: "fix: 修复", name: "修复: 🧩 修复缺陷", emoji: "🧩" },
      { value: "docs: 文档", name: "文档: 📚 文档变更", emoji: "📚" },
      {
        value: "style: 格式",
        name: "格式: 🎨 代码格式（不影响功能，例如空格、分号等格式修正）",
        emoji: "🎨",
      },
      {
        value: "refactor: 重构",
        name: "重构: ♻️  代码重构（不包括 bug 修复、功能新增）",
        emoji: "♻️",
      },
      { value: "perf: 性能", name: "性能: ⚡️ 性能优化", emoji: "⚡️" },
      {
        value: "test: 测试",
        name: "测试: ✅ 添加疏漏测试或已有测试改动",
        emoji: "✅",
      },
      {
        value: "chore: 构建",
        name: "构建: 📦️ 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）",
        emoji: "📦️",
      },
      {
        value: "ci: 集成",
        name: "集成: 🎡 修改 CI 配置、脚本",
        emoji: "🎡",
      },
      { value: "revert: 回退", name: "回退: ⏪️ 回滚 commit", emoji: "⏪️" },
      { value: "build: 打包", name: "打包: 🔨 项目打包发布", emoji: "🔨" },
    ],
    useEmoji: true,
  },
};
```
8、配置启动命令
```
npm set-script commit "git status && git add -A && git-cz"
或者手动配置
// package.json
"scripts": {
  "commit": "git status && git add -A && git-cz"
}
```
9、启动命令
```
npm run commit
```
10、查看`Commit Message`的标准格式  
Commit Message 标准格式包括三个部分：Header，Body，Footer。其中Header是必需项，Body和Footer可以省略
```
Header：<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```
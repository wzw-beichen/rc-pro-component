// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const args = process.argv.slice(2);

const [dev, production] = ["development", "production"];
const modeIndex = args.findIndex((item) => item === "--mode");
const env = args[modeIndex + 1] ?? dev;
const isProduction = env === production;
console.log("env", env);

module.exports = {
  /** 入口，开始打包的起点 */
  entry: "./src/index.tsx",
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
      },
      {
        test: /\.module\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              /** `importLoaders` 选项允许你配置在 `css-loader` 之前有多少 `loader` 应用于 `@imported` 资源与 `CSS` 模块/ICSS 导入 */
              importLoaders: 2,
              sourceMap: true,
              modules: {
                /** 允许配置生成的本地标识符(ident)，默认“[hash:base64]” */
                localIdentName: isProduction
                  ? "[hash:base64]"
                  : "[path][name]__[local]__[hash:base64]",
              },
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: isProduction,
            },
          },
          {
            loader: "style-resources-loader",
            options: {
              patterns: [
                path.resolve(__dirname, "./src/assets/less/theme.less"),
              ],
            },
          },
        ],
      },
      {
        /** 引入所有通过断言测试的模块 */
        test: /\.less$/,
        /** module.less支持css module */
        exclude: /\.module\.less$/,
        /**
         * less-loader webpack 将 Less 编译为 CSS 的 loader.
         * css-loader css-loader 会对 `@import` 和 url() 进行处理，就像 js 解析 import/require() 一样.
         * style-loader 把 CSS 插入到 DOM 中.
         */
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              /** `importLoaders` 选项允许你配置在 `css-loader` 之前有多少 `loader` 应用于 `@imported` 资源与 `CSS` 模块/ICSS 导入 */
              importLoaders: 2,
              sourceMap: isProduction,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: isProduction,
            },
          },
          {
            loader: "style-resources-loader",
            options: {
              patterns: [
                path.resolve(__dirname, "./src/assets/less/theme.less"),
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  /** 配置模块如何解析 */
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@src": path.resolve(__dirname, "./src"),
    },
    /**
     * 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，
     * 但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
     */
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
    }),
  ],
};

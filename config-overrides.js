// config-overrides.js
/* eslint-disable no-useless-computed-key */
const {
  override,
  addWebpackAlias,
  addWebpackResolve,
  fixBabelImports,
  addLessLoader,
  adjustStyleLoaders,
  addWebpackPlugin,
  addWebpackModuleRule,
} = require("customize-cra");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 代码压缩
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // 大文件定位
const ProgressBarPlugin = require("progress-bar-webpack-plugin"); // 打包进度
const CompressionPlugin = require("compression-webpack-plugin"); // gzip压缩
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // css压缩
const tailwindcss = require("tailwindcss");
const path = require("path");

module.exports = override(
  // 导入文件的时候可以不用添加文件的后缀名
  addWebpackResolve({
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
  }),
  // 路径别名
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src"),
  }),
  // 配置rem
  // addWebpackModuleRule({
  //   test: /\.(css|scss)$/,
  //   use: [
  //     "style-loader",
  //     "css-loader",
  //     {
  //       loader: "px2rem-loader",
  //       options: {
  //         remUnit: 153.4, // 换算基数，如果你的设计稿是750px，那么remUnit就是75
  //         remPrecision: 8, // rem的小数点后位数
  //       },
  //     },
  //     "sass-loader",
  //   ],
  // }),
  // 配置scss
  adjustStyleLoaders((rule) => {
    if (rule.test.toString().includes("scss")) {
      rule.use.push({
        loader: require.resolve("sass-resources-loader"),
        options: {
          resources: ["./src/assets/css/vars.scss"],
        },
      });
    }
  }),

  // 注意是production环境启动该plugin
  // process.env.NODE_ENV === "production" &&
  //   addWebpackPlugin(
  //     new UglifyJsPlugin({
  //       // 开启打包缓存
  //       cache: true,
  //       // 开启多线程打包
  //       parallel: true,
  //       uglifyOptions: {
  //         // 删除警告
  //         warnings: false,
  //         // 压缩
  //         compress: {
  //           // 移除console
  //           drop_console: true,
  //           // 移除debugger
  //           drop_debugger: true,
  //         },
  //       },
  //     })
  //   ),
  addWebpackPlugin(new MiniCssExtractPlugin()),
  // 判断环境变量ANALYZER参数的值
  process.env.ANALYZER && addWebpackPlugin(new BundleAnalyzerPlugin()),
  // 打包进度条
  addWebpackPlugin(new ProgressBarPlugin())
);

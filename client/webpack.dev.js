const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const deps = require("./package.json").dependencies;
const { SourceMapDevToolPlugin } = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const devConfig = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  //to dev in host app for hot reload
  // this shit works but only has live reload
  output: {
    publicPath: "http://localhost:3000/",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: [require.resolve("react-refresh/babel")],
        },
      },
    ],
  },
  // optimization: {
  //   runtimeChunk: "single",
  // },
  plugins: [
    new ModuleFederationPlugin({
      name: "kanban",
      filename: "remoteEntry.js",
      exposes: {
        "./Kanban": "./src/bootstrap",
      },
      shared: {
        ...deps,
        react: { singleton: true, eager: true, requiredVersion: deps.react },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new ReactRefreshWebpackPlugin({
      exclude: [/node_modules/, /bootstrap\.tsx$/],
    }),
    new SourceMapDevToolPlugin({
      filename: "[file].map",
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);

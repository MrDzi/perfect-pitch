const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  target: "node",
  entry: path.resolve(__dirname, "server", "index.ts"),
  output: {
    path: path.resolve(__dirname, "dist-server"),
    filename: "index.js",
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        include: path.resolve(__dirname, "server"),
      },
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname, "server"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: false,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "server", "package.json") }],
      options: {
        concurrency: 100,
      },
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
};

const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  target: "node",
  entry: path.resolve(__dirname, "/src/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        include: path.resolve(__dirname),
      },
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname),
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
  resolve: {
    extensions: [".ts", ".js"],
  },
};

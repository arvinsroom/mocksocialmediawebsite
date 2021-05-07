const path = require("path");
const webpack = require("webpack");
const fs = require('fs');
const glob = require("glob")

const migrationFiles = glob.sync('./migrations/*');
const migrationEntries = migrationFiles.reduce((acc, migrationFile) => {
  const entryName = migrationFile.substring(
      migrationFile.lastIndexOf('/') + 1,
      migrationFile.lastIndexOf('.')
  );
    acc[entryName] = migrationFile;
    return acc;
  }, {});

module.exports = function(_env, argv) {
  const isProduction = argv.mode === "production";
  var nodeModules = {};
  fs.readdirSync('node_modules')
    .filter(function (x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });
    
  return {
    entry: {
      index: path.resolve(__dirname, "server.js"),
      ...migrationEntries,
    },
    target: 'node',
    output: {
      path: path.resolve(__dirname, "db"),
      filename: chunkData => {
        if (chunkData.chunk.name === 'index') return './[name].js';
        if (Object.keys(migrationEntries).includes(chunkData.chunk.name)) return `./migrations/[name].js`;
      },
      publicPath: "/",
      libraryTarget: 'umd'
    },
    externals: nodeModules,
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { babelrc: true }
        }
      }]
    },
    resolve: {
      extensions: ["*", ".js"]
    },
    plugins: [
      // new webpack.BannerPlugin('require("source-map-support").install();', {
      //   raw: true,
      //   entryOnly: false,
      // }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^cardinal$/,
        contextRegExp: /./,
      }),  
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
        "process.env.IP_ADDRESS": JSON.stringify(
          isProduction ? "3.97.196.198" : "localhost"
        ),
      })
    ],
    experiments: {
      topLevelAwait: true
    },
  }
}

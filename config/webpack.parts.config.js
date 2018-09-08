const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
})

exports.cleanup = paths => ({
  plugins: [
    new CleanWebpackPlugin(paths, { root: process.cwd(), verbose: false }),
  ],
})

exports.loadJs = ({ babelOptions }) => ({
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
        ],
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
    ],
  },
})

exports.sourceMaps = method => ({
  devtool: method,
})

exports.minifyJavaScript = () => ({
  // performance: {
  //   maxEntrypointSize: 1200000,
  //   maxAssetSize: 1200000,
  // },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
})

exports.envVar = env => ({
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      CANVAS_RENDERER: JSON.stringify(false),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],
})

exports.isVendor = module =>
  /node_modules/.test(module.resource) || module.resource

exports.scopeHoisting = () => ({
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
})

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
})

exports.analyze = () => ({
  plugins: [new BundleAnalyzerPlugin()],
})

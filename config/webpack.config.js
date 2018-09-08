const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const packagejson = require('../package.json')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default

const parts = require('./webpack.parts.config')

const paths = {
  base: path.resolve('src'),
  app: path.resolve('src/main.js'),
  dist: path.resolve('dist'),
  template: path.resolve('index.html'),
}

const commonConfig = merge([
  {
    target: 'web',
    context: paths.base,
    entry: {
      app: paths.app,
    },
    output: {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
      publicPath: '/',
      path: paths.dist,
    },
    resolve: {
      extensions: ['.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.template,
        title: packagejson.name,
        version: packagejson.version,
      }),
      new CaseSensitivePathsPlugin(),
      new CopyWebpackPlugin([
        {
          from: '../assets',
          to: 'assets',
        },
        {
          from: '../favicon.ico',
        },
      ]),
      new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    ],
  },

  parts.loadJs({
    babelOptions: {
      presets: [
        [
          'babel-preset-env',
          {
            modules: false,
            useBuiltIns: 'entry',
            shippedProposals: true,
          },
        ],
        'stage-2',
      ],
      plugins: [],
    },
  }),
])

const developmentConfig = merge([
  parts.sourceMaps('cheap-module-source-map'),

  parts.devServer({ host: process.env.HOST, port: process.env.PORT }),

  { plugins: [new webpack.NamedModulesPlugin()] },

  parts.envVar('development'),
])

const productionConfig = merge([
  parts.sourceMaps('source-map'),

  parts.cleanup([paths.dist]),

  parts.minifyJavaScript(),

  parts.envVar('production'),

  parts.scopeHoisting(),

  parts.attachRevision(),
])

const analyzeConfig = merge([parts.analyze()])

module.exports = env => {
  const config = merge(
    commonConfig,
    env === 'production' ? productionConfig : developmentConfig,
  )

  if (process.env.npm_config_analyze) {
    return merge(config, analyzeConfig)
  }

  return config
}

/**
 *  Copyright (c) 2021 DAPSI IDISS and others.
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the MIT License
 *
 *  vscode extensions part - Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT license.
 */

//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration[]}*/
const config = [
  {
    name: 'graphView',
    target: 'web',
    node: {
      __dirname: false,
      __filename: false
    },
    entry: './src/graphView/main.ts', // the entry point of this webview
    output: {
      // add the bundle(s) to 'dist'
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].graphView.js',
    },
    devtool: 'eval-source-map', // include source-maps for webview debug support
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
            test: /\.tsx?$/,
            use: ['ts-loader']
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
      ]
    },
    optimization: { // split vendor scripts to bundled chunks
      splitChunks: {
        cacheGroups: {
          vendor1: {
            test: /[\\/]node_modules[\\/](cytoscape|heap|web-worker|lodash.debounce)[\\/]/,
            name: 'vendor1',
            chunks: 'all',
          },
          vendor2: {
            test: /[\\/]node_modules[\\/](elkjs|cytoscape-elk)[\\/]/,
            name: 'vendor2',
            chunks: 'all',
          },
        },
      },
    },
  },
  {
    name: 'extension',
    target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    node: {
      __dirname: false,
      __filename: false
    },
    entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: {
      // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, 'dist'),
      filename: 'extension.js',
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    externals: {
      vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },
    resolve: {
      // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader'
            }
          ]
        }
      ]
    }
  },
];
module.exports = config;

var webpack = require('webpack');
var timeConstants = require('./src/timeConstants');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname + '/build',
        filename: "bundle.js"
    },
    devServer: {
        contentBase: "./build",
    },
    resolve: {
        modulesDirectories: ['../node_modules']
    },
    plugins: [
        new webpack.DefinePlugin(timeConstants)
    ]
    /*module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
    */
};

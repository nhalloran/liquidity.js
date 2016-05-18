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
    }
    /*module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
    */
};

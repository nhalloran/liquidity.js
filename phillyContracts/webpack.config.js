module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
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

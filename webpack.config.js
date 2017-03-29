const path = require("path");
const webpack = require("webpack");
const {searchGlob} = require("build-utils/fs");
const configurator = require("./server/config");

module.exports = Promise.resolve().then(() => {
    const outputPath = path.resolve(__dirname, './dist');

    console.log("Destination: " + outputPath);

    const webpackConfig = {
        entry: {
            app: './aot/app/main.js',
        },
        output: {
            path: outputPath,
            filename: '[name].bundle.js',
            publicPath: "dist/",
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['app'],
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "lib",
                minChunks: function (module) {
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [ 'style-loader', 'css-loader' ]
                },
                {
                    test: /\.(png|jpg)$/,
                    use: [ 'url-loader?limit=10000' ]
                },
                {
                    test: /\.(png|jpg)$/,
                    use: [ 'file-loader' ]
                }
            ]
        }
    };

    const modulesDirPath = "./aot/app/"
    const moduleFileName = "module.ngfactory.js";
    return searchGlob(`${modulesDirPath}**/${moduleFileName}`).then(files => {
        for (let file of files) {
            const moduleDirPath = file.substring(modulesDirPath.length, file.length - moduleFileName.length - 1);
            const bundleName = moduleDirPath.replace("/", ".");
            webpackConfig.entry[bundleName] = file;
        }

        return webpackConfig;
    });
});
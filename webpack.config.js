const path = require('path');
const webpack = require('webpack');

module.exports = {

    context: path.resolve(__dirname, 'client'),
    target: "web",
    entry: {
        app: './main.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'server', 'public','js'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                enforce: "pre", // preload the jshint loader
                exclude: [/node_modules/],
                use: [{
                    loader: "jshint-loader",
                    options: {
                        camelcase: true,
                        // jshint errors are displayed by default as warnings
                        // set emitErrors to true to display them as errors
                        emitErrors: true,
                        // jshint to not interrupt the compilation
                        // if you want any file with jshint errors to fail
                        // set failOnHint to true
                        failOnHint: false
                    }
                }]
            },
            {
                test: /\.(js|jsx)$/,
                enforce: "pre", // preload the jshint loader
                exclude: [/node_modules/],
                use: [{
                        loader: 'babel-loader',
                        options: { presets: ['es2015','react'] },
                    }],
            },
            {
                test: /\.css$/,
                use: ['style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                //modules: true,
                            }
                        }
                     ],
            },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.js',
            minChunks: 2,
        })
    ],
    resolve: {
        alias: {
            commons: path.join(__dirname,'client','commons'),
            components: path.join(__dirname,'client','components'),
            // routes: 'routes',
            // modules: 'modules',
            // reducers: 'reducers',
            // actions: 'actions',
            // containers: 'containers'
        },
        extensions: ['.js', '.jsx']
    },
    //externals: /^(jquery|\$)$/i
};
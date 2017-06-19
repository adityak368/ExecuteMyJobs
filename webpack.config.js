const path = require('path');
const webpack = require('webpack');

module.exports = {

    context: path.resolve(__dirname, 'client'),
    target: "web",
    entry: {
        babelPolyFill : 'babel-polyfill',
        app: path.resolve('client','src','main.jsx'),
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
                    options: { presets: ['es2015','react','stage-2'] },
                }],
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            { test: /\.eot(\?\S*)?$/, loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject' },
            { test: /\.woff2(\?\S*)?$/, loader: 'url-loader?limit=100000&mimetype=application/font-woff2' },
            { test: /\.woff(\?\S*)?$/, loader: 'url-loader?limit=100000&mimetype=application/font-woff' },
            { test: /\.ttf(\?\S*)?$/, loader: 'url-loader?limit=100000&mimetype=application/font-ttf' },
            { test: /\.svg(\?\S*)?$/, loader: 'url-loader?limit=100000&mimetype=image/svg+xml' }
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
            commons: path.join(__dirname,'client','src','commons'),
            components: path.join(__dirname,'client','src','components'),
            api: path.join(__dirname,'client','src','api'),
            stylesheets: path.join(__dirname,'client','stylesheets'),
            bower_components: path.join(__dirname,'client','bower_components'),
            public: path.join(__dirname,'server','public'),
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
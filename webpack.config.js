const path = require('path')
const webpack = require('webpack')

module.exports = {

    context: path.resolve(__dirname, 'client'),
    target: 'web',
    entry: {
        babelPolyFill: 'babel-polyfill',
        app: path.resolve('client', 'src', 'main.jsx')
    },
    output: {
        path: path.resolve(__dirname, 'server', 'public', 'js'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre', // preload the jshint loader
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'eslint-loader'
                    }
                ]
            }, {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['transform-decorators-legacy' ],
                            presets: ['es2015', 'react', 'stage-0']
                        }
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader' // translates CSS into CommonJS
                    }
                ]
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader' // translates CSS into CommonJS
                    }, {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }
                ]
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }, {
                test: /\.eot(\?\S*)?$/,
                loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'
            }, {
                test: /\.woff2(\?\S*)?$/,
                loader: 'url-loader?limit=100000&mimetype=application/font-woff2'
            }, {
                test: /\.woff(\?\S*)?$/,
                loader: 'url-loader?limit=100000&mimetype=application/font-woff'
            }, {
                test: /\.ttf(\?\S*)?$/,
                loader: 'url-loader?limit=100000&mimetype=application/font-ttf'
            }, {
                test: /\.svg(\?\S*)?$/,
                loader: 'url-loader?limit=100000&mimetype=image/svg+xml'
            }
        ]
    },
    plugins: [
        new webpack
            .optimize
            .CommonsChunkPlugin({
                name: 'commons',
                filename: 'commons.js',
                minChunks: 2
            })
    ],
    resolve: {
        alias: {
            commons: path.join(__dirname, 'client', 'src', 'commons'),
            components: path.join(__dirname, 'client', 'src', 'components'),
            api: path.join(__dirname, 'client', 'src', 'api'),
            stylesheets: path.join(__dirname, 'client', 'stylesheets'),
            bower_components: path.join(__dirname, 'client', 'bower_components'),
            public: path.join(__dirname, 'server', 'public'),
            stores: path.join(__dirname, 'client', 'src', 'stores')
        },
        extensions: ['.js', '.jsx']
    }
    // externals: /^(jquery|\$)$/i
}

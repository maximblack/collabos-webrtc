var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var paths = require('./paths');

module.exports = {
    devtool: 'eval',
    entry: [
        require.resolve('webpack/hot/dev-server'),
        paths.appIndexJs,
    ],
    target : 'web',
    output: {
        path: paths.appBuild,
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: [
            '',
            '.js',
            '.jsx'
        ]
    },
    devServer: {
        port: 8083,
        inline: true,
        hot: true,
        contentBase: paths.appPublic,
        historyApiFallback: true
    },
    stats: {
        colors: true,
        chunkModules: false
    },
    plugins: [
        //new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    externals: {
        Peer: 'Peer'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                include: paths.appSrc,
                //presets : ['es2015', 'react']
            },
        ],
    }
};
const path = require('path');

const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin');

module.exprts = {

    mode: 'development',

    entry: {
        main: './src/index.js'
    },
    module: {
        rules: [

        ]
    },
    plugins: [
        new CopyrightWebpackPlugin({
            name: '123'
        })
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    }
}
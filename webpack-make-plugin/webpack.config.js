const path = require('path');

const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin');

module.exprts = {

    mode: 'production',
    plugins: [
        new CopyrightWebpackPlugin({
            name: '123'
        })
    ],
    entry: {
        main: './src/index.js'
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
    }
}
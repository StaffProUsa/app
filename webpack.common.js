const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.[contenthash].js',
        publicPath: '/'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: "public", globOptions: {
                    ignore: ["**/index.html"], // Ignore `index.html` to prevent conflicts
                },
            }]
        }),
        new webpack.EnvironmentPlugin({ JEST_WORKER_ID: null }),
        new webpack.DefinePlugin({ __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production') }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-react',
                                {
                                    runtime: "automatic",
                                    useBuiltIns: 'usage', // Activar el uso automático de polyfills
                                    corejs: 3, // Especificar la versión de core-js
                                }
                            ],
                            '@babel/preset-env'
                        ],
                        plugins: ['@babel/plugin-proposal-class-properties'],
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer: /\.[jt]sx?$/,
                use: ['babel-loader', {
                    loader: '@svgr/webpack',
                    options: {
                        babel: false,
                        icon: true,
                        svgoConfig: {
                            plugins: [
                                // {
                                //     name: 'removeViewBox',
                                //     active: false
                                // }
                            ]
                        }
                    }
                }, 'url-loader'],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        mainFiles: ['index'],
        alias: { 'react-native$': 'react-native-web' },
        extensions: ['.web.js', '.js', '.jsx', '.json', '.ts', '.tsx'],

        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
};

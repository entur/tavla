const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const postcssPresetEnv = require('postcss-preset-env')

const OUTPUT_PATH = path.resolve(__dirname, 'dist')

module.exports = (env) => {
    return {
        mode: 'development',
        entry: './src/main.tsx',
        devtool: 'inline-source-map',
        output: {
            path: OUTPUT_PATH,
            filename: '[name].[hash].js',
            publicPath: '/',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules|sdk/,
                    loader: 'awesome-typescript-loader',
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules|sdk/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    postcssPresetEnv(),
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    postcssPresetEnv(),
                                ],
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(svg|png|jpe?g|eot|woff2?)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/',
                    },
                },
            ],
        },
        devServer: {
            open: true,
            contentBase: OUTPUT_PATH,
            port: 9090,
            historyApiFallback: true,
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: 'src/index.html',
                filename: 'index.html',
                favicon: 'src/assets/images/logo.png',
            }),
            new Dotenv({ path: path.join(__dirname, `.env.${typeof env === 'string' ? env : 'staging'}`) }),
        ],
        watch: typeof env !== 'string',
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                    },
                },
            },
        },
    }
}

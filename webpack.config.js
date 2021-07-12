const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const postcssPresetEnv = require('postcss-preset-env')
const CopyPlugin = require('copy-webpack-plugin')

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
                    exclude: /entur\/sdk/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            exclude: /mapbox-gl/,
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
                                plugins: () => [postcssPresetEnv()],
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
                                plugins: () => [postcssPresetEnv()],
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(svg|png|jpe?g|gif|eot|webp|woff2?)$/,
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
            new Dotenv({
                path: path.join(
                    __dirname,
                    `.env.${typeof env === 'string' ? env : 'staging'}`,
                ),
            }),
            new CopyPlugin({
                patterns: [{ from: 'public/images/', to: 'images' }],
            }),
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

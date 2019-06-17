const config = require('dotenv').config
const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve')

const OUTPUT_PATH = path.resolve(__dirname, 'dist')

module.exports = (env) => {
    config({ path: path.join(__dirname, `.env.${typeof env === 'string' ? env : 'prod'}`) })
    return {
        mode: 'development',
        entry: [
            './src/main.jsx',
            'webpack-plugin-serve/client',
        ],
        output: {
            path: OUTPUT_PATH,
            filename: 'bundle.[hash].js',
            publicPath: '/',
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            rules: [
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
                        { loader: 'css-loader' },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader', // creates style nodes from JS strings
                        'css-loader', // translates CSS into CommonJS
                        'sass-loader', // compiles Sass to CSS
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
        plugins: [
            new HtmlWebPackPlugin({
                template: 'src/index.html',
                filename: 'index.html',
                favicon: 'src/assets/images/logo.png',
            }),
            new Serve({
                open: true,
                host: 'localhost',
                port: 9090,
                static: OUTPUT_PATH,
                historyFallback: true,
            }),
        ],
        watch: typeof env !== 'string',
    }
}

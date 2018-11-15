const config = require('dotenv').config
const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')

module.exports = (env) => {
    config({ path: path.join(__dirname, `.env.${typeof env === 'string' ? env : 'prod'}`) })
    return {
        mode: 'development',
        entry: './src/main.jsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
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
                    test: /\.(svg|png|eot|woff2?)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/',
                    },
                },
            ],
        },
        serve: {
            port: 9090,
            open: true,
            historyApiFallback: true,
            hotClient: true,
            add: (app) => {
                app.use(convert(history({
                    verbose: true,
                })))
            },
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: 'src/index.html',
                filename: 'index.html',
                favicon: 'src/assets/images/logo.png',
            }),
        ],
    }
}

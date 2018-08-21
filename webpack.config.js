const readFileSync = require('fs').readFileSync
const parseDotEnv = require('dotenv').parse
const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')

function parse(envFilePath) {
    try {
        const parsed = parseDotEnv(readFileSync(envFilePath, { encoding: 'utf8' }))
        return Object.entries(parsed).reduce((obj, [key, value]) => {
            obj[key] = value // eslint-disable-line no-param-reassign
            return obj
        }, {})
    } catch (e) {
        return {}
    }
}

function populateEnvironmentVariables(environment = 'dev') {
    const envFile = path.join(__dirname, `.env.${environment}`)
    const variables = parse(envFile)
    Object.assign(process.env, variables)
    return variables
}

module.exports = (env) => {
    populateEnvironmentVariables(env)
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
                favicon: 'src/assets/logo.png',
            }),
        ],
    }
}

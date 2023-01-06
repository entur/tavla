/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { execSync } = require('child_process')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const postcssPresetEnv = require('postcss-preset-env')
const CopyPlugin = require('copy-webpack-plugin')
const { SourceMapDevToolPlugin } = require('webpack')

const OUTPUT_PATH = path.resolve(__dirname, 'dist')

const resolveEnv = (env) => {
    if (env.development) return 'development'
    if (env.prod) return 'prod'
    return 'staging'
}

process.env.VERSION = execSync('git rev-parse --short HEAD', {
    encoding: 'utf8',
}).trim()

module.exports = async (env, args) => ({
    mode: args.mode === 'production' ? 'production' : 'development',
    entry: './src/main.tsx',
    devtool: args.mode === 'production' ? false : 'inline-source-map',
    cache: {
        type: 'filesystem',
        cacheLocation: path.resolve(__dirname, 'node_modules/.cache/webpack'),
    },
    output: {
        path: OUTPUT_PATH,
        filename: '[name].[fullhash].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.graphql'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude:
                    args.mode === 'production' ? /entur\/sdk/ : /node_modules/,
                loader: 'ts-loader',
            },
            {
                test: /\.(sc|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: true, // enables .modules.scss to be identified as css-modules
                                localIdentName: '[local]--[hash:base64:8]', // keep class-name and add hash
                                exportLocalsConvention: 'asIs', // don't transform class-names
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [() => postcssPresetEnv()],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(svg|png|jpe?g|gif|eot|webp|woff2?)$/,
                type: 'asset',
                generator: {
                    filename: 'assets/[hash][ext][query]',
                },
            },
        ],
    },
    devServer: {
        open: true,
        static: OUTPUT_PATH,
        port: 9090,
        historyApiFallback: true,
        headers:
            resolveEnv(env) === 'development'
                ? {}
                : {
                      'Content-Security-Policy':
                          "child-src 'self' blob:;default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://*.googleapis.com blob:; connect-src 'self' ws://localhost:9090/ws wss://*.entur.io https://api.met.no https://stats.g.doubleclick.net https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com https://*.entur.io https://*.entur.org https://*.cloudfunctions.net https://*.googleapis.com; style-src 'self' 'unsafe-inline'; img-src https: 'self' blob: data: https://www.google.no https://www.google.com https://*.googleapis.com; object-src 'none'; frame-ancestors https:; manifest-src 'self' blob:; frame-src https://entur-tavla-staging.firebaseapp.com/ https://entur-tavla-prod.firebaseapp.com/",
                      'Permissions-Policy': 'geolocation=(self)',
                  },
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            favicon: 'src/assets/images/logo.png',
        }),
        new Dotenv({
            path: path.join(__dirname, `.env.${resolveEnv(env)}`),
        }),
        new CopyPlugin({
            patterns: [
                { from: 'sw.js' },
                { from: 'manifest.json' },
                { from: 'public/images/', to: 'images' },
            ],
        }),
        ...(args.mode === 'production'
            ? [
                  new SourceMapDevToolPlugin({
                      filename: '[name].[fullhash].js.map',
                      noSources: false,
                  }),
              ]
            : []),
    ],
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
})

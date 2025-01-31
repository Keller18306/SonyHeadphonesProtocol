import * as webpack from 'webpack';
import * as path from 'path';

const config: webpack.Configuration = {
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',
    entry: {
        // protocol: './src/protocol/index.ts',
        // index: './src/index.ts',
        web: './web.ts'
    },
    output: {
        asyncChunks: true,
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        extensionAlias: {
            '.js': ['.js', '.ts'],
            '.cjs': ['.cjs', '.cts'],
            '.mjs': ['.mjs', '.mts'],
        },
        fallback: {
            // stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            events: require.resolve('events'),
        }
    },
    module: {
        rules: [
            { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        })
    ]
    // optimization: {
    //     runtimeChunk: true
    // }
};

export default config;
const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const STATIC_FILES_DIR = path.resolve(__dirname, 'public');

module.exports = {
	entry: {
		main: ['./src/polyfills', './src/index.js'],
	},
	mode: 'development',
	// map webpack's output back to source files when debugging in chrome https://webpack.js.org/configuration/devtool/
	devtool: 'eval-source-map',
	output: {
		path: STATIC_FILES_DIR,
		publicPath: '/',
	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				test: /\.(js)$/,
				exclude: /(node_modules)/,
			},
		],
	},
	plugins: [
		new DefinePlugin({
			API_URL: JSON.stringify(process.env.API_URL),
		}),
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.html',
			filename: path.resolve(STATIC_FILES_DIR, 'index.html'),
			chunks: ['main'],
		}),
	],
	devServer: {
		// where to get static files (index.html)
		contentBase: STATIC_FILES_DIR,
		port: 3000,
		// where to serve bundles from (main.js will be available at http://localhost:<port>/<publicPath>)
		publicPath: '/',
		historyApiFallback: true,
		overlay: true,
	},
};

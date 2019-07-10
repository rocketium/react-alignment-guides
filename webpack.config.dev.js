const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: "development",
	entry: "./index.js",
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "eslint-loader"
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					"css-loader"
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "babel-loader"
			}
		]
	},
	optimization: {},
	plugins: [
		new HtmlWebpackPlugin({
			filename: path.resolve(__dirname, 'dist/index.html'),
			template: path.resolve(__dirname, 'index.html')
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new webpack.HotModuleReplacementPlugin()
	]
}
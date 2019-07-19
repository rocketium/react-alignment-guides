const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: process.env.NODE_ENV,
	entry: "./src/index.js",
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				use: "eslint-loader"
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "babel-loader"
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					process.env.NODE_ENV === 'development' ? "style-loader" : MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
							localsConvention: 'asIs',
							modules: {
								mode: 'local',
								localIdentName: '[local]__[hash:base64:5]'
							},
							sourceMap: true
						}
					},
					"sass-loader"
				]
			}
		]
	},
	optimization: {},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 4000
	}
}
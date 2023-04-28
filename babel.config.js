module.exports = function babelConfig(api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			require.resolve("expo-router/babel"),
			"module:react-native-dotenv",
			"transform-inline-environment-variables",
			"react-native-reanimated/plugin",
			[
				"module-resolver",
				{
					alias: {
						"@": "./",
					},
				},
			],
		],
	};
};

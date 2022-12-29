module.exports = {
	extends: ["eslint-config-aindu/typescript"],
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parserOptions: {
				tsconfigRootDir: __dirname,
			},
		},
	],
};

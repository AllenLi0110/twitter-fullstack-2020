module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es2021": true,
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
		"no-unused-vars":"off",
		"no-undef": "off",
		"no-useless-escape": "off"
	}
}

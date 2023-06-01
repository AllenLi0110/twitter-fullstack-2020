require("dotenv").config()
module.exports = {
	development: {
		username: "root",
		password: "password",
		database: "ac_twitter_workspace",
		host: "127.0.0.1",
		dialect: "mysql",
	},
	test: {
		username: "root",
		password: "password",
		database: "ac_twitter_workspace_test",
		host: "127.0.0.1",
		dialect: "mysql",
		logging: false,
	},
	production: {
		username: process.env.PRO_DB_username,
		password: process.env.PRO_DB_password,
		database: process.env.PRO_DB_database,
		host: process.env.PRO_DB_host,
		dialect: process.env.PRO_DB_dialect,
		logging: process.env.PRO_DB_logging
	},
	travis: {
		username: "travis",
		database: "ac_twitter_workspace_test",
		host: "127.0.0.1",
		dialect: "mysql",
		logging: false,
	},
}

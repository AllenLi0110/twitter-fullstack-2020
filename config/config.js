require("dotenv").config()
module.exports = 
{
	"development": {
		"username": "root",
		"password": "password",
		"database": "ac_twitter_workspace",
		"host": "127.0.0.1",
		"dialect": "mysql"
	},
	"test": {
		"username": "root",
		"password": "password",
		"database": "ac_twitter_workspace_test",
		"host": "127.0.0.1",
		"dialect": "mysql",
		"logging": false
	},
	"production": {
		"username": process.env.DB_username,
		"password": process.env.DB_password,
		"database": process.env.DB_database,
		"host": process.env.DB_host,
		"dialect": process.env.DB_dialect
	},
	"travis": {
		"username": "travis",
		"database": "ac_twitter_workspace_test",
		"host": "127.0.0.1",
		"dialect": "mysql",
		"logging": false
	}
}
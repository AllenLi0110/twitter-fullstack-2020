"use strict"
const bcrypt = require("bcryptjs")
const faker = require("faker")

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const userSeed = Array.from({ length:5 }).map((_, i) => ({
			name: `user${i + 1}`,
			email: `user${i + 1}@example.com`,
			account: `user${i + 1}`,
			password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
			avatar: `https://loremflickr.com/141/140/people/?lock=${i}`,
			cover: `https://loremflickr.com/639/200/landscape/?lock=${i}`,
			introduction: faker.lorem.text().substring(0, 140),
			role: "user",
			created_at: new Date(),
			updated_at: new Date()
		}))
		await queryInterface.bulkInsert("Users", [{
			name: "root",
			email: "root@example.com",
			account: "root",
			password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
			role: "admin",
			created_at: new Date(),
			updated_at: new Date()
		}, ...userSeed], {})
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Users", null, {})
	}
}

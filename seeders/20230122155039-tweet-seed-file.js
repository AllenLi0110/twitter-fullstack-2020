"use strict"
const faker = require("faker")
const { User } = require("../models")

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const userSeed = await User.findAll({ where: { role: "user" }, raw: true })
		
		await queryInterface.bulkInsert("Tweets", 
			Array.from({ length: 50 }).map((_, i) => ({
				user_id: userSeed[ Math.floor(i / 10) ].id,
				description: faker.lorem.text().substring(1, 140),
				created_at: new Date(),
				updated_at: new Date()
			})), {})
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Tweets", null, {})
	}
}

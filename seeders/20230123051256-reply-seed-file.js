"use strict"
const faker = require("faker")
const { User, Tweet } = require("../models")

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const userSeed = await User.findAll({ where: { role: "user" }, raw: true })
		const tweetSeed = await Tweet.findAll({ attributes: [ "id" ], raw: true })

		await queryInterface.bulkInsert("Replies",
			Array.from({ length: tweetSeed.length }).map((_, i) => ({
				user_id: userSeed[ (i % 5) ].id,
				tweet_id: tweetSeed[ Math.floor(i / 3) ].id,
				comment: faker.lorem.sentences(2),
				created_at: new Date(),
				updated_at: new Date()
			})), {})
	},
  
	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Replies", null, {})
	}
}
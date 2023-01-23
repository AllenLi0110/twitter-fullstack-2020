"use strict"
const { User, Tweet } = require("../models")

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const userSeed = await User.findAll({ where: { role: "user" }, raw: true })
		const tweetSeed = await Tweet.findAll({ attributes: [ "id" ], raw: true })
		const likesArr = []
		
		userSeed.forEach(user => {
			const randomTweet = [...tweetSeed]
			for (let i = 0; i < userSeed.length; i++) {
				const randomNum = Math.floor(Math.random() * randomTweet.length)
				likesArr.push({
					user_id: user.id,
					tweet_id: randomTweet[randomNum].id,
					created_at: new Date(),
					updated_at: new Date()
				})
			}
		})
		await queryInterface.bulkInsert("Likes", likesArr)
	},
  
	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Likes", null, {})
	}
}
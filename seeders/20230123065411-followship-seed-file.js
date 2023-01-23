"use strict"
const { User } = require("../models")

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const userSeed = await User.findAll({ where: { role: "user" }, raw: true })
		const followshipArr = []

		userSeed.forEach((user, index) => {
			const randomUser = [...userSeed]

			randomUser.splice(index, 1)
			for (let i = 0; i < randomUser.length; i++) {
				const randomNum = Math.floor(Math.random() * randomUser.length)
				followshipArr.push({
					follower_id: user.id,
					following_id: randomUser[randomNum].id,
					created_at: new Date(),
					updated_at: new Date()
				})
				randomUser.splice(randomNum, 1)
			}
		})
		await queryInterface.bulkInsert("Followships", followshipArr, {})
	},
  
	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Followships", null, {})
	}
}

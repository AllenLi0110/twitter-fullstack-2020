const { Tweet, User, Like, Reply } = require("../models")

const tweetController = {
	getTweets:(req, res) => {
		return Tweet.findAll({
			include: [
				User,
				Like,
				Reply
			]
		}).then(tweets => {
			const data = tweets.map(t => ({
				...t,
				description: t.description.substring(0, 140)
			}))
			return res.render("tweets", {
				tweets: data
			})
		})
	}
}

module.exports = tweetController
const { Tweet, User, Like, Reply } = require("../models")
const { getOffset, getPagination } = require("../helpers/pagination-helper")

const tweetController = {
	getTweets:(req, res, next) => {
		const DEFAULT_LIMIT = 7
		const page = Number(req.query.page) || 1
		const limit = Number(req.query.limit) || DEFAULT_LIMIT
		const offset = getOffset(limit, page)

		return Tweet.findAll({
			include: [
				User,
				Like,
				Reply
			],
			order:[
				["created_at", "DESC"],
				["id", "ASC"]
			],
			limit,
			offset
		}).then(tweets => {
			const data = tweets.map(t => ({
				...t,
				description: t.description.substring(0, 140)
			}))
			return res.render("tweets", {
				tweets: data,
				pagination: getPagination(limit, page, tweets.count)
			})
		})
			.catch(err => next(err))
	}
}

module.exports = tweetController
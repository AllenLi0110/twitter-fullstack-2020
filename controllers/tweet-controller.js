const { Tweet, User, Like, Reply } = require("../models")
const { getOffset, getPagination } = require("../helpers/pagination-helper")
const { getUser } = require("../helpers/auth-helpers")

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
	},
	postTweet: (req, res) => {
		const { description }  = req.body

		if (description.trim() === "") {
			req.flash("error_messages", "推文的內容不可空白")
			return res.redirect("back")
		} else if (description.length > 140) {
			req.flash("error_messages", "推文的字數不能超過140字")
			return res.rediect("back")
		}
		
		Tweet.create({
			description,
			UserId: getUser(req).id
		}).then(() => {
			req.flash("success_messages", "推文成功！")
			return res.redirect("tweets")
		})
			.catch(err => next(err))
	}
}

module.exports = tweetController
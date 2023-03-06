const { User, Tweet, Reply, Like } = require("../models")
const { getUser } = require("../helpers/auth-helpers")
const { getOffset, getPagination } = require("../helpers/pagination-helper")

const adminController = {
	signInPage: (req, res) => {
		return res.render("admin/signin")
	},
	signIn: (req, res) => {
		if (getUser(req).role === "user") {
			req.flash("error_messages", "請前往前台登入")
			return res.redirect("/admin/signin")
		}
		req.flash("success_messages", "登入成功！")
		return res.redirect("/admin/tweets")
	},
	logout: (req, res) => {
		req.flash("success_messages", "登出成功！")
		req.logout()
		return res.redirect("/admin/signin")
	},
	getTweets: async (req, res, next) => {
		try{
			const DEFAULT_LIMIT = 14
			const page = Number(req.query.page) || 1
			const limit = Number(req.query.limit) || DEFAULT_LIMIT
			const offset = getOffset(limit, page)

			const tweetsList = await Tweet.findAndCountAll({
				include: [User],
				order: [["created_at", "DESC"]],
				limit,
				offset,
				raw: true,
				nest: true
			}).then(tweets => {
				const result = tweets.rows.map(tweet => {
					return {
						...tweet,
						description: tweet.description.substring(0, 50)
					}
				})
				return res.render("admin/tweets", { tweets: result, pagination: getPagination(limit, page, tweets.count) })
			})
		} catch (err) {
			next(err)
		}
	},
	deleteTweet: async (req, res, next) => {
		try {
			const TweetId = req.params.id
			const tweet = await Tweet.findByPk(TweetId)
			await tweet.destroy()
			await Reply.destroy({ where: { TweetId } })
			await Like.destroy({ where: { TweetId } })
	
			req.flash("success_messages", "成功刪除！")
			res.redirect("back")
		} catch (err) {
			next(err)
		}
	},
}

module.exports = adminController
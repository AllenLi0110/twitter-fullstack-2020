const { Tweet, User, Like, Reply } = require("../models")
const { getUser } = require("../helpers/auth-helpers")

const replyController = {
	getReplies: async (req, res, next) => {
		try {
			const replies = await Reply.findAll({
				raw: true,
				nest: true,
				where: { TweetId: req.params.id },
				include: [
					User,
					{ model: Tweet, include: [User] },
					{ model: Tweet, include: [Like] }
				],
				order: [["created_at", "DESC"]]
			})
			const tweet = await Tweet.findByPk(req.params.id, {
				include: [User, Like]
			})
			const user = getUser(req)
			const likedTweetUsers = tweet.Likes.map(like => like.UserId)
			user.isLiked = likedTweetUsers.includes(user.id)
			return res.render("replies", { tweet: tweet.toJSON(), replies, user })
		} catch (err) {
			next(err)
		}
	},
	postReplies: async (req, res, next) => {
		try {
			const comment = req.body.comment.trim()
			if (!comment.length) {
				req.flash("error_messages", "回覆內容不可空白")
				return res.redirect("back")
			}
			if (comment.length > 140) {
				req.flash("error_messages", "回覆內容不可超過140字")
				return res.redirect("back")
			}
			await Reply.create({
				UserId: getUser(req).id,
				TweetId: req.params.id,
				comment
			})
			req.flash("success_messages", "回覆成功!")
			return res.redirect("back")
		} catch (err) {
			next(err)
		}
	}
}
  
module.exports = replyController
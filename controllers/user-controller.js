const bcrypt = require("bcryptjs")
const { Tweet, User, Like, Reply } = require("../models")
const { getUser } = require("../helpers/auth-helpers")
const { imgurFileHandler } = require("../helpers/file-helpers")

const userController = {
	signUpPage: (req, res) => {
		return res.render("signup")
	},
	signUp: async (req, res, next) => {
		const {account, name, email, password, checkPassword} = req.body
		const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

		if (password !== checkPassword) throw new Error("密碼與驗證密碼不相符！")
		if (!account || !name || !email || !password || !checkPassword) throw new Error("請確實填寫所有欄位！")
		if (account.length > 15) throw new Error("帳號字數上限為 15 字")
		if (name.length > 50) throw new Error("名稱字數上限為 50 字")
		if (email.search(emailRule) === -1) throw new Error("請確認信箱的格式！")

		return Promise.all([
			User.findOne({ where: {account}}),
			User.findOne({ where: {email}})
		])
			.then(([account, email]) => {
				if (account) throw new Error("此帳號已存在！")
				if (email) throw new Error("此信箱已存在！")
				return bcrypt.hash(password, 10)
			})
			.then(hash => User.create({
				account, 
				name, 
				email, 
				password: hash,
				role: "user"
			}))
			.then(() => {
				req.flash("success_messages", "帳號註冊成功！")
				return res.redirect("/signin")
			})
			.catch(err => next(err))
	},
	signInPage: (req, res) => {
		return res.render("signin")
	},
	signIn: (req, res) => {
		if (getUser(req).role === "admin") {
			req.flash("error_messages", "請前往後台登入！")
			return res.redirect("/signin")
		}
		req.flash("success_messages", "登入成功！")
		return res.redirect("/tweets")
	},
	logout: (req, res) => {
		req.flash("success_messages", "登出成功！")
		req.logout()
		return res.redirect("/signin")
	},
	getProfile: async (req, res, next) => {
		try {
			const user = getUser(req)
			const id = req.params.id
			const personal = await User.findByPk(id, {
				include: [
					Tweet,
					{ model: User, as: "Followers"},
					{ model: User, as: "Followings" }
				]
			})
			const tweetsList = await Tweet.findAll({
				where: { ...personal ? { UserId: personal.id } : {} },
				include: [User, Reply, Like],
				order: [
					["created_at", "DESC"],
				]
			})

			const tweets = tweetsList.map( tweet => ({
				...tweet.toJSON(),
				isLiked: tweet.Likes.some(t => t.UserId === user.id)
			}))
			return res.render("profile", {
				tweets,
				user,
				personal: personal.toJSON()
			})
		} catch(err) {
			next(err)
		}
	},
	getReplies: async (req, res, next) => {
		try {
			const user = getUser(req)
			const id = req.params.id
			const personal = await User.findByPk(id, {
				include: [
					Tweet,
					{ model: User, as: "Followers"},
					{ model: User, as: "Followings" }
				]
			})
			const repliesList = await Reply.findAll({
				where: { ...personal ? { UserId: personal.id } : {} },
				include: [
					User,
					{ model: Tweet, include: User }
				],
				order: [["created_at", "DESC"]]
			})
			const replies = repliesList.map(reply => ({
				...reply.toJSON()
			}))
			return res.render("profile_replies", { 
				replies, 
				user, 
				personal: personal.toJSON() })
		} catch(err) {
			next(err)
		}
	},
	getLikes: async (req, res, next) => {
		try {
			const user = getUser(req)
			const id = req.params.id
			const personal = await User.findByPk(id, {
				include: [
					Tweet,
					{ model: User, as: "Followers" },
					{ model: User, as: "Followings" },
					{ model: Like, as: Tweet }
				]
			})
		
			const likedTweetsId = personal?.Likes.map(like => like.TweetId)
			const tweetsList = await Tweet.findAll({
				where: {
					...likedTweetsId ? { id: likedTweetsId } : {}
				},
				include: [
					User,
					Reply,
					Like
				],
				order: [
					["created_at", "DESC"]
				]
			})
			const tweets = tweetsList.map(tweet => ({
				...tweet.toJSON(),
				isLiked: true
			}))
			return res.render("profile_likes", { tweets, user, personal: personal.toJSON() })
		} catch (err) {
			next(err)
		}
	},
	getSetting: async (req, res, next) => {
		try {
			const id = req.params.id
			const user = await User.findByPk(id, { raw: true } )
			if (user.id !== getUser(req).id) throw new Error("無法編輯他人資料！")
			return res.render("setting", user)
		} catch(err) {
			next(err)
		}
	},
	putSetting: async (req, res, next) => {
		try {
			const { editAccount, editName, editEmail, editPassword, editCheckPassword } =  req.body
			const {id, account, email } = getUser(req)

			if (account !== editAccount) {
				const existAccount = await User.findOne({ where: { account: editAccount }})
				if (existAccount) throw new Error("此帳號已存在！")
			}
			if (editName.length > 50) throw new Error("名稱字數上限為 50 字")
			if (email !== editEmail) {
				const existEmail = await User.findOne({ where: { email: editEmail }})
				if (existEmail) throw new Error("此信箱已存在！")
			}
			if (editPassword !== editCheckPassword) throw new Error("密碼與驗證密碼不相符！")
			
			const editUser = await User.findByPk(id)
			await editUser.update({
				account: editAccount,
				name: editName,
				email: editEmail,
				password: await bcrypt.hash(editPassword, 10)
			})

			req.flash("success_messages", "更新成功！")
			return res.redirect(`/users/${id}/setting`)
		} catch(err) {
			next(err)
		}
	},
	//api routes
	getUserInfo:(req, res, next) => {
		const id = req.params.id
		User.findByPk(id)
			.then(userData => {
				if (!userData) throw new Error("使用者不存在！")
				const user = userData.toJSON()
				delete user.password
				res.json({status: "success", ...user})
			})
			.catch(err => next(err))
	},
	postUser: async (req, res, next) => {
		try {
			const userId = req.params.id
			const { files } = req
			const { name, introduction } = req.body
		
			const user = await User.findByPk(userId)
			if (!user) throw new Error("user didn't exist")
			let avatarFilePath = user.dataValues.avatar
			let coverFilePath = user.dataValues.cover
		
			if (files?.image) {
				avatarFilePath = await imgurFileHandler(...files.image)
			}
		
			if (files?.coverImage) {
				coverFilePath = await imgurFileHandler(...files.coverImage)
			}
		
			await user.update({
				name,
				introduction,
				avatar: avatarFilePath,
				cover: coverFilePath
			})
			req.flash("success_messages", "個人資料儲存成功 !")
			return res.json({ status: "success", ...user.toJSON() })
		} catch (err) {
			next(err)
		}
	}
}

module.exports = userController
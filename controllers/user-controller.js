const bcrypt = require("bcryptjs")
const db = require("../models")
const { User } = db
const { getUser } = require("../helpers/auth-helpers")

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
	}
}

module.exports = userController
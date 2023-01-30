const bcrypt = require("bcryptjs")
const db = require("../models")
const { User } = db
const { getUser } = require("../helpers/auth-helpers")

const userController = {
	signUpPage: (req, res) => {
		return res.render("signup")
	},
	signUp: (req, res, next) => {
		const {account, name, email, password, checkPassword} = req.body

		if (password !== checkPassword) throw new Error("密碼與驗證密碼不相符！")
		
		User.findOne({ where: { email }})
			.then(user => {
				if (user) throw new Error("此信箱已存在！")
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
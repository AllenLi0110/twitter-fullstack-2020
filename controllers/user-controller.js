const bcrypt = require("bcryptjs")
const db = require("../models")
const { User } = db

const userController = {
	signUpPage: (req, res) => {
		res.render("signup")
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
				res.redirect("/signin")
			})
			.catch(err => next(err))
	}
}

module.exports = userController
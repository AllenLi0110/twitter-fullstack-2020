const { getUser } = require("../helpers/auth-helpers")

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
	getTweets: (req, res) => {
		return res.render("admin/tweets")
	}
}

module.exports = adminController
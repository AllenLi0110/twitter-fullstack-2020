const { ensureAuthenticated, getUser } = require("../helpers/auth-helpers")
const authenticated = (req, res, next) => {
	if (ensureAuthenticated(req)) {
		if (getUser(req).role === "admin") {
			req.flash("error_messages", "管理者無法進入使用者平台！")
			res.redirect("/admin/tweets")
		}
		return next()
	}
	req.flash("error_messages", "請先完成登入作業！")
	res.redirect("/signin")
}

const authenticatedAdmin = (req, res, next) => {
	if (ensureAuthenticated(req)) {
		if (getUser(req).role === "admin") return next()
		res.redirect("/")
	} else {
		req.flash("error_messages", "請先完成管理者登入作業！")
		res.redirect("/admin/signin")
	}
}

module.exports = {
	authenticated,
	authenticatedAdmin
}
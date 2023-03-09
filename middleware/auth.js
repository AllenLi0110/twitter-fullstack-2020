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

const authenticatedLimit = (req, res, next) => {
	if (getUser(req).id === Number(req.params.id)) return next()
	res.json({ status: "error", data: "只能修改自己的資料" })
	res.redirect(200, "back")
}
  
module.exports = {
	authenticated,
	authenticatedAdmin,
	authenticatedLimit
}
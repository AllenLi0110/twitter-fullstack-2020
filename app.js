const express = require("express")
const routes = require("./routes")
const handlebars = require("express-handlebars")
const flash = require("connect-flash")
const session = require("express-session")
const helpers = require("./_helpers")
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = "secret"

app.engine("hbs", handlebars({extname:".hbs"}))
app.set("view engine", "hbs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash())
app.use((req, res, next) => {
	res.locals.success_messages = req.flash("success_messages")
	res.locals.error_messages = req.flash("error_messages")
	next()
})
app.use(routes)

app.listen(port, () => console.log(`Twitter Fullstack listening on port ${port}!`))

module.exports = app

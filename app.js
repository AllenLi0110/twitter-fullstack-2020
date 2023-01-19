const express = require("express")
const routes = require("./routes")
const handlebars = require("express-handlebars")

const helpers = require("./_helpers")
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

const app = express()
const port = process.env.PORT || 3000
app.engine("hbs", handlebars({extname:".hbs"}))
app.set("view engine", "hbs")

app.use(routes)
app.listen(port, () => console.log(`Twitter Fullstack listening on port ${port}!`))

module.exports = app

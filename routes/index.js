const express = require("express")
const router = express.Router()

const admin = require("./modules/admin")
const tweetController = require("../controllers/tweet-controller")

router.use("/admin", admin)
router.get("/tweets", tweetController.getTweets)
router.use("/", (req, res) => res.redirect("/tweets"))

module.exports = router
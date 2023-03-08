const express = require("express")
const router = express.Router()
const passport = require("../config/passport")

const admin = require("./modules/admin")
const tweetController = require("../controllers/tweet-controller")
const userController = require("../controllers/user-controller")
const replyController = require("../controllers/reply-controller")
const followshipController = require("../controllers/followship-controller")
const { authenticated } = require("../middleware/auth") 
const { generalErrorHandler } = require("../middleware/error-handler")

router.use("/admin", admin)

router.get("/signup", userController.signUpPage)
router.post("/signup", userController.signUp)
router.get("/signin", userController.signInPage)
router.post("/signin", passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }), userController.signIn)
router.get("/logout", userController.logout)

router.get("/tweets", authenticated, tweetController.getTweets)
router.post("/tweets", authenticated, tweetController.postTweet)

router.get("/tweets/:id/replies", authenticated, replyController.getReplies)
router.post("/tweets/:id/replies", authenticated, replyController.postReplies)

router.get("/users/:id/tweets", authenticated, userController.getProfile)
router.get("/users/:id/replies", authenticated,  userController.getReplies)
router.get("/users/:id/likes", authenticated,  userController.getLikes)
router.get("/users/:id/setting", authenticated, userController.getSetting)
router.put("/users/:id/setting", authenticated, userController.putSetting)

router.post("/folloships", authenticated, followshipController.addFollowing)
router.delete("/followships/:id", authenticated, followshipController.removeFollowing)

router.use("/", (req, res) => res.redirect("/tweets"))
router.use("/", generalErrorHandler)

module.exports = router

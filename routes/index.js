const express = require("express")
const router = express.Router()
const passport = require("../config/passport")
const upload = require("../middleware/multer")
const admin = require("./modules/admin")
const tweetController = require("../controllers/tweet-controller")
const userController = require("../controllers/user-controller")
const replyController = require("../controllers/reply-controller")
const followshipController = require("../controllers/followship-controller")
const { authenticated, authenticatedLimit } = require("../middleware/auth") 
const { generalErrorHandler } = require("../middleware/error-handler")
const { getRecommendedUsers } = require("../middleware/recommendedUser")

router.use("/admin", admin)

router.get("/signup", userController.signUpPage)
router.post("/signup", userController.signUp)
router.get("/signin", userController.signInPage)
router.post("/signin", passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }), userController.signIn)
router.get("/logout", userController.logout)

router.get("/tweets", authenticated, getRecommendedUsers, tweetController.getTweets)
router.post("/tweets", authenticated, getRecommendedUsers, tweetController.postTweet)

router.get("/tweets/:id/replies", authenticated, getRecommendedUsers, replyController.getReplies)
router.post("/tweets/:id/replies", authenticated, getRecommendedUsers, replyController.postReplies)

router.get("/users/:id/tweets", authenticated, getRecommendedUsers, userController.getProfile)
router.get("/users/:id/replies", authenticated, getRecommendedUsers, userController.getReplies)
router.get("/users/:id/likes", authenticated, getRecommendedUsers, userController.getLikes)
router.get("/users/:id/setting", authenticated, getRecommendedUsers, userController.getSetting)
router.put("/users/:id/setting", authenticated, getRecommendedUsers, userController.putSetting)
router.get("/users/:id/followers", authenticated, getRecommendedUsers, userController.getFollowers)
router.get("/users/:id/followings",authenticated, getRecommendedUsers, userController.getFollowings)

router.post("/followships", authenticated, followshipController.addFollowing)
router.delete("/followships/:id", authenticated, followshipController.removeFollowing)

router.post("/tweets/:id/unlike", authenticated, tweetController.postUnlike)
router.post("/tweets/:id/like", authenticated, tweetController.postLike)

//api
router.get("/api/users/:id", authenticatedLimit, userController.getUserInfo)
router.post("/api/users/:id", authenticatedLimit, upload.fields([
	{ name: "image", count: 1 },
	{ name: "coverImage", count: 1 }
]), userController.postUser)

router.use("/", (req, res) => res.redirect("/tweets"))
router.use("/", generalErrorHandler)

module.exports = router

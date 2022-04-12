const router = require("express").Router();
const upload = require("../../../middlewares/multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { localStrategy, register, login, me, logout } = require("./controller");

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));

router.post("/register", upload.none(), register);
router.post("/login", upload.none(), login);
router.post("/me", me);
router.post("/logout", logout);

module.exports = router;

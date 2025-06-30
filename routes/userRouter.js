const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const userController = require("../controllers/userController");
const db = require("../db/queries");
const passport = require("passport");

// Creating Router
const userRouter = Router();

// Function to Check Whether User is Authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

// Function to Check Whether User is Member
function ensureMember(req, res, next) {
  if (req.user.is_member) return next();
  res.status(403).render('not-authorized');
}

// Validation & Sanitization
const validateItem = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 255 })
    .withMessage("First name must be at most 255 characters"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 255 })
    .withMessage("Last name must be at most 255 characters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .isLength({ max: 255 })
    .withMessage("Email must be at most 255 characters")
    .custom(async (email) => {
      const isDuplicate = await db.isDuplicateEmail(email);
      if (isDuplicate) {
        throw new Error("That email is already registered");
      }
      return true;
    }),

  body("password").notEmpty().withMessage("Password is required"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

// Routes (Homepage w/ Sign-in)
userRouter.get("/", userController.renderHomePage);

// Routes (Sign-in submission)
userRouter.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/password-try",
    failureRedirect: "/",
  })
);

// Routes (Member-Only Password Try)
userRouter.get(
  "/password-try",
  ensureAuthenticated,
  userController.renderPasswordTry
);

userRouter.post(
  "/password-try",
  ensureAuthenticated,
  userController.handlePasswordTry
);

userRouter.get(
  "/secret",
  ensureAuthenticated,
  ensureMember,
  userController.renderSecret
);





// Routes (Sign-Up Form)
userRouter.get("/sign-up", userController.renderSignUp);
userRouter.post("/sign-up", userController.handleSignUp);


module.exports = userRouter;

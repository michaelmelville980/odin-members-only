const express = require("express");
const path = require("node:path");
const userRouter = require("./routes/userRouter");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/queries");

// Running Main Router
const app = express();

// Body parsing for form submissions
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Passport (Local Strategy)
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.findUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "No such user" });
      }
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.findUserById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Mount our users router at "/"
app.use("/", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));

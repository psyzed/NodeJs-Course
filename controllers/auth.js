const User = require("../models/user");
const bcrypt = require("bcryptjs");

function getLoginPage(req, res, next) {
  const errorMessage = req.flash("error")[0] || null;

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage,
  });
}

function postLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        res.redirect("/login");
        return Promise.reject("User does not exist.");
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            req.flash("error", "Invalid email or password.");
            res.redirect("/login");
            return Promise.reject("Wrong password or email");
          }

          req.session.loggedIn = true;
          req.session.user = {
            _id: user._id.toString(),
          };
          return req.session.save((err) => {
            if (err) console.log(err);

            res.redirect("/");
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function postLogout(req, res, next) {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/login");
  });
}

function getSignup(req, res, next) {
  const errorMessage = req.flash("error")[0] || null;

  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage,
  });
}

function postSignup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "E-mail already exists, please pick a different one.",
        );
        res.redirect("/signup");
        return Promise.reject("User exists");
      }

      return bcrypt.hash(password, 12);
    })
    .then((hasedPassword) => {
      const user = new User({
        email: email,
        password: hasedPassword,
        cart: { items: [] },
      });

      return user.save();
    })
    .then(() => res.redirect("/login"))
    .catch((err) => console.log(err));
}

exports.getLoginPage = getLoginPage;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.getSignup = getSignup;
exports.postSignup = postSignup;

const User = require("../models/user");

function getLoginPage(req, res, next) {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuth: false,
  });
}

function postLogin(req, res, next) {
  User.findById("69c002e2e16fa0f94b00caa0")
    .then((user) => {
      req.session.loggedIn = true;
      req.session.user = {
        _id: user._id.toString(),
      };
      req.session.save((err) => {
        if (err) console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
}

function postLogout(req, res, next) {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/login");
  });
}

exports.getLoginPage = getLoginPage;
exports.postLogin = postLogin;
exports.postLogout = postLogout;

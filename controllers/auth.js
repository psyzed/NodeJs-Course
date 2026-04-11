const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
require("dotenv").config();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      ...process.env.SENDGRID,
    },
  }),
);

function getLoginPage(req, res, next) {
  const errorMessage = req.flash("error")[0] || null;

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
}

function postLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      docTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          docTitle: "Login",
          errorMessage: "Invalid email or password.",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: { email: "email", password: "password" },
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res.status(422).render("auth/login", {
              path: "/login",
              docTitle: "Login",
              errorMessage: "Invalid email or password.",
              oldInput: {
                email: email,
                password: password,
              },
              validationErrors: { email: "email", password: "password" },
            });
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

  const oldInput = {
    email: "",
    password: "",
  };

  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage,
    oldInput,
    validationErrors: [],
  });
}

function postSignup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const oldInput = {
      email: email || "",
      password: password || "",
    };

    return res.status(422).render("auth/signup", {
      path: "/signup",
      docTitle: "Signup",
      errorMessage: validationErrors.array()[0].msg,
      oldInput,
      validationErrors: validationErrors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hasedPassword) => {
      const user = new User({
        email: email,
        password: hasedPassword,
        cart: { items: [] },
      });

      return user.save();
    })
    .then(() => {
      transporter.sendMail({
        to: "psyzed66@gmail.com",
        from: "psyzed66@gmail.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      });
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
}

function getReset(req, res, next) {
  const errorMessage = req.flash("error")[0] || null;

  res.render("auth/reset", {
    path: "/reset",
    docTitle: "Reset Password",
    errorMessage,
  });
}

function postReset(req, res, next) {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          res.redirect("/reset");
          return Promise.reject();
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        transporter
          .sendMail({
            to: req.body.email,
            from: "psyzed66@gmail.com",
            subject: "Reset password!",
            html: `<h1>Here is your reset password email!</h1>
          <p>Click this <a href="http://localhost:3000/new-password/${token}">link</a> to set new password!</p>
          `,
          })
          .then((r) => console.log(r));
      })

      .catch((err) => console.log(err));
  });
}

function getNewPassword(req, res, next) {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      const errorMessage = req.flash("error")[0] || null;

      if (!user) {
        res.redirect("/login");
        return Promise.reject();
      }

      res.render("auth/new-password", {
        path: "/new-password",
        docTitle: "New Password",
        errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
}

function postNewPassword(req, res, next) {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const passwordToken = req.body.passwordToken;
  const userId = req.body.userId;

  let foundUser;

  if (newPassword !== confirmPassword) {
    req.flash("error", "Passwords don't match!");
    res.redirect(`/new-password/${passwordToken}`);
    return;
  }

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      foundUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      if (!foundUser) return;

      foundUser.password = hashedPassword;
      foundUser.resetToken = null;
      foundUser.resetTokenExpiration = undefined;
      return foundUser.save();
    })
    .then(() => res.redirect("/login"))
    .catch((err) => console.log(err));
}

exports.getLoginPage = getLoginPage;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.getSignup = getSignup;
exports.postSignup = postSignup;
exports.getReset = getReset;
exports.postReset = postReset;
exports.getNewPassword = getNewPassword;
exports.postNewPassword = postNewPassword;

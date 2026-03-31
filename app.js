const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rootDir = require("./utils/path");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URI =
  "mongodb+srv://psyzed66:231187@nodecoursecluster.f8tp7mz.mongodb.net/shop?appName=NodeCourseCluster";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");

const User = require("./models/user");

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use((req, res, next) => {
  User.findById(req.session.user?._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Database connected!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

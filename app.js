const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rootDir = require("./utils/path");
const path = require("path");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const User = require("./models/user");

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  User.findById("69c002e2e16fa0f94b00caa0")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

mongoose
  .connect(
    "mongodb+srv://psyzed66:231187@nodecoursecluster.f8tp7mz.mongodb.net/shop?appName=NodeCourseCluster",
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Lazaros",
          email: "test@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    console.log("Database connected!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

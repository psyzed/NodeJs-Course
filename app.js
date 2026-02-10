const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rootDir = require("./utils/path");
const path = require("path");
const handlebars = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// app.engine('pug', require('pug').__express)
// app.set("view engine", "pug");
app.engine(
  "hbs",
  handlebars({
    layoutDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  }),
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { docTitle: "Page Not Found!" });
});

app.listen(3000);

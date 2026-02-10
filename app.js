const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rootDir = require("./utils/path");
const path = require("path");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { docTitle: "Page Not Found!", path: "/404" });
});

app.listen(3000);

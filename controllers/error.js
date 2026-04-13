function get404Page(req, res, next) {
  res.status(404).render("404", {
    docTitle: "Page Not Found!",
    path: "/404",
  });
}
function get500Page(req, res, next) {
  res.status(500).render("500", {
    docTitle: "Server Error!",
    path: "/500",
  });
}

exports.get404Page = get404Page;
exports.get500Page = get500Page;

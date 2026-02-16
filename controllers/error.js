function get404Page(req, res, next) {
  res.status(404).render("404", { docTitle: "Page Not Found!", path: "/404" });
}

exports.get404Page = get404Page;

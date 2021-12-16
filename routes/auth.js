// Logout
router.get("/logout", function (req, res) {
  res.clearCookie("connect.sid");
  res.redirect("/");
});

module.exports = router;

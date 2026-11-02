const isAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "please signup or Login first",
    });
  }

  res.userId = req.session.user.id;
  next();
};

module.exports = isAuth;

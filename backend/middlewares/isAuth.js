const isAuth = (req, res, next) => {
      console.log("Session ID:", req.sessionID);
  console.log("User ID:", req.session.userId);


  if (!req.session.userId) {
    return res.status(401).json({
      message: "please signup or Login first",
    });
  }

  req.userId = req.session.userId;
  next();
};

module.exports = isAuth;

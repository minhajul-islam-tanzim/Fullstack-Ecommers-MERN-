const User = require('../models/user')
const bcrypt = require("bcrypt");


exports.register = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already used" });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).json({
        user: {id: user._id, name: user.name, email: user.email}
    })
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res, next) => {
  
}
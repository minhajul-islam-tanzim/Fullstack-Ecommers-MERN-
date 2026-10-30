const User = require("../models/user");
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
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};





exports.login = async (req, res, next) => {

   
  try {

    const email = req.body.email.toLowerCase().trim();
    const password = String(req.body.password ?? "");

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid email or password" });

req.session.userId = user._id.toString();

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
    });


  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

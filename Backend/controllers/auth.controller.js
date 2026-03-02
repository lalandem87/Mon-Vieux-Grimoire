const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hash,
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ userId: user._id, token });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

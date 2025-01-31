const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
// REGISTER
router.post("/register", async (request, response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);
    const findUser = await User.findOne({ username: request.body.username });
    if (findUser) return response.status(404).json("user already exists");

    const newUser = new User({
      username: request.body.username,
      email: request.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    response.status(200).json(user);
  } catch (err) {
    response.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (request, response) => {
  try {
    const user = await User.findOne({ username: request.body.username });
    !user && response.status(400).json("Wrong Credebtuals!");

    const vaildated = await bcrypt.compare(
      request.body.password,
      user.password
    );
    !vaildated && response.status(400).json("Wrong Credebtuals!");
    const { password, ...others } = user._doc;
    return response.status(200).json(others);
  } catch (err) {
    response.status(500).json(err);
  }
});

module.exports = router;

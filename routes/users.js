const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//  UPDATE
router.put("/:id", async (request, response) => {
  if (request.body.userId === request.params.id) {
    if (request.body.password) {
      const salt = await bcrypt.genSalt(10);
      request.body.password = await bcrypt.hash(request.body.password, salt);
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        request.params.id,
        {
          $set: request.body,
        },
        { new: true }
      );
      response.status(200).json(updateUser);
    } catch (err) {
      response.status(500).json(err);
    }
  } else {
    response.status(401).json("You can update only your account!");
  }
});

//DELETE
router.delete("/:id", async (request, response) => {
  if (request.body.userId === request.params.id) {
    try {
      const user = await User.findById(request.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndUpdate(request.params.id);
        response.status(200).json("user has been deleted...");
      } catch (err) {
        response.status(500).json(err);
      }
    } catch (err) {
      response.status(404).json("user not found");
    }
  } else {
    response.status(401).json("You can delet only your account!");
  }
});

// GET  USERS
router.get("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    const { password, ...others } = user._doc;
    response.status(200).json(others);
  } catch (err) {
    response.status(500).json(err);
  }
});

module.exports = router;

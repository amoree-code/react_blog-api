const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Post");

//  CREATE POST
router.post("/", async (request, response) => {
  const newPost = new Post(request.body);
  try {
    const sevedPost = await newPost.save();
    response.status(200).json(sevedPost);
  } catch (err) {
    response.status(500).json(err);
  }
});

// UPDATE POST
router.put("/:id", async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (post.username === request.body.username) {
      try {
        const updataedPost = await Post.findByIdAndUpdate(
          request.params.id,
          {
            $set: request.body,
          },
          { new: true }
        );
        response.status(200).json(updataedPost);
      } catch (err) {
        response.status(401).json("you can updata oply your post");
      }
    } else {
      response.status(401).json("you can updata oply your post");
    }
    Post.findById(request.params.id);
  } catch (err) {
    response.status(500).json(err);
  }
});

// DELETE POST
router.delete("/:id", async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (post.username === request.body.username) {
      try {
        console.log(request.body.username);
        await post.deleteOne();
        response.status(200).json("post deleted successfully");
      } catch (err) {
        response.status(500).json("not found");
      }
    } else {
      response.status(401).json("you can delete the post");
    }
  } catch (err) {
    response.status(500).json("not found");
  }
});

// GET ALL POSTS
router.get("/", async (request, response) => {
  const username = request.query.user;
  const catName = request.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }
    response.status(200).json(posts);
  } catch (err) {
    response.status(500).json(err);
  }
});

// GET SINGLE POST
router.get("/:id", async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    response.status(200).json(post);
  } catch (err) {
    response.status(500).json(err);
  }
});

module.exports = router;

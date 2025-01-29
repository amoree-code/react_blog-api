const router = require("express").Router();
const Category = require("../models/Category");

router.post("/", async (request, response) => {
  const newCat = new Category(request.body);
  try {
    const savedCat = await newCat.save();
    response.status(200).json(savedCat);
  } catch (err) {
    response.status(404).json(err);
  }
});

router.get("/", async (request, response) => {
  try {
    const cats = await Category.find();
    response.status(200).json(cats);
  } catch (err) {
    response.status(404).json(err);
  }
});

module.exports = router;

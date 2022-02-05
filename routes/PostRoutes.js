const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");
const protect = require("../middleware/AuthMiddleware");

router
  .route("/")
  .get(protect, postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route("/:id")
  .get(protect, postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;

import express from "express";
import auth from "../middlewares/auth.js";
import * as postController from "../controllers/postController.js";

const router = express.Router();

router.get("/feed", auth, postController.getFeed);
router.post("/new-post", auth, postController.createPost);
router.delete("/post/:id", auth, postController.deletePost);
router.post("/like/:id", auth, postController.likePost);
router.delete("/like/:id", auth, postController.unlikePost);
router.post("/comment/:id", auth, postController.comment);
router.delete("/comment/:id", auth, postController.deleteComment);

export default router;

import express from "express";
import auth from "../middlewares/auth";
import * as userController from "../controllers/userController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.get("/me", auth, userController.getCurrentUser);
router.patch("/update-user", auth, upload.single("picture"), userController.updateUser);
router.get("/user/:user", auth, userController.getUser);
router.get("/search-users", auth, userController.searchUsers);
router.post("/follow/:id", auth, userController.followUser);
router.delete("/follow/:id", auth, userController.unfollowUser);
router.get("/followers/:id", auth, userController.getFollowers);
router.get("/follows/:id", auth, userController.getFollows);

export default router;

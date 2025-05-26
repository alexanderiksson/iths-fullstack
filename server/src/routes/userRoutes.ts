import express from "express";
import auth from "../middlewares/auth";
import * as userController from "../controllers/userController";

const router = express.Router();

router.get("/me", auth, userController.getCurrentUser);
router.get("/user/:user", auth, userController.getUser);
router.get("/search-users", auth, userController.searchUsers);
router.post("/follow/:id", auth, userController.followUser);
router.delete("/follow/:id", auth, userController.unfollowUser);

export default router;

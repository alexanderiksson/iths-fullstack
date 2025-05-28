import express from "express";
import auth from "../middlewares/auth";
import * as authController from "../controllers/authController";

const router = express.Router();

router.get("/check-auth", auth, authController.checkAuth);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;

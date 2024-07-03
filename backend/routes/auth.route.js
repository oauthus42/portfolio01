import express from "express";
import { getMe, sugnup, login, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", sugnup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
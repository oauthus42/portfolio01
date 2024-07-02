import express from "express";
import { sugnup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signup", sugnup);
router.get("/login", login);
router.get("/logout", logout);

export default router;
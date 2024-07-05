import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnPost, createPost, deletePost, 
        getAllPost, getFollowingPost, getLikePosts, 
        getUserPosts, likeUnlikePost 
    } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPost);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/following", protectRoute, getFollowingPost);
router.get("/likes/:id", protectRoute, getLikePosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
export default router;
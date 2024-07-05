import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import {v2 as cloudinary} from 'cloudinary';
import { populate } from "dotenv";
import { trusted } from "mongoose";

export const createPost = async(req, res) => {
    try {
        const {text} = req.body; 
        let { img } = req.body; 
        const userId = req.user._id.toString();
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({message:'Пользователь не найден'});
        if(!text && !img) return res.status(400).json({message:'Пост должен содержать текст или изображение'});

        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;

        }

        const newPost = new Post({
            user: userId,
            text,
            img
        });

        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    };
};

export const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message:'Пост не найден'});

        if(post.user.toString() !== req.user._id.toString) {
            return res.status(401).json({message:'У вас нет прав на удаление этого поста'});
        }

        //если в посте есть изображение, то при удалении поста удалить изображение из cloudinary
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        
        //удаление поста из MongoDB
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:'Пост удален'});
    } catch (error) {
        console.log('Ошибка удаления в deletePost (post controller): ', error.message);
        res.status(500).json({message:'Internal Server Error'});
    };
};

export const commentOnPost = async(req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text) return res.status(400).json({message:'Текстовое поле обязательно для заполнения'});
        
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Пост не найден'});

        const comment = {user: userId, text};
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.log('Ошибка в commentOnPost (post.controller): ', error.message);
        res.status(500).json({message:'Internal Server Error'});
    }
};

export const likeUnlikePost = async(req, res) => {
    try {
        const userId = req.user._id;
        const {id: postId} = req.params;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Пост не найден'});

        const userLikedPost = post.likes.includes(userId);
        if(!userLikedPost){
            //дизлайк
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});
            res.status(200).json({message:'Ваш лайк удален с поста'});
        } else {
            //лайк
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type:'like'
            });

            await notification.save();
            res.status(200).json({message:'Ваш лайк поставлен на пост'});
        }
    } catch (error) {
        console.log('Ошибка в likeUnlikePost (post.controller): ', error.message);
        res.status(500).json({message:'Internal Server Error'});
    };
};

export const getAllPost = async(req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: 'user',
            select: '-password'
        })
        populate({
            path: 'comments.user',
            select: '-password'
        });
        
        if(posts.length === 0) return res.status(200).json([]);
        res.status(200).json(posts);
    } catch (error) {
        console.log('Ошибка в getAllPost (post.controller): ', error.message);
        res.status(500).json({message:'Internal Server Error'});
    };
};

export const getLikePosts = async(req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:'Пользователь не найден'});

        const likedPosts = await Post.find({_id: {$in: user.likedPosts}}).populate({
            path:'user',
            select: '-password'
        }).populate({
            path:'comments.user',
            select:'-password'
        });

        res.status(200).json(likedPosts);
    } catch (error) {
        console.log('Ошибка в getLikePosts (post.controller): ', error.message);
        res.status(500).json({message:'Internal Server Error'});
    };
};

export const getFollowingPost = async(req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:'Пользователь не найден'});

        const following = user.following;
        const feedPosts = await Post.find({user:{$in: following}}).sort({createdAt: -1}).populate({
            path: 'user',
            select: '-password'
            }).populate({
            path:'comment',
            select:'-password'
        });

        res.status(200).json(feedPosts);
    } catch (error) {
        console.log('Ошибка в getFollowingPost (post.controller): ', error.message);
        res.status(500).json({message:'Internal Server Error'});
    };
};

export const getUserPosts = async(req,res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({message:'Пользователь не найден'});

        const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path:'comments.user',
            select:'-password'
        });

        res.status(200).json(posts);
        
    } catch (error) {
        console.log('Ошибка в getUserPosts (post.controller): ', error.message);
        res.status(500).json({message:'Internal Server Error'});
    }
};
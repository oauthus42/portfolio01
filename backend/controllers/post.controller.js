import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from 'cloudinary';

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
        console.log('Ошибка удаления в post controller: ', error.message);
        res.status(500).json({message:'Internal Server Error'});
    };
};



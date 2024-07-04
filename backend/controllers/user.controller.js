import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async(req,res) => {
    const {username} = req.params();

    try {
        const user = await User.findOne({username}).select("-password");
        if(!user) return res.status(404).json({message: 'Пользователь не найден'});
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error: error.message});
        console.log('Ошибка в getUserProfile: ', error.message);
    };
};

export const followUnfollowUser = async(req, res) => {
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        
        const currentUser = await User.findById(req.user._id);
        if(id === req.user._id.toString()) return res.status(400).json({message:'Вы не можете подписаться на себя'});
        if(!userToModify || !currentUser) return res.status(400).json({error:'Пользователь не найден'});

        const isFollowing = currentUser.following.includes(id, {$push: {followers: req.user._id} });
        if(!isFollowing) {
            //unfollow user
            await User.findByIdAndUpdate(id, {$pull: followers.req.user._id});
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            res.status(200).json({message:'Вы успешно отписались от пользователя'});
        } else {
            await User.findByIdAndUpdate(id, {$push: followers.req.user._id});
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            
            //отправить уведомление для пользователя
            const newNotification = new Notification({
                type:"follow",
                from: req.user._id,
                to: userToModify._id
            });
            await newNotification.save();
            res.status(200).json({message:'Вы успешно подписались на пользователя'});
        }

    } catch (error) {
        res.status(500).json({error: error.message});
        console.log('Ошибка в followUnfollowUser: ', error.message);
    }
}

export const getSuggestedUser = async(req, res) => {
    try {
        const userId = req.user._id;
        

        const userFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne:userId}
                }
            },
            {$sample:{size:10}}
        ])

        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id));
        const suggestedUser = filteredUsers.slice(0,4);
        suggestedUser.forEach(user => user.password = null);

        res.status(200).json(suggestedUser);
    } catch (error) {
        console.log('Ошибка в getSuggestedUser: ', error.message);
        res.status(500).json({error: error.message});
    }
}
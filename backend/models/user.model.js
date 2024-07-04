import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

//создание пользовательской схемы
const userSchema = new mongoose.Schema({//уточнить
    //участник с августа 2023 года
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength : 8
    },
    emall: {
        type: String,
        required: true,
        unique: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId, //тип идентификатора объекта у MongoDB имеет строгую длину. оставим 16
        ref: "User", //ссылка на модель пользователя
        default: [] // по дефолту подписчиков нет
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: { 
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    likedPosts: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
            default: []
        }
    ]
}, {timeStamps: true});

//создание пользовательской модели
//кстати, если допустить опечатку и ввести "mongoose.Model", то из-за заглавной M всё рухнет :)
const User = mongoose.model('User', userSchema);


export default User;
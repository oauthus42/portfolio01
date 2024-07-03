import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const sugnup = async (req, res) => {
        try {
            const {fullname, username, emall, password} = req.body;
            //валидность адреса почты
            const emallRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (! emallRegex.test(emall)) {
                return res.status(400).json({error: 'Некорретно введен адрес почты'});
            }

            //ищем в таблице юзера
            const existingUser = await User.findOne ({username});
            //если такое имя занято, то:
            if(existingUser) {
                return res.status(400).json({error: 'Имя пользователя уже занято'});
            }

            //проверка адреса почты
            const existingEmail = await User.findOne ({emall})
            if(existingEmail) {
                return res.status(400).json({error: 'Такой е-mail уже существует'});
            }

            if(password.length < 6) {
                return res.status(400).json({error: 'Пароль должен содержать не менее 6 символов'});
            }

            //хэширование пароля
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User ({
                fullname,
                username,
                emall,
                password: hashedPassword
            });

            if(newUser) {
                generateTokenAndSetCookie(newUser._id, res);
                await newUser.save();

                res.status(201).json({
                    _id: newUser._id,
                    fullname: newUser.fullname,
                    username: newUser.username,
                    emall: newUser.emall,
                    followers: newUser.followers,
                    following: newUser.following,
                    profileImg: newUser.profileImg,
                    coverImg: newUser.coverImg
                });
            } else {
                res.status(400).json({error: 'Некорректные данные пользователя'});
            }

        } catch (error) {
            console.log('Ошибка при регистрации', error.message);
            res.status(500).json({error: 'Internal Server Error'});
        }
};

export const login = async (req, res) => {
    res.json ({
        data: "login endpoint",
    });
};

export const logout = async (req, res) => {
    res.json ({
        data: "logout endpoint",
    });
};



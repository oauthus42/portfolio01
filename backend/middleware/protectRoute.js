import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
            if(!token) {
            res.status(401).json({error: 'Ошибка входа'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //если токен не прошел проверку
            if(!decoded) {
            res.status(401).json({error:'Истек срок действия токена'});
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({error:'Пользователь не найден'});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log('Ошибка в protectRoute middleware', error.message);
        return res.status(500).json({error:'Internal Server Error'})
    }
}
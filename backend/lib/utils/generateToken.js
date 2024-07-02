import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })
}

//отправка токена в куки
res.cookie("jwt", token, {
    maxAge: 15*24*60*60*1000, //в милисекундах
    httpOnly: true, //от xss атак
    sameSite: "strict", // от csrf атак 
    secure: process.env.NODE_ENV !== "development",

});
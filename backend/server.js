import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import connectMongoDB from "./db/connectMongoDB.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});  

const app = express();

console.log(process.env.mongoURI);
const PORT = process.env.PORT || 8000;

//чтобы разобрать тело запроса
app.use(express.json()); //чтобы спарсить тело реквеста
app.use(express.urlencoded({extended: true})); //чтобы спарсить date

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8000, () => {
    console.log(`server is runing port ${PORT}`);
    connectMongoDB();
});
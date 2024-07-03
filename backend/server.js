import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectMongoDB from "./db/connectMongoDB.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();

console.log(process.env.mongoURI);
const PORT = process.env.PORT || 8000;

//чтобы разобрать тело запроса
app.use(express.json()); //чтобы спарсить тело реквеста
app.use(express.urlencoded({extended: true})); //чтобы спарсить date

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(8000, () => {
    console.log(`server is runing port ${PORT}`);
    connectMongoDB();
});
import express from "express";
import dotenv, { config } from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();
const app = express();

console.log(process.env.mongoURI);
const PORT = process.env.PORT || 5000;

//чтобы разобрать тело запроса
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/auth", authRoutes);
app.listen(8000, () => {
    console.log(`server is runing port ${PORT}`);
    connectMongoDB();
});
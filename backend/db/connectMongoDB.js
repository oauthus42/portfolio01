import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.mongoURI);
        console.log(`Успешное соединение с MongoDB: ${connect.connection.host}`);
    }
    catch (error) {
        console.log(`Ошибка соединения с MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectMongoDB;
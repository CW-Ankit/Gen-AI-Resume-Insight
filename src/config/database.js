import mongoose from "mongoose";
import config from "./config.js";

export async function connectToDB() {
    try{
        await mongoose.connect(config.MONGO_URI)

        console.log("Connected to DB")

    } catch (error) {
        
        console.log("Database Connection Failed\nError: ", error)

        process.exit()
    }
}
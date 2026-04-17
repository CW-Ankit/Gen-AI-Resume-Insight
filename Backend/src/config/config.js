import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environmental variables.")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environmental variables.")
}

if(!process.env.REDIS_URL){
    throw new Error("JWT_SECRET is not defined in environmental variables.")
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    VITE_URL:process.env.VITE_URL
}

export default config;
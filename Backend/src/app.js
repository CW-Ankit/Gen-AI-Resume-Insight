import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

import authRouter from "./routes/authRoutes.js";
import config from "./config/config.js";

const app = express()

/**
 * Middlewares
 */
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: config.VITE_URL,
    credentials: true
}))

/**
 * Authentication Route
 */
app.use("/api/auth", authRouter)


export default app
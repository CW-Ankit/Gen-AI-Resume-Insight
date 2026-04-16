import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/authController.js";

const authRouter = Router()


/** 
 * @route POST /api/auth/register
 * @description Register a new User using username, email and password
 * @access Public
 */
authRouter.post("/register", registerUser)

/** 
 * @route POST /api/auth/login
 * @description Login User using email and password
 * @access Public
 */
authRouter.post("/login", loginUser)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token in the blacklist
 * @access Public
 */
authRouter.get("/logout", logoutUser)

export default authRouter
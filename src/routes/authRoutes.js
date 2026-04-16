import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

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
authRouter.post("/login",loginUser)


export default authRouter
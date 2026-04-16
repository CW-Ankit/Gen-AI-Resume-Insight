import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, getMe } from "../controllers/authController.js";
import authUser from "../middlewares/authMiddleware.js";

const authRouter = Router()


/** 
 * @route POST /api/auth/register
 * @description Register a new User using username, email and password
 * @access public
 */
authRouter.post("/register", registerUser)

/** 
 * @route POST /api/auth/login
 * @description Login User using email and password
 * @access public
 */
authRouter.post("/login", loginUser)

/**
 * @route GET /api/auth/me
 * @description Get the current logged in user details
 * @access private
 */
authRouter.get("/me", authUser, getMe)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token in the blacklist
 * @access public
 */
authRouter.get("/logout", logoutUser)

/**
 * @route GET /api/auth/refresh-access-token
 * @description refresh access token using refresh token
 * @access public
 */
authRouter.get("/refresh-access-token",refreshAccessToken)

export default authRouter
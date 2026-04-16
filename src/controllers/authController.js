import userModel from "../models/userModel.js";
import tokenBlacklistModel from "../models/blacklistModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import config from "../config/config.js";

/**
 * @name registerUser
 * @route POST /api/auth/register
 * @description Controller for registering a User into the Application using username, email & password
 * @access Public
 * @param {*} req Request coming from the API [username, email, password]
 * @param {*} res Response going to the API [accessToken, ]
 */
export async function registerUser(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "please provide username, email and password"
        })
    }

    const userAlreadyExist = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (userAlreadyExist) {
        if (userAlreadyExist.username === username) {
            return res.status(400).json({
                message: "username already exist"
            })
        }
        if (userAlreadyExist.email === email) {
            return res.status(400).json({
                message: "email already exist"
            })
        }
    }


    const hashed = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashed,
        verified: true
    })

    const accessToken = jwt.sign(
        { id: user._id, username: user.username },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    )

    const refreshToken = jwt.sign(
        { id: user._id },
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    // 3. Set the Refresh Token in a secure httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
        message: "user created successfully",
        user: {
            username,
            email,
            verified: true
        },
        accessToken
    })
}

/**
 * @name registerUser
 * @route POST /api/auth/register
 * @description Controller for registering a User into the Application using username, email & password
 * @access Public
 * @param {*} req Request coming from the API [username, password || (current) email, password]
 * @param {*} res Response going to the API 
 */
export async function loginUser(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "user not found"
        })
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }


    const accessToken = jwt.sign(
        { id: user._id, username: user.username },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    )

    const refreshToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        message: "user logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        accessToken
    })
}

/**
 * @name refreshAccessToken
 * @route GET /api/auth/refresh-access-token
 * @description Controller for refreshing the access token using refresh token
 * @access Public
 * @param {*} req Request coming from the API [cookies = refreshToken]
 * @param {*} res Response going to the API [accessToken]
 */
export async function refreshAccessToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    try {
        // Verify the token
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

        // Verify against DB to ensure it wasn't revoked
        const user = await userModel.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new Access Token
        const newAccessToken = jwt.sign(
            { id: user._id, username: user.username },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Expired refresh token" });
    }
}


/**
 * @name logoutUser
 * @route GET /api/auth/register
 * @description Controller for logging out a User from the Application and blacklisting the access token
 * @access Public
 * @param {*} req Request coming from the API 
 * @param {*} res Response going to the API 
 */
export async function logoutUser(req, res) {
    return
}
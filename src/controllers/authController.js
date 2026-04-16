import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import redisClient from "../config/redisClient.js";

/**
 * @name registerUser
 * @route POST /api/auth/register
 * @description Controller for registering a User into the Application using username, email & password
 * @access Public
 * @param {*} req Request coming from the API [username, email, password]
 * @param {*} res Response going to the API [accessToken, ]
 */
export async function registerUser(req, res) {
    try {
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
            { id: user._id, username: user.username },
            config.JWT_SECRET,
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
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name loginUser
 * @route POST /api/auth/login
 * @description Controller for logging in a User into the Application using email & password
 * @access Public
 * @param {*} req Request coming from the API [username, password || (current) email, password]
 * @param {*} res Response going to the API 
 */
export async function loginUser(req, res) {
    try {
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
            { id: user._id, username: user.username },
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
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
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

    // 1. Check if the token is in the Redis blacklist
    const isBlacklisted = await redisClient.get(refreshToken);
    if (isBlacklisted) {
        return res.status(403).json({ message: "Token has been revoked. Please login again." });
    }

    try {
        // 2. Verify the token signature
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

        // 3. Issue a new access token
        const newAccessToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}

/**
 * @name logoutUser
 * @route GET /api/auth/logout
 * @description Controller for logging out a User from the Application and blacklisting the access token
 * @access Public
 * @param {*} req Request coming from the API 
 * @param {*} res Response going to the API 
 */
export async function logoutUser(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        try {
            // Decode the token to get its expiration time (exp)
            const decoded = jwt.decode(refreshToken);

            // Calculate how many seconds until it expires
            if (decoded && decoded.exp) {
                const expiry = decoded.exp - Math.floor(Date.now() / 1000);

                if (expiry > 0) {
                    // Set the token as a key in Redis with a value (e.g., '1')
                    // EX sets the expiration time in seconds
                    await redisClient.set(refreshToken, 'blacklisted', {
                        EX: expiry
                    });
                }
            }
        } catch (error) {
            console.error("Blacklisting error:", error);
        }
    }

    // Clear the client's cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    });

    res.status(200).json({ message: "Logged out successfully" });
}
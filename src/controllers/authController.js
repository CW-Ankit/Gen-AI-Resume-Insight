import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import config from "../config/config.js";

/**
 * @name registerUser
 * @route /api/auth/register
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

    res.cookie("accessToken", accessToken)

    res.status(201).json({
        message: "user created successfully",
        user: {
            username,
            email,
            verified: true
        }
    })
}

/**
 * @name registerUser
 * @route /api/auth/register
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

    res.cookie("accessToken", accessToken)

    res.status(200).json({
        message: "user logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
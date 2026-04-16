import config from "../config/config.js";
import jwt from "jsonwebtoken"

export default function authUser(req, res, next) {
    const accessToken = req.headers["authorization"]?.split(" ")[1];

    if (!accessToken) return res.status(401).json({ message: "No access token" });

    try{
        const decoded = jwt.verify(accessToken, config.JWT_SECRET)

        req.user = decoded

        next();

    } catch (error){
        return res.status(401).json({
            message: "Invalid or expired access token. Please login again.",
        })
    }
}
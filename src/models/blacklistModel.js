import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: [true, "token is required for blacklisting"]
    }
}, {
    timestamps: true
})

const tokenBlacklistModel = mongoose.model("blacklistToken",tokenBlacklistSchema)

export default tokenBlacklistModel
import { Router } from "express";
import authUser from "../middlewares/authMiddleware.js";
import { generateInterviewReport } from "../services/aiService.js";
import { upload } from "../middlewares/fileMiddleware.js";

const interviewRouter = Router()

/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description, resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authUser, upload.single("resume"), generateInterviewReport)

export default interviewRouter;

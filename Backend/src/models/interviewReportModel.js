import mongoose from 'mongoose';

/**
 * 
 * - Job Decription : String
 * - Resume Text : String
 * - Self Decription: String
 * - Overall Score: Number
 * 
 *  - Technical questions : [{
 *      question: "", answer:"", intention: ""
 *      }]
 *  - Behavioral question : [{
 *      question: "", answer:"", intention: ""
 *      }]
 *  - Skill Gap : [{
 *      skill: "",
 *      severity: {
 *              "",
 *              enum:["High", "Medium", "Low"]
 *          }
 *      }]
 *  - Preparation Plan : [{
 *          day: Number,
 *          focus: String,
 *          tasks: ["","","",...]
 *      }]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "question is required"]
    },
    answer: {
        type: String,
        required: [true, "answer is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is Required"]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "question is required"]
    },
    answer: {
        type: String,
        required: [true, "answer is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is Required"]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "skill is required"]
    },
    severity: {
        type: String,
        enum: ["High", "Medium", "Low"],
        required: true
    }

}, {
    _id: false
})


const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{
        type: String,
        required: [true, "tasks are required"]
    }]
}, {
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job Description is required"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String,
        required: true
    },
    overallScore: {
        type: Number
        , min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
}, {
    timestamps: true
});

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

export default interviewReportModel
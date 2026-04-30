import Groq from "groq-sdk";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import config from "../config/config.js";
import Rubric from "../models/rubricModel.js";

const groq = new Groq({
    apiKey: config.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
    overallScore: z.number().describe("A score between 0 to 100 indicating how well the candidate is prepared for the interview based on the analysis of the resume, self-describe, and job describe."),
    technicalQuestion: z.array(z.object({
        question: z.string().describe("The technical question can be asked during the interview."),
        intention: z.string().describe("The intention behind asking the question, what the interviewer wants to assess."),
        answer: z.string().describe("How to answer the question, what points to cover, what approach to take etc.")
    })).describe("Technical questions tailored to the job describe and resume to assess coding skills and domain expertise."),
    behavioralQuestion: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked during the interview."),
        intention: z.string().describe("The intention behind asking the question, what the interviewer wants to assess."),
        answer: z.string().describe("How to answer the question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions to assess soft skills, communication, teamwork, and cultural fit based on the candidate's background."),
    skillGap: z.array(z.object({
        skill: z.string().describe("The Skill which the candidate is lacking"),
        severity: z.enum(["High", "Medium", "Low"]).describe("The severity of the skill gap, indicating how critical it is for the job role.")
    })).describe("Identified skill gaps based on the candidate's resume and job describe, along with the severity to prioritize areas for improvement."),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, indicating the sequence of preparation."),
        focus: z.string().describe("The focus of the day, the main target etc."),
        tasks: z.array(z.string()).describe("The specific tasks to be completed on that day to prepare for the interview.")
    }).describe("A structured preparation plan outlining daily focus areas and tasks to help the candidate effectively prepare for the interview."))
})

async function getDynamicRubric(jobDescribe) {
    try {
        let category = 'Default';
        const jd = jobDescribe.toLowerCase();
        
        if (jd.includes('frontend') || jd.includes('react') || jd.includes('vue') || jd.includes('angular')) {
            category = 'Frontend Developer';
        } else if (jd.includes('backend') || jd.includes('node.js') || jd.includes('java') || jd.includes('python')) {
            category = 'Backend Developer';
        } else if (jd.includes('full-stack') || jd.includes('fullstack')) {
            category = 'Full-Stack Developer';
        }

        const rubric = await Rubric.findOne({ category });
        return rubric || await Rubric.findOne({ category: 'Default' });
    } catch (error) {
        console.error("Error fetching rubric:", error);
        return null;
    }
}

export async function generateInterviewReport({ resume, selfDescribe, jobDescribe }) {
    const jsonSchema = JSON.stringify(zodToJsonSchema(interviewReportSchema));
    const rubric = await getDynamicRubric(jobDescribe);

    const rubricPrompt = rubric ? `
    ### DYNAMIC SCORING RUBRIC (Market Standards):
    - Core Technical Match: ${rubric.weights.coreTechnical * 100}%
    - Experience & Seniority: ${rubric.weights.experience * 100}%
    - Preferred Skills: ${rubric.weights.preferredSkills * 100}%
    - Soft Skills: ${rubric.weights.softSkills * 100}%
    
    GOLD STANDARD KEYWORDS for this role: ${rubric.goldStandardKeywords.join(', ')}
    ` : `Use standard industry weights (Core: 40%, Exp: 30%, Preferred: 20%, Soft: 10%).`;
    
    const prompt = `You are a world-class Technical Recruiter. Your task is to generate a high-precision Interview Preparation Report.

    ${rubricPrompt}

    ANALYSIS PROCESS:
    1. Score the candidate against the rubric weights above.
    2. Compare candidate skills against the Gold Standard Keywords.
    3. Map every missing Gold Standard keyword or required skill to a 'skillGap'.
    4. Build a Dynamic Preparation Plan. Each identified skill gap MUST be assigned to a specific day of study. The plan length should be proportional to the number of gaps (usually 5-14 days).
    5. Create Contextual Questions: Every technical and behavioral question MUST be anchored to a specific project, company, or achievement mentioned in the Resume or Self-Description. 
       - BAD: "How do you optimize a database?"
       - GOOD: "At Tech Company Inc, you reduced SQL response time by 40%. Can you explain the specific indexing strategy you used to achieve this?"

    STRICT STRUCTURE RULES:
    - Return ONLY a JSON object.
    - Use ONLY the keys defined in the schema.
    - Arrays MUST contain objects, not strings.
    - The example below is for STRUCTURE ONLY.

    STRUCTURE EXAMPLE:
    {
      "overallScore": 85,
      "technicalQuestion": [ { "question": "...", "intention": "...", "answer": "..." } ],
      "behavioralQuestion": [ { "question": "...", "intention": "...", "answer": "..." } ],
      "skillGap": [ { "skill": "...", "severity": "High" } ],
      "preparationPlan": [ { "day": 1, "focus": "...", "tasks": ["task 1", "task 2"] } ]
    }

    SCHEMA:
    ${jsonSchema}

    INPUT DATA:
    Job Description: ${jobDescribe}
    Candidate's Resume: ${resume}
    Candidate's Self-Description: ${selfDescribe}

    Final Instruction: Be a critical evaluator. Do not inflate scores. Ensure the preparation plan is a direct roadmap to fix the identified gaps.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that outputs only valid JSON. You must follow the provided schema and rubric exactly."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.2,
        });

        const report = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
        console.log(report);
        return report;
    } catch (error) {
        console.error("Failed to generate interview report with Groq:", error);
        throw error;
    }
}

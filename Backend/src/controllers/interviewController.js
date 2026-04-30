import pdfParse from "pdf-parse";

export async function generateInterviewReport(req, res) {
    const resumeFile = req.file

    const resumeContent = pdfParse(req.file.buffer)
    const { selfDescribe, jobDescribe } = req.body

    


}
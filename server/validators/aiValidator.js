const { z } = require('zod');

exports.objectiveSchema = {
  body: z.object({
    resumeId: z.string().optional(),
    role: z.string().min(1, "Role is required"),
    experienceLevel: z.string().min(1, "Experience level is required"),
    userData: z.object({
      skills: z.array(z.string()).optional(),
      experience: z.string().optional()
    })
  })
};

exports.summarySchema = {
  body: z.object({
    resumeId: z.string().optional(),
    resumeData: z.object({
      title: z.string(),
      experience: z.array(z.any()).optional(),
      technicalSkills: z.array(z.string()).optional()
    })
  })
};

exports.experienceSchema = {
  body: z.object({
    resumeId: z.string().optional(),
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    description: z.string().min(10, "Provide at least 10 characters of description to enhance")
  })
};

exports.atsSchema = {
  body: z.object({
    resumeId: z.string().optional(),
    resumeText: z.string().min(50, "Resume text is too short"),
    jobDescription: z.string().min(20, "Job description is too short")
  })
};

exports.grammarSchema = {
  body: z.object({
    resumeId: z.string().optional(),
    text: z.string().min(5, "Text is too short")
  })
};

exports.coverLetterSchema = {
  body: z.object({
    resumeId: z.string().optional(),
    resumeData: z.any(),
    jobDescription: z.string().min(20),
    companyName: z.string().min(1)
  })
};

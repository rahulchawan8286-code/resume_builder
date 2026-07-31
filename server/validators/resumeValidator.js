const { z } = require('zod');

// We use partial validation for auto-save (users might save incomplete data)
const baseResumeSchema = {
  title: z.string().min(1, "Title is required").max(100).optional(),
  personalInfo: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    profilePhoto: z.string().optional()
  }).optional(),
  objective: z.string().max(1500).optional(),
  education: z.array(z.object({
    institution: z.string().min(1).optional().or(z.literal('')),
    degree: z.string().min(1).optional().or(z.literal('')),
    grade: z.string().optional(),
    startYear: z.string().optional(),
    endYear: z.string().optional(),
    location: z.string().optional()
  })).optional(),
  experience: z.array(z.object({
    company: z.string().min(1).optional().or(z.literal('')),
    title: z.string().min(1).optional().or(z.literal('')),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional()
  })).optional(),
  projects: z.array(z.object({
    name: z.string().min(1).optional().or(z.literal('')),
    liveUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    techStack: z.string().optional(),
    description: z.string().optional()
  })).optional(),
  certificates: z.array(z.object({
    name: z.string().optional(),
    issuer: z.string().optional(),
    issueDate: z.string().optional(),
    link: z.string().optional()
  })).optional(),
  technicalSkills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  languages: z.array(z.any()).optional(),
  theme: z.string().optional()
};

exports.createResumeSchema = {
  body: z.object({
    title: z.string().min(1, "Title is required").max(100)
  })
};

exports.updateResumeSchema = {
  body: z.object(baseResumeSchema).partial()
};

exports.restoreVersionSchema = {
  body: z.object({
    versionNumber: z.number().positive()
  })
};

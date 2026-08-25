/**
 * Centralized Prompt Management
 * Prevents hardcoding prompts inside services or controllers.
 */

exports.generateObjective = (userData, role, experienceLevel) => `
You are an expert Resume Writer. Generate 3 highly professional, impactful career objectives for a ${experienceLevel} ${role}.
Use the following context if available:
Skills: ${userData.skills?.join(', ') || 'N/A'}
Experience: ${userData.experience || 'N/A'}

Return the response as a clean JSON array of strings:
["Objective 1", "Objective 2", "Objective 3"]
`;

exports.generateSummary = (resumeData) => `
You are an expert Resume Writer. Write a 3-4 sentence professional summary based on this data:
Role: ${resumeData.title}
Experience: ${JSON.stringify(resumeData.experience)}
Skills: ${resumeData.technicalSkills?.join(', ')}

Make it sound highly professional and ATS-friendly. Return only the summary text.
`;

exports.enhanceExperience = (company, role, description) => `
You are an expert Resume Writer. Enhance the following work experience description to be more impactful, using action verbs and quantifiable achievements where possible. 
Company: ${company}
Role: ${role}
Original Description: ${description}

Provide the enhanced description as a bulleted list (using markdown).
`;

exports.analyzeAts = (resumeText, jobDescription) => `
You are an advanced ATS (Applicant Tracking System). Analyze the following resume against the job description.
Resume:
${resumeText}

Job Description:
${jobDescription}

Provide the response in the following JSON format:
{
  "score": (0-100),
  "missingKeywords": ["keyword1", "keyword2"],
  "matchingKeywords": ["keyword1", "keyword2"],
  "improvements": ["suggestion1", "suggestion2"]
}
`;

exports.grammarCheck = (text) => `
Act as a professional copy editor. Fix any grammar, spelling, or phrasing issues in the following text to make it suitable for a high-end executive resume.
Original Text: ${text}

Return only the corrected text.
`;

exports.generateCoverLetter = (resumeData, jobDescription, companyName) => `
You are an expert Career Coach. Write a tailored, persuasive cover letter based on the following resume and job description.
Company: ${companyName}
Job Description: ${jobDescription}
Candidate Resume Context: ${JSON.stringify(resumeData)}

Return only the Cover Letter text, properly formatted.
`;


export default function ResumePreview({ data }) {
  if (!data || !data.personalInfo) return null;

  const { personalInfo, summary, education, experience, projects, skills } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[15mm] text-gray-900 mx-auto print:shadow-none print:p-0 print:w-full">
      <header className="border-b-2 border-gray-800 pb-4 mb-4 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm mt-2 text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
          {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
        </div>
      </header>

      {summary && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Professional Summary</h2>
          <p className="text-[12px] text-gray-800 leading-relaxed">{summary}</p>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2 mt-2">
              <div className="flex justify-between font-bold text-[13px]">
                <span>{edu.institution}</span>
                <span>{edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}</span>
              </div>
              <div className="flex justify-between text-[12px] text-gray-800">
                <span>{edu.degree} {edu.branch && `in ${edu.branch}`}</span>
                {edu.score && <span>Score: {edu.score}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Skills</h2>
          <div className="mt-2 text-[12px] text-gray-800 space-y-1">
            {skills.technical?.length > 0 && (
              <div><span className="font-bold w-24 inline-block">Technical:</span> <span>{skills.technical.join(', ')}</span></div>
            )}
            {skills.tools?.length > 0 && (
              <div><span className="font-bold w-24 inline-block">Tools:</span> <span>{skills.tools.join(', ')}</span></div>
            )}
            {skills.soft?.length > 0 && (
              <div><span className="font-bold w-24 inline-block">Soft Skills:</span> <span>{skills.soft.join(', ')}</span></div>
            )}
          </div>
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-3 mt-2">
              <div className="flex justify-between font-bold text-[13px]">
                <span>{exp.position}</span>
                <span>{exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}</span>
              </div>
              <div className="text-[13px] font-medium text-gray-800 mb-1">{exp.company}</div>
              <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} className="mb-3 mt-2">
              <div className="flex justify-between font-bold text-[13px]">
                <span>{proj.title} {proj.link && <a href={proj.link} className="font-normal text-blue-600 text-[11px] ml-1">(Link)</a>}</span>
                <span className="font-normal text-gray-600">{proj.duration}</span>
              </div>
              {proj.technologies && <div className="text-[11px] text-gray-600 mb-1"><strong>Technologies:</strong> {proj.technologies}</div>}
              <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
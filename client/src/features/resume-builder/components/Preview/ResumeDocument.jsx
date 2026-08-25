import React from 'react';
import { useResumeStore } from '../../store/resumeStore';

// ── Shared inline styles for A4 print fidelity ──────────────────────────────
const PAGE_STYLE = {
  width: '210mm',
  minHeight: '297mm',
  backgroundColor: '#ffffff',
  color: '#1a1a1a',
  fontFamily: 'Inter, sans-serif',
  fontSize: '11pt',
  lineHeight: 1.5,
  boxShadow: '0 4px 40px rgba(0,0,0,0.12)',
  padding: '14mm 16mm',
  boxSizing: 'border-box',
};

// ─── Helper components ───────────────────────────────────────────────────────
function SectionTitle({ children, color }) {
  return (
    <div style={{ borderBottom: `2px solid ${color}`, marginBottom: 8, paddingBottom: 3, marginTop: 18 }}>
      <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color }}>{children}</h2>
    </div>
  );
}

function SkillChip({ label, color }) {
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, backgroundColor: `${color}18`, color, fontSize: '9pt', marginRight: 6, marginBottom: 5, fontWeight: 500 }}>
      {label}
    </span>
  );
}

// ─── Main document ───────────────────────────────────────────────────────────
const ResumeDocument = React.memo(function ResumeDocument() {
  const { resumeData, theme } = useResumeStore();
  const { personalInfo, objective, education, experience, projects, skills, certifications } = resumeData;
  const { primaryColor } = theme;

  const fullName = [personalInfo?.firstName, personalInfo?.lastName].filter(Boolean).join(' ') || 'Your Name';

  return (
    <div style={PAGE_STYLE}>
      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        {personalInfo.profilePhoto && (
          <img src={personalInfo.profilePhoto} alt="Profile" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px', display: 'block', border: `3px solid ${primaryColor}` }} />
        )}
        <h1 style={{ fontSize: '22pt', fontWeight: 800, color: primaryColor, margin: 0 }}>{fullName}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', marginTop: 6, fontSize: '9pt', color: '#555' }}>
          {personalInfo?.email    && <span>✉ {personalInfo.email}</span>}
          {personalInfo?.phone    && <span>📞 {personalInfo.phone}</span>}
          {personalInfo?.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo?.github   && <span>⭐ {personalInfo.github}</span>}
          {personalInfo?.website  && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      {/* ── Objective ── */}
      {objective && (
        <>
          <SectionTitle color={primaryColor}>Career Objective</SectionTitle>
          <p style={{ fontSize: '10pt', color: '#333', margin: 0 }}>{objective}</p>
        </>
      )}

      {/* ── Education ── */}
      {education.length > 0 && (
        <>
          <SectionTitle color={primaryColor}>Education</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id || edu._id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '10pt' }}>{edu.degree ?? ""}</strong>
                <span style={{ fontSize: '9pt', color: '#666' }}>{edu.startYear ?? ""}{edu.endYear ? ` – ${edu.endYear}` : ''}</span>
              </div>
              <div style={{ fontSize: '9pt', color: '#444' }}>{edu.institution ?? ""}{edu.location ? ` · ${edu.location}` : ''}</div>
              {edu.grade && <div style={{ fontSize: '9pt', color: '#666' }}>CGPA / %: {edu.grade}</div>}
            </div>
          ))}
        </>
      )}

      {/* ── Experience ── */}
      {experience.length > 0 && (
        <>
          <SectionTitle color={primaryColor}>Work Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id || exp._id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '10pt' }}>{exp.title ?? ""}</strong>
                <span style={{ fontSize: '9pt', color: '#666' }}>{exp.startDate ?? ""}{exp.current ? ' – Present' : (exp.endDate ? ` – ${exp.endDate}` : '')}</span>
              </div>
              <div style={{ fontSize: '9pt', color: '#444', marginBottom: 4 }}>{exp.company ?? ""}{exp.location ? ` · ${exp.location}` : ''}</div>
              {exp.description && (
                <div style={{ fontSize: '9.5pt', color: '#333', whiteSpace: 'pre-line' }}>{exp.description}</div>
              )}
            </div>
          ))}
        </>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <>
          <SectionTitle color={primaryColor}>Projects</SectionTitle>
          {projects.map((proj) => (
            <div key={proj.id || proj._id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '10pt' }}>{proj.name ?? ""}</strong>
                <div style={{ fontSize: '9pt', color: primaryColor }}>
                  {proj.githubUrl && <span style={{ marginRight: 8 }}>GitHub</span>}
                  {proj.liveUrl  && <span>Live</span>}
                </div>
              </div>
              {proj.techStack && <div style={{ fontSize: '9pt', color: '#555', fontStyle: 'italic', marginBottom: 3 }}>{proj.techStack}</div>}
              {proj.description && <div style={{ fontSize: '9.5pt', color: '#333', whiteSpace: 'pre-line' }}>{proj.description}</div>}
            </div>
          ))}
        </>
      )}

      {/* ── Skills ── */}
      {((skills?.technical?.length > 0) || (skills?.soft?.length > 0)) && (
        <>
          <SectionTitle color={primaryColor}>Skills</SectionTitle>
          {skills?.technical?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '9pt', fontWeight: 600, color: '#555', marginBottom: 4 }}>Technical</div>
              <div>{skills.technical.map((t) => <SkillChip key={t} label={t} color={primaryColor} />)}</div>
            </div>
          )}
          {skills?.soft?.length > 0 && (
            <div>
              <div style={{ fontSize: '9pt', fontWeight: 600, color: '#555', marginBottom: 4 }}>Soft Skills</div>
              <div>{skills.soft.map((t) => <SkillChip key={t} label={t} color={primaryColor} />)}</div>
            </div>
          )}
        </>
      )}

      {/* ── Certifications ── */}
      {certifications.length > 0 && (
        <>
          <SectionTitle color={primaryColor}>Certifications</SectionTitle>
          {certifications.map((cert) => (
            <div key={cert.id || cert._id} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '10pt' }}>{cert.name ?? ""}</strong>
                <span style={{ fontSize: '9pt', color: '#666' }}>{cert.issueDate ?? ""}</span>
              </div>
              <div style={{ fontSize: '9pt', color: '#444' }}>{cert.issuer || ''}</div>
              {cert.link && <div style={{ fontSize: '9pt', color: '#444' }}>{cert.link}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
});

export default ResumeDocument;

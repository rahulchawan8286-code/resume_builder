/**
 * Centralized HTML Template Builder for PDF generation.
 *
 * Why Puppeteer over alternatives:
 * - PDFKit: Programmatic/code-based layout — very hard to build rich visual designs.
 * - jsPDF: Client-side only, not suitable for server-side SaaS.
 * - Puppeteer: Renders real HTML+CSS to PDF — identical look to the browser preview.
 *   This means our PDF output is ALWAYS in sync with the frontend template.
 *   Supports fonts (Google Fonts), colors, flexbox, images, QR codes, and all CSS.
 *   Produces text-selectable PDFs that pass ATS systems correctly.
 */

/**
 * Injects resume data into the modern template HTML string.
 * @param {Object} resume - Full resume document from MongoDB
 * @returns {string} - Complete HTML string ready for Puppeteer
 */
const buildModernTemplate = (resume) => {
  const design = resume.design || {};
  const primaryColor = design.primaryColor || '#4F46E5';
  const fontFamily = design.fonts?.body || 'Inter';
  const headingFont = design.fonts?.heading || 'Inter';

  const renderList = (items = [], renderer) =>
    items.length > 0 ? items.map(renderer).join('') : '<p style="color:#aaa;">—</p>';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${resume.title || 'Resume'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, '+')}&family=${fontFamily.replace(/ /g, '+')}&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: '${fontFamily}', Arial, sans-serif;
      color: #1a1a1a;
      font-size: 11pt;
      line-height: 1.5;
      background: white;
      padding: 0;
    }
    .page-wrapper {
      max-width: 210mm;
      margin: 0 auto;
      padding: ${design.margins === 'narrow' ? '12mm' : '18mm'} ${design.margins === 'narrow' ? '15mm' : '20mm'};
    }
    /* Header */
    .header { display: flex; align-items: center; gap: 20px; border-bottom: 3px solid ${primaryColor}; padding-bottom: 16px; margin-bottom: 20px; }
    .photo { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid ${primaryColor}; flex-shrink: 0; }
    .header-info h1 { font-family: '${headingFont}', sans-serif; font-size: 22pt; color: ${primaryColor}; letter-spacing: -0.5px; }
    .header-info .job-title { font-size: 12pt; color: #555; margin-top: 2px; }
    .header-contacts { margin-top: 6px; font-size: 9.5pt; color: #444; display: flex; flex-wrap: wrap; gap: 10px; }
    .header-contacts span { display: flex; align-items: center; gap: 4px; }
    /* Section */
    .section { margin-bottom: 18px; }
    .section-title {
      font-family: '${headingFont}', sans-serif;
      font-size: 11pt; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1.5px; color: ${primaryColor};
      border-bottom: 1.5px solid ${primaryColor}20;
      padding-bottom: 4px; margin-bottom: 10px;
    }
    /* Experience / Education */
    .item { margin-bottom: 12px; }
    .item-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .item-title { font-weight: 600; font-size: 11pt; }
    .item-subtitle { font-size: 10pt; color: #555; }
    .item-date { font-size: 9.5pt; color: #666; white-space: nowrap; margin-left: 8px; }
    .item-desc { font-size: 10pt; color: #333; margin-top: 4px; }
    /* Skills */
    .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag {
      background: ${primaryColor}15; color: ${primaryColor};
      border: 1px solid ${primaryColor}30;
      padding: 3px 10px; border-radius: 20px; font-size: 9.5pt; font-weight: 500;
    }
    /* Two column layout for skills + languages */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    /* QR Code */
    .qr-wrap { text-align: right; }
    .qr-wrap img { width: 60px; height: 60px; }
    /* Page number */
    @media print {
      .page-wrapper { padding: ${design.margins === 'narrow' ? '12mm' : '18mm'} ${design.margins === 'narrow' ? '15mm' : '20mm'}; }
    }
  </style>
</head>
<body>
<div class="page-wrapper">

  <!-- HEADER -->
  <div class="header">
    ${resume.personalInfo?.profilePhoto
      ? `<img class="photo" src="${resume.personalInfo.profilePhoto}" alt="Profile Photo" />`
      : ''}
    <div class="header-info" style="flex:1;">
      <h1>${resume.personalInfo?.firstName || ''} ${resume.personalInfo?.lastName || ''}</h1>
      <div class="header-contacts">
        ${resume.personalInfo?.email ? `<span>✉ ${resume.personalInfo.email}</span>` : ''}
        ${resume.personalInfo?.phone ? `<span>📞 ${resume.personalInfo.phone}</span>` : ''}
        ${resume.personalInfo?.location ? `<span>📍 ${resume.personalInfo.location}</span>` : ''}
        ${resume.personalInfo?.website ? `<span>🌐 ${resume.personalInfo.website}</span>` : ''}
        ${resume.personalInfo?.linkedin ? `<span>🔗 ${resume.personalInfo.linkedin}</span>` : ''}
        ${resume.personalInfo?.github ? `<span>⌨ ${resume.personalInfo.github}</span>` : ''}
      </div>
    </div>
    ${resume.qrCode ? `<div class="qr-wrap"><img src="${resume.qrCode}" alt="QR Code"/></div>` : ''}
  </div>

  <!-- SUMMARY -->
  ${resume.objective ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="item-desc">${resume.objective}</p>
  </div>` : ''}

  <!-- EXPERIENCE -->
  ${resume.experience?.length ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${renderList(resume.experience, exp => `
      <div class="item">
        <div class="item-header">
          <div>
            <div class="item-title">${exp.title ?? ""}</div>
            <div class="item-subtitle">${exp.company ?? ""}</div>
          </div>
          <div class="item-date">
            ${exp.startDate ?? ""}
            ${exp.current ? ' – Present' : (exp.endDate ? ` – ${exp.endDate}` : '')}
          </div>
        </div>
        ${exp.location ? `<div class="item-subtitle" style="margin-top:2px; font-size:9pt; color:#666;">${exp.location}</div>` : ''}
        ${exp.description ? `<div class="item-desc">${exp.description}</div>` : ''}
      </div>`)}
  </div>` : ''}

  <!-- EDUCATION -->
  ${resume.education?.length ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${renderList(resume.education, edu => `
      <div class="item">
        <div class="item-header">
          <div>
            <div class="item-title">${edu.institution ?? ""}</div>
            <div class="item-subtitle">${edu.degree ?? ""}${edu.grade ? ` — ${edu.grade}` : ''}</div>
          </div>
          <div class="item-date">
            ${edu.startYear ?? ""}
            ${edu.endYear ? ` – ${edu.endYear}` : ''}
          </div>
        </div>
        ${edu.location ? `<div class="item-subtitle" style="margin-top:2px; font-size:9pt; color:#666;">${edu.location}</div>` : ''}
      </div>`)}
  </div>` : ''}

  <!-- PROJECTS -->
  ${resume.projects?.length ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${renderList(resume.projects, proj => `
      <div class="item">
        <div class="item-header">
          <div class="item-title">${proj.name ?? ""} ${proj.liveUrl ? `<span style="font-weight:400;font-size:9.5pt;color:#666;">— ${proj.liveUrl}</span>` : ''}</div>
        </div>
        ${proj.techStack ? `<div class="item-subtitle" style="margin-top:2px;">🛠 ${proj.techStack}</div>` : ''}
        ${proj.githubUrl ? `<div class="item-subtitle" style="margin-top:2px;">⌨ ${proj.githubUrl}</div>` : ''}
        ${proj.description ? `<div class="item-desc">${proj.description}</div>` : ''}
      </div>`)}
  </div>` : ''}

  <!-- SKILLS -->
  <div class="two-col">
    ${resume.technicalSkills?.length ? `
    <div class="section">
      <div class="section-title">Technical Skills</div>
      <div class="skills-grid">
        ${resume.technicalSkills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </div>` : ''}
    ${resume.softSkills?.length ? `
    <div class="section">
      <div class="section-title">Soft Skills</div>
      <div class="skills-grid">
        ${resume.softSkills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </div>` : ''}
  </div>

  <!-- CERTIFICATES -->
  ${resume.certificates?.length ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${renderList(resume.certificates, cert => `
      <div class="item">
        <div class="item-header">
          <div class="item-title">${cert.name ?? ""}</div>
          <div class="item-date">${cert.issueDate ?? ""}</div>
        </div>
        <div class="item-subtitle">${cert.issuer || ''}</div>
        ${cert.link ? `<div class="item-subtitle" style="margin-top:2px; font-size:9pt; color:#666;">${cert.link}</div>` : ''}
      </div>`)}
  </div>` : ''}

  <!-- ACHIEVEMENTS -->
  ${resume.achievements?.length ? `
  <div class="section">
    <div class="section-title">Achievements</div>
    <ul style="padding-left:18px;">
      ${resume.achievements.map(a => `<li class="item-desc">${a}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- LANGUAGES -->
  ${resume.languages?.length ? `
  <div class="section">
    <div class="section-title">Languages</div>
    <div class="skills-grid">
      ${resume.languages.map(l => `<span class="skill-tag">${l.language} (${l.proficiency})</span>`).join('')}
    </div>
  </div>` : ''}

  <!-- CUSTOM SECTIONS -->
  ${(resume.customSections || []).map(sec => `
  <div class="section">
    <div class="section-title">${sec.title}</div>
    <p class="item-desc">${sec.content}</p>
  </div>`).join('')}

</div>
</body>
</html>`;
};

/**
 * Classic minimal template — ATS-optimized, purely text-based.
 */
const buildClassicTemplate = (resume) => {
  const design = resume.design || {};
  const primaryColor = design.primaryColor || '#1a1a1a';

  const renderList = (items = [], renderer) =>
    items.length > 0 ? items.map(renderer).join('') : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${resume.title || 'Resume'}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Times New Roman', serif; color: #111; font-size: 11pt; line-height: 1.45; background: white; padding: 18mm 22mm; }
    h1 { font-size: 20pt; text-align: center; color: ${primaryColor}; }
    .contact-line { text-align: center; font-size: 10pt; color: #333; margin-top: 4px; margin-bottom: 16px; }
    .section-title { font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 14px 0 8px 0; }
    .item { margin-bottom: 10px; }
    .item-header { display: flex; justify-content: space-between; }
    .item-title { font-weight: bold; }
    .item-date { font-size: 10pt; }
    .item-desc { font-size: 10pt; margin-top: 3px; }
    ul { padding-left: 20px; }
    li { font-size: 10pt; margin-bottom: 2px; }
  </style>
</head>
<body>

  <h1>${resume.personalInfo?.firstName || ''} ${resume.personalInfo?.lastName || ''}</h1>
  <div class="contact-line">
    ${[resume.personalInfo?.email, resume.personalInfo?.phone, resume.personalInfo?.linkedin, resume.personalInfo?.github].filter(Boolean).join(' | ')}
  </div>

  ${resume.objective ? `<div class="section-title">Objective</div><p class="item-desc">${resume.objective}</p>` : ''}

  ${resume.education?.length ? `
  <div class="section-title">Education</div>
  ${renderList(resume.education, edu => `
    <div class="item">
      <div class="item-header">
        <div class="item-title">${edu.institution ?? ""}</div>
        <div class="item-date">${edu.endYear ?? ""}</div>
      </div>
      <div class="item-desc">${edu.degree ?? ""}${edu.grade ? ` | ${edu.grade}` : ''}</div>
    </div>`)}` : ''}

  ${resume.experience?.length ? `
  <div class="section-title">Experience</div>
  ${renderList(resume.experience, exp => `
    <div class="item">
      <div class="item-header">
        <div class="item-title">${exp.title ?? ""} — ${exp.company ?? ""}</div>
        <div class="item-date">${exp.startDate ?? ""} – ${exp.current ? 'Present' : (exp.endDate ?? "")}</div>
      </div>
      ${exp.description ? `<div class="item-desc">${exp.description}</div>` : ''}
    </div>`)}` : ''}

  ${resume.projects?.length ? `
  <div class="section-title">Projects</div>
  ${renderList(resume.projects, proj => `
    <div class="item">
      <div class="item-title">${proj.name ?? ""}</div>
      ${proj.techStack ? `<div class="item-desc">Technologies: ${proj.techStack}</div>` : ''}
      ${proj.description ? `<div class="item-desc">${proj.description}</div>` : ''}
    </div>`)}` : ''}

  ${resume.technicalSkills?.length ? `
  <div class="section-title">Skills</div>
  <p class="item-desc">${[...(resume.technicalSkills || []), ...(resume.softSkills || [])].join(', ')}</p>` : ''}

  ${resume.achievements?.length ? `
  <div class="section-title">Achievements</div>
  <ul>${resume.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}

</body>
</html>`;
};

/**
 * Factory: returns the correct template builder function.
 */
const getTemplate = (templateName = 'modern') => {
  switch (templateName.toLowerCase()) {
    case 'classic':  return buildClassicTemplate;
    case 'modern':
    default:         return buildModernTemplate;
  }
};

module.exports = { getTemplate };

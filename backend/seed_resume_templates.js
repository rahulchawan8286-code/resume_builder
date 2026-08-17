require('dotenv').config();
const mongoose = require('mongoose');
const ResumeTemplate = require('./src/models/ResumeTemplate');

const templates = [
  {
    name: 'Modern Professional',
    description: 'A clean, ATS-friendly template optimized for readability and professional appeal.',
    previewUrl: 'https://via.placeholder.com/150x200?text=Modern+Professional',
    htmlContent: `
      <div class="resume-template-modern bg-white text-gray-900 p-8 max-w-4xl mx-auto h-[1056px] w-[816px] shadow-sm box-border overflow-hidden" style="font-family: 'Inter', sans-serif;">
        <!-- Header -->
        <header class="border-b-2 border-gray-800 pb-4 mb-4">
          <h1 class="text-3xl font-bold uppercase tracking-wider">{{personalInfo.fullName}}</h1>
          <div class="flex flex-wrap gap-3 text-sm mt-2 text-gray-600">
            {{#if personalInfo.email}}<span>{{personalInfo.email}}</span>{{/if}}
            {{#if personalInfo.phone}}<span>• {{personalInfo.phone}}</span>{{/if}}
            {{#if personalInfo.location}}<span>• {{personalInfo.location}}</span>{{/if}}
            {{#if personalInfo.linkedin}}<span>• <a href="{{personalInfo.linkedin}}" class="text-indigo-600">LinkedIn</a></span>{{/if}}
            {{#if personalInfo.github}}<span>• <a href="{{personalInfo.github}}" class="text-indigo-600">GitHub</a></span>{{/if}}
            {{#if personalInfo.portfolio}}<span>• <a href="{{personalInfo.portfolio}}" class="text-indigo-600">Portfolio</a></span>{{/if}}
          </div>
        </header>

        <!-- Summary -->
        {{#if summary}}
        <section class="mb-4">
          <h2 class="text-lg font-bold uppercase tracking-widest text-gray-800 mb-1">Professional Summary</h2>
          <p class="text-sm text-gray-700 leading-relaxed">{{summary}}</p>
        </section>
        {{/if}}

        <!-- Education -->
        {{#if education.length}}
        <section class="mb-4">
          <h2 class="text-lg font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Education</h2>
          {{#each education}}
          <div class="mb-2 mt-2">
            <div class="flex justify-between font-bold text-sm">
              <span>{{this.institution}}</span>
              <span>{{this.startDate}} - {{this.endDate}}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-700">
              <span>{{this.degree}} {{#if this.branch}}in {{this.branch}}{{/if}}</span>
              {{#if this.score}}<span>Score: {{this.score}}</span>{{/if}}
            </div>
          </div>
          {{/each}}
        </section>
        {{/if}}

        <!-- Experience -->
        {{#if experience.length}}
        <section class="mb-4">
          <h2 class="text-lg font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Experience</h2>
          {{#each experience}}
          <div class="mb-3 mt-2">
            <div class="flex justify-between font-bold text-sm">
              <span>{{this.position}}</span>
              <span>{{this.startDate}} - {{this.endDate}}</span>
            </div>
            <div class="text-sm font-medium text-gray-700 mb-1">{{this.company}}</div>
            <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{{this.description}}</p>
          </div>
          {{/each}}
        </section>
        {{/if}}

        <!-- Projects -->
        {{#if projects.length}}
        <section class="mb-4">
          <h2 class="text-lg font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Projects</h2>
          {{#each projects}}
          <div class="mb-3 mt-2">
            <div class="flex justify-between font-bold text-sm">
              <span>{{this.title}} {{#if this.link}}<a href="{{this.link}}" class="font-normal text-indigo-600 text-xs ml-2">(Link)</a>{{/if}}</span>
              <span class="font-normal text-gray-600">{{this.duration}}</span>
            </div>
            <div class="text-xs text-gray-600 mb-1"><strong>Technologies:</strong> {{this.technologies}}</div>
            <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{{this.description}}</p>
          </div>
          {{/each}}
        </section>
        {{/if}}

        <!-- Skills -->
        <section class="mb-4">
          <h2 class="text-lg font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Skills</h2>
          <div class="mt-2 text-sm">
            {{#if skills.technical.length}}
            <div class="mb-1"><span class="font-bold w-24 inline-block">Technical:</span> <span class="text-gray-700">{{join skills.technical ", "}}</span></div>
            {{/if}}
            {{#if skills.tools.length}}
            <div class="mb-1"><span class="font-bold w-24 inline-block">Tools:</span> <span class="text-gray-700">{{join skills.tools ", "}}</span></div>
            {{/if}}
            {{#if skills.soft.length}}
            <div><span class="font-bold w-24 inline-block">Soft Skills:</span> <span class="text-gray-700">{{join skills.soft ", "}}</span></div>
            {{/if}}
          </div>
        </section>

        <!-- Certifications & Achievements -->
        <div class="flex gap-4">
          {{#if certifications.length}}
          <section class="flex-1 mb-4">
            <h2 class="text-lg font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Certifications</h2>
            <ul class="list-disc pl-4 mt-2 text-sm text-gray-700 space-y-1">
              {{#each certifications}}
              <li><strong>{{this.name}}</strong> - {{this.issuer}} ({{this.date}})</li>
              {{/each}}
            </ul>
          </section>
          {{/if}}

          {{#if achievements.length}}
          <section class="flex-1 mb-4">
            <h2 class="text-lg font-bold uppercase tracking-widest text-gray-800 mb-1 border-b border-gray-300 pb-1">Achievements</h2>
            <ul class="list-disc pl-4 mt-2 text-sm text-gray-700 space-y-1">
              {{#each achievements}}
              <li>{{this}}</li>
              {{/each}}
            </ul>
          </section>
          {{/if}}
        </div>

      </div>
    `,
    isActive: true
  }
];

async function seedDatabase() {
  let created = 0;
  let skipped = 0;

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ece_career_compass';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB for resume template seeding.');

    for (const template of templates) {
      const exists = await ResumeTemplate.findOne({ name: template.name });
      if (!exists) {
        await ResumeTemplate.create(template);
        created++;
        console.log(`Created template: ${template.name}`);
      } else {
        skipped++;
        console.log(`Skipped existing template: ${template.name}`);
      }
    }

    console.log(`\nSeed Summary:`);
    console.log(`- Templates created: ${created}`);
    console.log(`- Templates skipped (already exist): ${skipped}`);
    console.log('Done.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedDatabase();

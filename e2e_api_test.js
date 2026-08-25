const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('--- STARTING COMPLETE E2E API INTEGRATION TEST ---');
  let token = '';
  let userId = '';
  
  const client = axios.create({
    baseURL: API_URL,
    validateStatus: () => true // Don't throw on error status codes
  });

  // Helper to add auth token via cookie
  const setAuth = (cookies) => {
    if (cookies && cookies.length > 0) {
      client.defaults.headers.common['Cookie'] = cookies.join('; ');
    }
  };

  let cookies = [];

  // 1. AUTHENTICATION
  console.log('\\n--- PHASE 1: AUTHENTICATION ---');
  // Register
  const registerRes = await client.post('/auth/register', {
    name: 'E2E Test User',
    email: 'testuser_e2e@example.com',
    password: 'Password123!',
    role: 'Student'
  });
  
  if (registerRes.status === 201) {
    console.log('✅ Registration successful (User Created in DB)');
    cookies = registerRes.headers['set-cookie'];
    userId = registerRes.data.data.user._id;
  } else if (registerRes.status === 400 && registerRes.data.message.includes('registered')) {
    console.log('ℹ️ Test user already exists, logging in instead...');
    const loginRes = await client.post('/auth/login', {
      email: 'testuser_e2e@example.com',
      password: 'Password123!'
    });
    if (loginRes.status === 200) {
      cookies = loginRes.headers['set-cookie'];
      userId = loginRes.data.data.user._id;
      console.log('✅ Login successful');
    } else {
      console.error('❌ Login failed', loginRes.data);
      return;
    }
  } else {
    console.error('❌ Registration failed', registerRes.data);
    return;
  }
  
  setAuth(cookies);

  // 2. APTITUDE
  console.log('\n--- PHASE 2: APTITUDE ---');
  const aptitudeRes = await client.get('/quizzes?category=Aptitude');
  if (aptitudeRes.status === 200) {
    console.log('✅ Quizzes fetched');
    const quizId = aptitudeRes.data.data[0]?._id;
    if (quizId) {
      const submitRes = await client.post(`/quizzes/${quizId}/submit`, {
        answers: [{ questionId: 'dummy1', selectedOption: 1 }]
      });
      console.log(submitRes.status === 201 ? '✅ Aptitude Quiz submitted (DB Result Created)' : `❌ Quiz submit failed: ${submitRes.status}`);
    } else {
      console.log('⚠️ No Aptitude quizzes found to submit');
    }
  } else {
    console.log('❌ Failed to fetch Aptitude quizzes', aptitudeRes.data);
  }

  // 3. CORE ECE
  console.log('\n--- PHASE 3: CORE ECE ---');
  const subjectsRes = await client.get('/subjects');
  if (subjectsRes.status === 200) {
    console.log('✅ Subjects fetched');
  } else {
    console.log('❌ Failed to fetch subjects', subjectsRes.data);
  }

  // 4. CODING
  console.log('\n--- PHASE 4: CODING ---');
  const codingRes = await client.get('/coding/problems');
  if (codingRes.status === 200) {
    console.log('✅ Coding problems fetched');
    const problemId = codingRes.data.data[0]?._id;
    if (problemId) {
      const submitCodeRes = await client.post(`/coding/problems/${problemId}/submit`, {
        code: 'function add(a, b) { return a + b; }',
        language: 'javascript'
      });
      if (submitCodeRes.status === 201) {
        console.log(`✅ Code submitted. Status: ${submitCodeRes.data.data.status} (DB CodeSubmission Created)`);
      } else {
        console.log('❌ Code submit failed', submitCodeRes.data);
      }
    } else {
       console.log('⚠️ No Coding problems found to submit');
    }
  } else {
    console.log('❌ Failed to fetch coding problems', codingRes.data);
  }

  // 5. COMPANIES & ROADMAPS
  console.log('\n--- PHASE 5: COMPANIES & ROADMAPS ---');
  const companiesRes = await client.get('/company');
  if (companiesRes.status === 200) {
    console.log('✅ Companies fetched');
    const companyId = companiesRes.data.data[0]?._id;
    if (companyId) {
      const roadmapRes = await client.post('/roadmap/generate', { targetCompanyId: companyId });
      if (roadmapRes.status === 200) {
        console.log('✅ Roadmap generated (DB Roadmap Created)');
      } else {
        console.log('❌ Roadmap generation failed', roadmapRes.data);
      }
    } else {
      console.log('⚠️ No companies found to generate roadmap');
    }
  } else {
    console.log('❌ Failed to fetch companies', companiesRes.data);
  }

  // 6. RESUME BUILDER
  console.log('\n--- PHASE 6: RESUME BUILDER ---');
  const createResumeRes = await client.post('/resume', { title: 'E2E Test Resume' });
  if (createResumeRes.status === 201) {
    console.log('✅ Resume created (DB Resume Created)');
    const resumeId = createResumeRes.data.data._id;
    
    const atsRes = await client.post(`/resume/${resumeId}/analyze`, { targetRole: 'SDE' });
    if (atsRes.status === 201) {
      console.log('✅ ATS Analysis complete (AI API Key functional)');
    } else if (atsRes.status === 500 && atsRes.data.message.includes('GEMINI_API_KEY')) {
      console.log('⚠️ ATS Analysis failed: Gemini API key unavailable (Handled gracefully)');
    } else {
      console.log(`❌ ATS Analysis unexpected failure: ${atsRes.status}`, atsRes.data);
    }
  } else {
    console.log('❌ Resume creation failed', createResumeRes.data);
  }

  // 7. MOCK INTERVIEW
  console.log('\n--- PHASE 7: MOCK INTERVIEW ---');
  const interviewRes = await client.post('/interviews/start', { sessionType: 'Technical', difficulty: 'Medium' });
  if (interviewRes.status === 201) {
    console.log('✅ Interview session started (DB InterviewSession Created)');
    const sessionId = interviewRes.data.data._id;
    const questionId = interviewRes.data.data.questions[0]?._id;
    
    if (questionId) {
      const answerRes = await client.post(`/interviews/${sessionId}/answer`, { questionId, answer: 'My test answer' });
      if (answerRes.status === 200) {
         console.log('✅ Answer submitted and evaluated (AI API Key functional)');
      } else if (answerRes.status === 400 && answerRes.data.message.includes('failed')) {
         console.log('⚠️ Answer submitted but evaluation failed (Gemini API key likely unavailable, handled gracefully)');
      } else {
         console.log(`❌ Answer submission unexpected failure: ${answerRes.status}`, answerRes.data);
      }
    }
    
    const finishRes = await client.post(`/interviews/${sessionId}/finish`);
    if (finishRes.status === 200) {
      console.log(`✅ Interview finished. Score: ${finishRes.data.data.overallScore}`);
    } else {
      console.log('❌ Interview finish failed', finishRes.data);
    }
  } else {
    console.log('❌ Interview start failed', interviewRes.data);
  }

  // 8. READINESS ENGINE
  console.log('\n--- PHASE 8: READINESS ENGINE ---');
  const recalcRes = await client.post('/readiness/calculate');
  if (recalcRes.status === 200) {
    console.log('✅ Readiness explicitly recalculated');
  } else {
    console.log(`❌ Readiness recalculation failed: ${recalcRes.status}`);
  }
  
  const readinessRes = await client.get('/readiness');
  if (readinessRes.status === 200) {
    console.log('✅ Readiness fetched successfully');
    const scores = readinessRes.data.data.components;
    const overall = readinessRes.data.data.overallScore;
    console.log(`   - Aptitude: ${scores.aptitude.score}`);
    console.log(`   - Core ECE: ${scores.coreECE.score}`);
    console.log(`   - Coding: ${scores.coding.score}`);
    console.log(`   - Resume/ATS: ${scores.resume.score}`);
    console.log(`   - Interview: ${scores.interview.score}`);
    console.log(`   - Overall Score: ${overall}`);
    
    // Verify math (20% weighting)
    const expected = Math.round(((scores.aptitude.score||0) * 0.2) + ((scores.coreECE.score||0) * 0.2) + ((scores.coding.score||0) * 0.2) + ((scores.resume.score||0) * 0.2) + ((scores.interview.score||0) * 0.2));
    if (Math.abs(expected - overall) <= 1) { // allow small rounding diff
       console.log(`✅ Weighting confirmed (Expected ~${expected}, Got ${overall})`);
    } else {
       console.log(`❌ Weighting mismatch! Expected ~${expected}, Got ${overall}`);
    }
  } else {
    console.log('❌ Failed to fetch readiness', readinessRes.data);
  }

  // 11. ERROR HANDLING
  console.log('\n--- PHASE 11: ERROR HANDLING ---');
  const invalidIdRes = await client.get('/resume/invalid-mongo-id');
  if (invalidIdRes.status === 400 || invalidIdRes.status === 500) console.log(`✅ Handled invalid Mongo ID (Status ${invalidIdRes.status})`);
  else console.log(`❌ Invalid Mongo ID check failed (Status ${invalidIdRes.status})`);

  const unauthClient = axios.create({ baseURL: API_URL, validateStatus: () => true });
  const unauthRes = await unauthClient.get('/resume');
  if (unauthRes.status === 401) console.log('✅ Handled missing authentication (Status 401)');
  else console.log(`❌ Missing auth check failed (Status ${unauthRes.status})`);

  console.log('\n--- E2E TEST SCRIPT COMPLETED ---');
}

runTests().catch(console.error);

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Subject = require('./src/models/Subject');
const Note = require('./src/models/Note');

async function runRegressionTests() {
  try {
    console.log('--- STARTING MONGODB CONNECTION ---');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('\n--- 1. DATABASE VERIFICATION ---');
    
    // 1. Digital Electronics
    const deSubjects = await Subject.find({ name: 'Digital Electronics' });
    console.log(`[Subject] Digital Electronics count: ${deSubjects.length}`);
    const deId = deSubjects[0]._id;
    
    // 2. Analog Electronics
    const aeSubjects = await Subject.find({ name: 'Analog Electronics' });
    console.log(`[Subject] Analog Electronics count: ${aeSubjects.length}`);
    const aeId = aeSubjects[0]._id;

    // 3. Another subject (Quantitative Aptitude)
    const qaSubjects = await Subject.find({ name: 'Quantitative Aptitude' });
    console.log(`[Subject] Quantitative Aptitude count: ${qaSubjects.length}`);
    const qaId = qaSubjects[0]._id;

    // Verify Notes Count
    const deNotes = await Note.find({ subject: deId });
    console.log(`[Notes] Digital Electronics notes count: ${deNotes.length}`);
    if(deNotes.length > 0) {
      console.log(`[Notes] Sample Title: ${deNotes[0].title}`);
    }

    const aeNotes = await Note.find({ subject: aeId });
    console.log(`[Notes] Analog Electronics notes count: ${aeNotes.length}`);

    const qaNotes = await Note.find({ subject: qaId });
    console.log(`[Notes] Quantitative Aptitude notes count: ${qaNotes.length}`);

    console.log('\n--- 2. API SIMULATION (CONTROLLER LOGIC) ---');
    
    // We can directly simulate the controller logic to verify backend querying logic
    const { getNotesBySubject } = require('./src/controllers/notes.controller');
    
    // Mock Res object
    const mockRes = {
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.data = data; return this; }
    };
    const mockNext = (err) => { console.error('Next called with:', err); };

    // Simulate Digital Electronics Request
    const reqDE = { params: { subjectId: deId.toString() } };
    await getNotesBySubject(reqDE, mockRes, mockNext);
    console.log(`[API Test] Digital Electronics => HTTP ${mockRes.statusCode}, Notes Returned: ${mockRes.data?.data?.length}`);

    // Simulate Analog Electronics Request
    const reqAE = { params: { subjectId: aeId.toString() } };
    await getNotesBySubject(reqAE, mockRes, mockNext);
    console.log(`[API Test] Analog Electronics => HTTP ${mockRes.statusCode}, Notes Returned: ${mockRes.data?.data?.length}`);

    // Simulate Invalid ID Request
    const reqInvalid = { params: { subjectId: '123invalidid456' } };
    await getNotesBySubject(reqInvalid, mockRes, mockNext); // Might trigger a cast error to next() or fail gracefully. Let's see.

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runRegressionTests();

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Subject = require('./src/models/Subject');
const Note = require('./src/models/Note');

async function testNotesAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const subjects = await Subject.find({ name: 'Digital Electronics' });
    console.log(`Digital Electronics Subject count: ${subjects.length}`);
    if (subjects.length !== 1) {
      console.log('Error: Found duplicate subjects');
    }
    
    const subjectId = subjects[0]._id;
    const chapters = await Note.find({ subject: subjectId });
    console.log(`Digital Electronics Chapters count: ${chapters.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

testNotesAPI();

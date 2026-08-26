const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const Subject = require('./src/models/Subject');
const Note = require('./src/models/Note');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const subjects = await Subject.find();
    console.log('Subjects:', subjects.map(s => ({ id: s._id, name: s.name, code: s.code })));
    
    const notes = await Note.find();
    console.log(`Total Notes: ${notes.length}`);
    if (notes.length > 0) {
      console.log('Sample Note:', { title: notes[0].title, subject: notes[0].subject });
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
};
checkDB();

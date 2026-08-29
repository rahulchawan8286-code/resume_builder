const mongoose = require('mongoose');
require('dotenv').config();
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Subject = require('../models/Subject');

const seedDigitalElectronicsQuiz = async () => {
  let isStandalone = false;
  try {
    isStandalone = require.main === module;
    
    // Only connect if completely disconnected
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is missing.');
      }
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri);
    }
    
    // Wait for connecting state to finish if it's connecting
    if (mongoose.connection.readyState === 2) {
      await new Promise(resolve => mongoose.connection.once('connected', resolve));
    }

    console.log('Connected to MongoDB. Starting Digital Electronics Quiz seed...');

    // Find Digital Electronics subject
    let subject = await Subject.findOne({ name: 'Digital Electronics' });
    if (!subject) {
      subject = await Subject.findOne({ code: 'ECE-DE' });
    }
    
    if (!subject) {
      throw new Error('Digital Electronics subject not found. Please ensure the subject exists.');
    }

    console.log(`Found Subject: ${subject.name} (${subject._id})`);

    // Create or Update Quiz
    const quizTitle = 'Digital Electronics Practice Test';
    let quiz = await Quiz.findOneAndUpdate(
      { subject: subject._id, title: quizTitle },
      {
        title: quizTitle,
        description: 'Comprehensive practice test covering logic gates, boolean algebra, combinational and sequential circuits.',
        subject: subject._id,
        timeLimit: 45,
        passingScore: 70,
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log(`Quiz Upserted: ${quiz.title} (${quiz._id})`);

    // Define exactly 30 high-quality MCQs
    const mcqs = [
      {
        text: 'Which of the following is an example of a universal gate?',
        options: [
          { text: 'AND', isCorrect: false },
          { text: 'OR', isCorrect: false },
          { text: 'NAND', isCorrect: true },
          { text: 'XOR', isCorrect: false }
        ],
        explanation: 'NAND and NOR gates are universal gates because any boolean function can be implemented using only these gates.',
        difficulty: 'easy'
      },
      {
        text: 'In Boolean algebra, the expression A + A\'B is equivalent to:',
        options: [
          { text: 'A + B', isCorrect: true },
          { text: 'A', isCorrect: false },
          { text: 'B', isCorrect: false },
          { text: '1', isCorrect: false }
        ],
        explanation: 'By the distributive law of Boolean algebra: A + A\'B = (A + A\')(A + B) = 1 * (A + B) = A + B.',
        difficulty: 'medium'
      },
      {
        text: 'What is the binary equivalent of the decimal number 25?',
        options: [
          { text: '11001', isCorrect: true },
          { text: '10101', isCorrect: false },
          { text: '11100', isCorrect: false },
          { text: '10011', isCorrect: false }
        ],
        explanation: '25 / 2 = 12 (rem 1), 12 / 2 = 6 (rem 0), 6 / 2 = 3 (rem 0), 3 / 2 = 1 (rem 1), 1 / 2 = 0 (rem 1). Reading from bottom to top gives 11001.',
        difficulty: 'easy'
      },
      {
        text: 'How many select lines are required for a 16-to-1 multiplexer?',
        options: [
          { text: '2', isCorrect: false },
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '16', isCorrect: false }
        ],
        explanation: 'A multiplexer with 2^n inputs requires n select lines. Since 16 = 2^4, 4 select lines are required.',
        difficulty: 'medium'
      },
      {
        text: 'Which logic family provides the lowest power dissipation?',
        options: [
          { text: 'TTL', isCorrect: false },
          { text: 'ECL', isCorrect: false },
          { text: 'CMOS', isCorrect: true },
          { text: 'DTL', isCorrect: false }
        ],
        explanation: 'CMOS (Complementary Metal-Oxide-Semiconductor) technology has very low static power consumption because ideally no current flows except during switching.',
        difficulty: 'easy'
      },
      {
        text: 'The output of an XOR gate is HIGH when its inputs are:',
        options: [
          { text: 'Both HIGH', isCorrect: false },
          { text: 'Both LOW', isCorrect: false },
          { text: 'Different', isCorrect: true },
          { text: 'Same', isCorrect: false }
        ],
        explanation: 'An XOR (Exclusive-OR) gate outputs HIGH (1) only when its inputs are different (e.g., 0,1 or 1,0).',
        difficulty: 'easy'
      },
      {
        text: 'A Karnaugh Map (K-map) is a graphical tool used primarily for:',
        options: [
          { text: 'Designing sequential circuits', isCorrect: false },
          { text: 'Minimizing boolean expressions', isCorrect: true },
          { text: 'Converting analog to digital', isCorrect: false },
          { text: 'Multiplexing signals', isCorrect: false }
        ],
        explanation: 'Karnaugh Maps provide a visual method for simplifying and minimizing boolean algebra expressions.',
        difficulty: 'easy'
      },
      {
        text: 'A flip-flop is a basic element of which type of circuit?',
        options: [
          { text: 'Combinational circuit', isCorrect: false },
          { text: 'Sequential circuit', isCorrect: true },
          { text: 'Analog circuit', isCorrect: false },
          { text: 'Linear circuit', isCorrect: false }
        ],
        explanation: 'Flip-flops store state and depend on past inputs, which makes them the fundamental building blocks of sequential circuits.',
        difficulty: 'easy'
      },
      {
        text: 'What is the characteristic equation of a D flip-flop?',
        options: [
          { text: 'Q(n+1) = D', isCorrect: true },
          { text: 'Q(n+1) = D\'', isCorrect: false },
          { text: 'Q(n+1) = JQ\' + K\'Q', isCorrect: false },
          { text: 'Q(n+1) = T ⊕ Q', isCorrect: false }
        ],
        explanation: 'For a Data (D) flip-flop, the next state is equal to the input D, hence Q(n+1) = D.',
        difficulty: 'easy'
      },
      {
        text: 'Which flip-flop suffers from the "race around condition"?',
        options: [
          { text: 'SR flip-flop', isCorrect: false },
          { text: 'D flip-flop', isCorrect: false },
          { text: 'Level-triggered JK flip-flop', isCorrect: true },
          { text: 'T flip-flop', isCorrect: false }
        ],
        explanation: 'A level-triggered JK flip-flop suffers from the race around condition when J=1, K=1 and the clock pulse is wider than the propagation delay of the flip-flop.',
        difficulty: 'medium'
      },
      {
        text: 'How many flip-flops are needed to construct a Mod-10 counter?',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
          { text: '10', isCorrect: false }
        ],
        explanation: 'To count up to N states, you need n flip-flops where 2^n >= N. For N=10, 2^3=8 (too small), 2^4=16. So 4 flip-flops are needed.',
        difficulty: 'medium'
      },
      {
        text: 'A combinational circuit is one in which the output depends on:',
        options: [
          { text: 'Present inputs only', isCorrect: true },
          { text: 'Past outputs only', isCorrect: false },
          { text: 'Present inputs and past outputs', isCorrect: false },
          { text: 'Clock pulses', isCorrect: false }
        ],
        explanation: 'In combinational circuits, outputs are determined purely by the current combination of inputs, with no memory of past states.',
        difficulty: 'easy'
      },
      {
        text: 'The 2\'s complement of the binary number 1011 is:',
        options: [
          { text: '0100', isCorrect: false },
          { text: '0101', isCorrect: true },
          { text: '1101', isCorrect: false },
          { text: '0011', isCorrect: false }
        ],
        explanation: '1\'s complement of 1011 is 0100. Adding 1 to the LSB gives 0101.',
        difficulty: 'medium'
      },
      {
        text: 'What does a full adder add?',
        options: [
          { text: 'Two bits', isCorrect: false },
          { text: 'Two bits and a carry', isCorrect: true },
          { text: 'Three bits and a carry', isCorrect: false },
          { text: 'Four bits', isCorrect: false }
        ],
        explanation: 'A full adder takes three inputs: two significant bits and a carry-in from a previous less significant stage.',
        difficulty: 'easy'
      },
      {
        text: 'The Boolean expression for the sum (S) of a half adder with inputs A and B is:',
        options: [
          { text: 'A + B', isCorrect: false },
          { text: 'A ⊕ B', isCorrect: true },
          { text: 'A · B', isCorrect: false },
          { text: 'A\'B + AB', isCorrect: false }
        ],
        explanation: 'The Sum of a half adder is A XOR B (A ⊕ B), and the Carry is A AND B (A · B).',
        difficulty: 'easy'
      },
      {
        text: 'An encoder is a combinational circuit that performs the inverse operation of a:',
        options: [
          { text: 'Multiplexer', isCorrect: false },
          { text: 'Demultiplexer', isCorrect: false },
          { text: 'Decoder', isCorrect: true },
          { text: 'Comparator', isCorrect: false }
        ],
        explanation: 'An encoder converts multiple input lines into fewer output lines (e.g., 8-to-3), whereas a decoder does the reverse (e.g., 3-to-8).',
        difficulty: 'easy'
      },
      {
        text: 'Which code is unweighted and has the property that successive numbers differ by only one bit?',
        options: [
          { text: 'BCD code', isCorrect: false },
          { text: 'Excess-3 code', isCorrect: false },
          { text: 'Gray code', isCorrect: true },
          { text: 'ASCII code', isCorrect: false }
        ],
        explanation: 'Gray code is an unweighted cyclic code where only one bit changes at a time between consecutive values, reducing errors in mechanical switches.',
        difficulty: 'medium'
      },
      {
        text: 'De Morgan\'s theorem states that (A + B)\' is equal to:',
        options: [
          { text: 'A\' + B\'', isCorrect: false },
          { text: 'A\' · B\'', isCorrect: true },
          { text: 'A + B\'', isCorrect: false },
          { text: 'A\' · B', isCorrect: false }
        ],
        explanation: 'De Morgan\'s first theorem: The complement of a logical OR is the logical AND of the complements. (A+B)\' = A\'·B\'.',
        difficulty: 'easy'
      },
      {
        text: 'In a shift register, if data is entered one bit at a time and also retrieved one bit at a time, it is called:',
        options: [
          { text: 'SISO', isCorrect: true },
          { text: 'SIPO', isCorrect: false },
          { text: 'PISO', isCorrect: false },
          { text: 'PIPO', isCorrect: false }
        ],
        explanation: 'SISO stands for Serial-In Serial-Out shift register.',
        difficulty: 'easy'
      },
      {
        text: 'What is the modulus of a decade counter?',
        options: [
          { text: '8', isCorrect: false },
          { text: '10', isCorrect: true },
          { text: '12', isCorrect: false },
          { text: '16', isCorrect: false }
        ],
        explanation: 'A decade counter (Mod-10 counter) has 10 distinct states (0 through 9) before resetting.',
        difficulty: 'easy'
      },
      {
        text: 'To completely eliminate the race around condition in a JK flip-flop, the most common structural solution is to use:',
        options: [
          { text: 'A Master-Slave configuration', isCorrect: true },
          { text: 'A D-latch', isCorrect: false },
          { text: 'A longer clock pulse', isCorrect: false },
          { text: 'A higher voltage supply', isCorrect: false }
        ],
        explanation: 'A master-slave JK flip-flop uses two stages, reading inputs on one edge and updating outputs on the other, effectively preventing race conditions.',
        difficulty: 'medium'
      },
      {
        text: 'What is the primary advantage of ECL (Emitter-Coupled Logic) over TTL?',
        options: [
          { text: 'Lower power consumption', isCorrect: false },
          { text: 'Higher noise margin', isCorrect: false },
          { text: 'Faster switching speed', isCorrect: true },
          { text: 'Higher packing density', isCorrect: false }
        ],
        explanation: 'ECL uses transistors in their active region (non-saturated), avoiding storage time delays, making it the fastest logic family.',
        difficulty: 'hard'
      },
      {
        text: 'Which device can convert analog signals into digital format?',
        options: [
          { text: 'DAC', isCorrect: false },
          { text: 'ADC', isCorrect: true },
          { text: 'Multiplexer', isCorrect: false },
          { text: 'Decoder', isCorrect: false }
        ],
        explanation: 'ADC stands for Analog-to-Digital Converter.',
        difficulty: 'easy'
      },
      {
        text: 'In a Flash ADC with n bits of resolution, how many comparators are required?',
        options: [
          { text: '2^n', isCorrect: false },
          { text: '2^n - 1', isCorrect: true },
          { text: 'n', isCorrect: false },
          { text: 'n^2', isCorrect: false }
        ],
        explanation: 'A flash ADC requires 2^n - 1 comparators to instantly compare the input analog voltage against a resistor ladder reference.',
        difficulty: 'hard'
      },
      {
        text: 'The minimum number of NAND gates required to implement an XOR gate is:',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false }
        ],
        explanation: 'It takes exactly 4 two-input NAND gates to implement a 2-input XOR function.',
        difficulty: 'hard'
      },
      {
        text: 'A circuit that compares two binary numbers and determines if they are equal or which is greater is a:',
        options: [
          { text: 'Multiplexer', isCorrect: false },
          { text: 'Decoder', isCorrect: false },
          { text: 'Magnitude Comparator', isCorrect: true },
          { text: 'Arithmetic Logic Unit', isCorrect: false }
        ],
        explanation: 'A magnitude comparator generates A=B, A>B, and A<B signals.',
        difficulty: 'easy'
      },
      {
        text: 'If a 4-bit synchronous counter starts at 0000, what will be its state after 5 clock pulses?',
        options: [
          { text: '0101', isCorrect: true },
          { text: '1010', isCorrect: false },
          { text: '0110', isCorrect: false },
          { text: '0100', isCorrect: false }
        ],
        explanation: 'It counts in binary. After 5 pulses, the binary value is 5, which is 0101.',
        difficulty: 'easy'
      },
      {
        text: 'Which logic gate is equivalent to a series circuit of two switches?',
        options: [
          { text: 'OR Gate', isCorrect: false },
          { text: 'AND Gate', isCorrect: true },
          { text: 'NOR Gate', isCorrect: false },
          { text: 'NAND Gate', isCorrect: false }
        ],
        explanation: 'In a series circuit, current flows only if both switch A AND switch B are closed.',
        difficulty: 'easy'
      },
      {
        text: 'What is the base of the Hexadecimal number system?',
        options: [
          { text: '2', isCorrect: false },
          { text: '8', isCorrect: false },
          { text: '10', isCorrect: false },
          { text: '16', isCorrect: true }
        ],
        explanation: 'Hexadecimal represents values from 0 to 15 using base 16 (0-9 and A-F).',
        difficulty: 'easy'
      },
      {
        text: 'What type of memory is SRAM?',
        options: [
          { text: 'Non-volatile', isCorrect: false },
          { text: 'Volatile', isCorrect: true },
          { text: 'Read-only', isCorrect: false },
          { text: 'Magnetic', isCorrect: false }
        ],
        explanation: 'Static Random Access Memory (SRAM) is volatile memory that loses data when power is removed.',
        difficulty: 'easy'
      }
    ];

    let createdCount = 0;
    for (const mcq of mcqs) {
      await Question.findOneAndUpdate(
        { quiz: quiz._id, text: mcq.text },
        {
          ...mcq,
          quiz: quiz._id
        },
        { upsert: true, new: true }
      );
      createdCount++;
    }

    console.log(`✅ Successfully seeded ${createdCount} MCQs for ${quiz.title}`);

    // Self-verification
    const verifyCount = await Question.countDocuments({ quiz: quiz._id });
    if (verifyCount !== 30) {
      throw new Error(`Production quiz verification failed: Expected 30 questions, found ${verifyCount}`);
    }

    console.log(`🎉 Digital Electronics Quiz Seeding Complete and Verified (${verifyCount}/30).`);
    
    if (isStandalone) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding quiz:', error);
    if (isStandalone) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDigitalElectronicsQuiz();
}

module.exports = seedDigitalElectronicsQuiz;

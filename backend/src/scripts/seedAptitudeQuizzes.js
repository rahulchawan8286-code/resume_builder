const mongoose = require('mongoose');
require('dotenv').config();
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Subject = require('../models/Subject');

const seedAptitudeQuizzes = async () => {
  let isStandalone = false;
  try {
    isStandalone = require.main === module;
    
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI;
      if (!uri) throw new Error('MONGODB_URI environment variable is missing.');
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri);
    }
    
    if (mongoose.connection.readyState === 2) {
      await new Promise(resolve => mongoose.connection.once('connected', resolve));
    }

    console.log('Connected to MongoDB. Starting Aptitude Quizzes seed...');

    const categories = [
      {
        name: 'Quantitative Aptitude',
        code: 'APT-QUANT',
        desc: 'Numerical ability and mathematical problem solving.'
      },
      {
        name: 'Logical Reasoning',
        code: 'APT-LR',
        desc: 'Analytical thinking and pattern recognition.'
      },
      {
        name: 'Verbal Ability',
        code: 'APT-VERBAL',
        desc: 'English grammar, vocabulary, and comprehension.'
      },
      {
        name: 'Data Interpretation',
        code: 'APT-DI',
        desc: 'Reading and analyzing charts, graphs, and tables.'
      }
    ];

    const quizzesData = [
  {
    "categoryCode": "APT-QUANT",
    "title": "Quantitative Aptitude Test 1",
    "description": "Practice fundamental quantitative aptitude questions commonly asked in engineering placements.",
    "timeLimit": 30,
    "passingScore": 60,
    "questions": [
      {
        "text": "If the cost price of 20 articles is equal to the selling price of 15 articles, what is the profit percentage?",
        "options": [
          {
            "text": "25%",
            "isCorrect": false
          },
          {
            "text": "33.33%",
            "isCorrect": true
          },
          {
            "text": "20%",
            "isCorrect": false
          },
          {
            "text": "50%",
            "isCorrect": false
          }
        ],
        "explanation": "Let CP of 1 article = 1. CP of 20 = 20. SP of 15 = 20. SP of 1 = 20/15 = 4/3. Profit % = ((4/3 - 1) / 1) * 100 = 33.33%.",
        "difficulty": "medium"
      },
      {
        "text": "A train 150m long is running at 72 km/hr. How long will it take to cross a pole?",
        "options": [
          {
            "text": "7.5 sec",
            "isCorrect": true
          },
          {
            "text": "12 sec",
            "isCorrect": false
          },
          {
            "text": "15 sec",
            "isCorrect": false
          },
          {
            "text": "10 sec",
            "isCorrect": false
          }
        ],
        "explanation": "Speed in m/s = 72 * (5/18) = 20 m/s. Time = Distance/Speed = 150/20 = 7.5 seconds.",
        "difficulty": "easy"
      },
      {
        "text": "The average of first 50 natural numbers is:",
        "options": [
          {
            "text": "25.30",
            "isCorrect": false
          },
          {
            "text": "25.5",
            "isCorrect": true
          },
          {
            "text": "25.00",
            "isCorrect": false
          },
          {
            "text": "12.25",
            "isCorrect": false
          }
        ],
        "explanation": "The sum of first N natural numbers is N(N+1)/2. Average = (N+1)/2 = 51/2 = 25.5.",
        "difficulty": "easy"
      },
      {
        "text": "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:",
        "options": [
          {
            "text": "Rs. 650",
            "isCorrect": false
          },
          {
            "text": "Rs. 690",
            "isCorrect": false
          },
          {
            "text": "Rs. 698",
            "isCorrect": true
          },
          {
            "text": "Rs. 700",
            "isCorrect": false
          }
        ],
        "explanation": "SI for 1 year = 854 - 815 = 39. SI for 3 years = 39 * 3 = 117. Principal = 815 - 117 = 698.",
        "difficulty": "medium"
      },
      {
        "text": "A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:",
        "options": [
          {
            "text": "1/4",
            "isCorrect": false
          },
          {
            "text": "1/10",
            "isCorrect": false
          },
          {
            "text": "7/15",
            "isCorrect": false
          },
          {
            "text": "8/15",
            "isCorrect": true
          }
        ],
        "explanation": "A's 1 day work = 1/15. B's 1 day work = 1/20. (A+B)'s 1 day work = 1/15 + 1/20 = 7/60. Work done in 4 days = 4 * (7/60) = 7/15. Remaining = 1 - 7/15 = 8/15.",
        "difficulty": "medium"
      },
      {
        "text": "If 20% of a = b, then b% of 20 is the same as:",
        "options": [
          {
            "text": "4% of a",
            "isCorrect": true
          },
          {
            "text": "5% of a",
            "isCorrect": false
          },
          {
            "text": "20% of a",
            "isCorrect": false
          },
          {
            "text": "None of these",
            "isCorrect": false
          }
        ],
        "explanation": "b = 0.20a. Then b% of 20 = (0.20a / 100) * 20 = (4a / 100) = 4% of a.",
        "difficulty": "medium"
      },
      {
        "text": "Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new numbers are in the ratio 12:23. The smaller number is:",
        "options": [
          {
            "text": "27",
            "isCorrect": false
          },
          {
            "text": "33",
            "isCorrect": true
          },
          {
            "text": "49",
            "isCorrect": false
          },
          {
            "text": "55",
            "isCorrect": false
          }
        ],
        "explanation": "Let the numbers be 3x and 5x. (3x-9)/(5x-9) = 12/23. 69x - 207 = 60x - 108. 9x = 99. x = 11. Smaller number = 3 * 11 = 33.",
        "difficulty": "hard"
      },
      {
        "text": "A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.",
        "options": [
          {
            "text": "2 hours",
            "isCorrect": false
          },
          {
            "text": "3 hours",
            "isCorrect": false
          },
          {
            "text": "4 hours",
            "isCorrect": true
          },
          {
            "text": "5 hours",
            "isCorrect": false
          }
        ],
        "explanation": "Downstream speed = 13 + 4 = 17 km/hr. Time = 68 / 17 = 4 hours.",
        "difficulty": "easy"
      },
      {
        "text": "What is the probability of getting a sum 9 from two throws of a dice?",
        "options": [
          {
            "text": "1/6",
            "isCorrect": false
          },
          {
            "text": "1/8",
            "isCorrect": false
          },
          {
            "text": "1/9",
            "isCorrect": true
          },
          {
            "text": "1/12",
            "isCorrect": false
          }
        ],
        "explanation": "Favorable outcomes = (3,6), (4,5), (5,4), (6,3) = 4. Total outcomes = 36. Probability = 4/36 = 1/9.",
        "difficulty": "medium"
      },
      {
        "text": "A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?",
        "options": [
          {
            "text": "3",
            "isCorrect": false
          },
          {
            "text": "4",
            "isCorrect": false
          },
          {
            "text": "5",
            "isCorrect": true
          },
          {
            "text": "6",
            "isCorrect": false
          }
        ],
        "explanation": "CP of 6 toffees = Rs 1. SP of 6 toffees to gain 20% = 1.20. SP of 1 toffee = 1.20 / 6 = Rs 0.20. Number of toffees for Re 1 = 1 / 0.20 = 5.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "categoryCode": "APT-LR",
    "title": "Logical Reasoning Practice",
    "description": "Test your analytical and logical thinking skills.",
    "timeLimit": 20,
    "passingScore": 50,
    "questions": [
      {
        "text": "If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?",
        "options": [
          {
            "text": "Nephew",
            "isCorrect": false
          },
          {
            "text": "Niece",
            "isCorrect": false
          },
          {
            "text": "Cannot be determined",
            "isCorrect": true
          },
          {
            "text": "Brother",
            "isCorrect": false
          }
        ],
        "explanation": "D's gender is not mentioned, so D can be either nephew or niece to A.",
        "difficulty": "medium"
      },
      {
        "text": "Look at this series: 2, 6, 18, 54, ... What number should come next?",
        "options": [
          {
            "text": "108",
            "isCorrect": false
          },
          {
            "text": "148",
            "isCorrect": false
          },
          {
            "text": "162",
            "isCorrect": true
          },
          {
            "text": "216",
            "isCorrect": false
          }
        ],
        "explanation": "Each number is multiplied by 3 to get the next number (54 * 3 = 162).",
        "difficulty": "easy"
      },
      {
        "text": "Odometer is to mileage as compass is to:",
        "options": [
          {
            "text": "Speed",
            "isCorrect": false
          },
          {
            "text": "Hiking",
            "isCorrect": false
          },
          {
            "text": "Needle",
            "isCorrect": false
          },
          {
            "text": "Direction",
            "isCorrect": true
          }
        ],
        "explanation": "An odometer measures mileage, and a compass indicates direction.",
        "difficulty": "easy"
      },
      {
        "text": "If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded in that code?",
        "options": [
          {
            "text": "CPNCBX",
            "isCorrect": false
          },
          {
            "text": "CPNCBZ",
            "isCorrect": true
          },
          {
            "text": "CPOCBZ",
            "isCorrect": false
          },
          {
            "text": "CQOCBZ",
            "isCorrect": false
          }
        ],
        "explanation": "Each letter is shifted by +1 in the alphabet. B->C, O->P, M->N, B->C, A->B, Y->Z.",
        "difficulty": "medium"
      },
      {
        "text": "Pointing to a photograph of a boy Suresh said, \"He is the son of the only son of my mother.\" How is Suresh related to that boy?",
        "options": [
          {
            "text": "Brother",
            "isCorrect": false
          },
          {
            "text": "Uncle",
            "isCorrect": false
          },
          {
            "text": "Cousin",
            "isCorrect": false
          },
          {
            "text": "Father",
            "isCorrect": true
          }
        ],
        "explanation": "The only son of Suresh's mother is Suresh himself. The boy is the son of Suresh.",
        "difficulty": "medium"
      },
      {
        "text": "A man walks 5 km toward south and then turns to the right. After walking 3 km he turns to the left and walks 5 km. Now in which direction is he from the starting place?",
        "options": [
          {
            "text": "West",
            "isCorrect": false
          },
          {
            "text": "South",
            "isCorrect": false
          },
          {
            "text": "North-East",
            "isCorrect": false
          },
          {
            "text": "South-West",
            "isCorrect": true
          }
        ],
        "explanation": "He goes South, then West, then South. The final position is South-West from the start.",
        "difficulty": "easy"
      },
      {
        "text": "Statements: All mangoes are golden in color. No golden-colored things are cheap. Conclusions: I. All mangoes are cheap. II. Golden-colored mangoes are not cheap.",
        "options": [
          {
            "text": "Only I follows",
            "isCorrect": false
          },
          {
            "text": "Only II follows",
            "isCorrect": true
          },
          {
            "text": "Both I and II follow",
            "isCorrect": false
          },
          {
            "text": "Neither I nor II follows",
            "isCorrect": false
          }
        ],
        "explanation": "Since all mangoes are golden and no golden things are cheap, no mango is cheap. Therefore II follows, and I does not.",
        "difficulty": "hard"
      },
      {
        "text": "Choose the odd one out:",
        "options": [
          {
            "text": "Apple",
            "isCorrect": false
          },
          {
            "text": "Mango",
            "isCorrect": false
          },
          {
            "text": "Potato",
            "isCorrect": true
          },
          {
            "text": "Orange",
            "isCorrect": false
          }
        ],
        "explanation": "Potato is a vegetable, others are fruits.",
        "difficulty": "easy"
      },
      {
        "text": "Five girls are sitting on a bench to be photographed. Seema is to the left of Rani and to the right of Bindu. Mary is to the right of Rani. Reeta is between Rani and Mary. Who is sitting immediate right to Reeta?",
        "options": [
          {
            "text": "Bindu",
            "isCorrect": false
          },
          {
            "text": "Rani",
            "isCorrect": false
          },
          {
            "text": "Mary",
            "isCorrect": true
          },
          {
            "text": "Seema",
            "isCorrect": false
          }
        ],
        "explanation": "The arrangement from left to right is: Bindu, Seema, Rani, Reeta, Mary.",
        "difficulty": "hard"
      },
      {
        "text": "Which of the following numbers is the odd one out: 121, 144, 169, 182?",
        "options": [
          {
            "text": "121",
            "isCorrect": false
          },
          {
            "text": "144",
            "isCorrect": false
          },
          {
            "text": "169",
            "isCorrect": false
          },
          {
            "text": "182",
            "isCorrect": true
          }
        ],
        "explanation": "182 is not a perfect square, while 121 (11^2), 144 (12^2), and 169 (13^2) are perfect squares.",
        "difficulty": "easy"
      }
    ]
  },
  {
    "categoryCode": "APT-VERBAL",
    "title": "Verbal Ability Challenge",
    "description": "Grammar and vocabulary assessment for placements.",
    "timeLimit": 15,
    "passingScore": 70,
    "questions": [
      {
        "text": "Choose the correct synonym for \"UBIQUITOUS\":",
        "options": [
          {
            "text": "Rare",
            "isCorrect": false
          },
          {
            "text": "Omnipresent",
            "isCorrect": true
          },
          {
            "text": "Wealthy",
            "isCorrect": false
          },
          {
            "text": "Temporary",
            "isCorrect": false
          }
        ],
        "explanation": "Ubiquitous means present, appearing, or found everywhere (omnipresent).",
        "difficulty": "medium"
      },
      {
        "text": "Choose the correct antonym for \"EPHEMERAL\":",
        "options": [
          {
            "text": "Transient",
            "isCorrect": false
          },
          {
            "text": "Permanent",
            "isCorrect": true
          },
          {
            "text": "Vibrant",
            "isCorrect": false
          },
          {
            "text": "Brief",
            "isCorrect": false
          }
        ],
        "explanation": "Ephemeral means lasting for a very short time. Permanent is the exact opposite.",
        "difficulty": "hard"
      },
      {
        "text": "Find the grammatical error: \"Neither the manager nor the employees was aware of the change.\"",
        "options": [
          {
            "text": "Neither the manager",
            "isCorrect": false
          },
          {
            "text": "nor the employees",
            "isCorrect": false
          },
          {
            "text": "was aware of",
            "isCorrect": true
          },
          {
            "text": "the change",
            "isCorrect": false
          }
        ],
        "explanation": "The verb should agree with the noun closer to it. \"Employees\" is plural, so it should be \"were aware of\".",
        "difficulty": "medium"
      },
      {
        "text": "Fill in the blank: She has been living here ____ 2010.",
        "options": [
          {
            "text": "for",
            "isCorrect": false
          },
          {
            "text": "since",
            "isCorrect": true
          },
          {
            "text": "from",
            "isCorrect": false
          },
          {
            "text": "in",
            "isCorrect": false
          }
        ],
        "explanation": "\"Since\" is used to indicate a specific point in time when an action began.",
        "difficulty": "easy"
      },
      {
        "text": "What is the meaning of the idiom \"To bite the bullet\"?",
        "options": [
          {
            "text": "To act aggressively",
            "isCorrect": false
          },
          {
            "text": "To endure a painful or difficult situation bravely",
            "isCorrect": true
          },
          {
            "text": "To eat very fast",
            "isCorrect": false
          },
          {
            "text": "To make a huge mistake",
            "isCorrect": false
          }
        ],
        "explanation": "To bite the bullet means to force yourself to do something difficult or unpleasant.",
        "difficulty": "easy"
      },
      {
        "text": "Select the word that is spelled correctly:",
        "options": [
          {
            "text": "Accomodation",
            "isCorrect": false
          },
          {
            "text": "Acommodation",
            "isCorrect": false
          },
          {
            "text": "Accommodation",
            "isCorrect": true
          },
          {
            "text": "Accomadation",
            "isCorrect": false
          }
        ],
        "explanation": "The correct spelling is Accommodation (two c's and two m's).",
        "difficulty": "easy"
      },
      {
        "text": "Rearrange to form a meaningful sentence: P. is a / Q. good boy / R. Ram / S. who helps everyone",
        "options": [
          {
            "text": "R P Q S",
            "isCorrect": true
          },
          {
            "text": "P Q R S",
            "isCorrect": false
          },
          {
            "text": "S R P Q",
            "isCorrect": false
          },
          {
            "text": "R S P Q",
            "isCorrect": false
          }
        ],
        "explanation": "Ram (R) is a (P) good boy (Q) who helps everyone (S).",
        "difficulty": "easy"
      },
      {
        "text": "Which of the following is a synonym for \"METICULOUS\"?",
        "options": [
          {
            "text": "Careless",
            "isCorrect": false
          },
          {
            "text": "Sloppy",
            "isCorrect": false
          },
          {
            "text": "Fastidious",
            "isCorrect": true
          },
          {
            "text": "Rapid",
            "isCorrect": false
          }
        ],
        "explanation": "Meticulous and fastidious both mean showing great attention to detail.",
        "difficulty": "medium"
      },
      {
        "text": "Fill in the blank: The train had already left before I ____ the station.",
        "options": [
          {
            "text": "reach",
            "isCorrect": false
          },
          {
            "text": "will reach",
            "isCorrect": false
          },
          {
            "text": "reached",
            "isCorrect": true
          },
          {
            "text": "had reached",
            "isCorrect": false
          }
        ],
        "explanation": "When two past actions occur, the past perfect (had left) is used for the earlier action, and simple past (reached) for the later one.",
        "difficulty": "medium"
      },
      {
        "text": "Find the error: \"One of the boys have completed the assignment.\"",
        "options": [
          {
            "text": "One of the",
            "isCorrect": false
          },
          {
            "text": "boys",
            "isCorrect": false
          },
          {
            "text": "have completed",
            "isCorrect": true
          },
          {
            "text": "the assignment",
            "isCorrect": false
          }
        ],
        "explanation": "\"One of the\" is followed by a plural noun but takes a singular verb. It should be \"has completed\".",
        "difficulty": "hard"
      }
    ]
  },
  {
    "categoryCode": "APT-DI",
    "title": "Data Interpretation Basics",
    "description": "Foundations of chart and data analysis.",
    "timeLimit": 25,
    "passingScore": 60,
    "questions": [
      {
        "text": "If the total sales of a company is $500,000 and the profit margin is 12%, what is the total profit?",
        "options": [
          {
            "text": "$60,000",
            "isCorrect": true
          },
          {
            "text": "$50,000",
            "isCorrect": false
          },
          {
            "text": "$12,000",
            "isCorrect": false
          },
          {
            "text": "$72,000",
            "isCorrect": false
          }
        ],
        "explanation": "Profit = 12% of 500,000 = (12/100) * 500000 = 60,000.",
        "difficulty": "easy"
      },
      {
        "text": "A pie chart shows expenses: Rent 30%, Food 25%, Transport 15%, Savings 30%. If total income is Rs 40,000, what is the amount spent on Food and Transport combined?",
        "options": [
          {
            "text": "Rs 10,000",
            "isCorrect": false
          },
          {
            "text": "Rs 16,000",
            "isCorrect": true
          },
          {
            "text": "Rs 18,000",
            "isCorrect": false
          },
          {
            "text": "Rs 20,000",
            "isCorrect": false
          }
        ],
        "explanation": "Combined % = 25% + 15% = 40%. Amount = 40% of 40,000 = 16,000.",
        "difficulty": "easy"
      },
      {
        "text": "The population of a city grew from 2 million in 2010 to 2.5 million in 2020. What is the percentage increase?",
        "options": [
          {
            "text": "20%",
            "isCorrect": false
          },
          {
            "text": "25%",
            "isCorrect": true
          },
          {
            "text": "30%",
            "isCorrect": false
          },
          {
            "text": "50%",
            "isCorrect": false
          }
        ],
        "explanation": "Increase = 2.5 - 2.0 = 0.5 million. % Increase = (0.5 / 2.0) * 100 = 25%.",
        "difficulty": "medium"
      },
      {
        "text": "In a bar chart, Company A produces 120 units and Company B produces 150 units. What is the ratio of production of A to B?",
        "options": [
          {
            "text": "4:5",
            "isCorrect": true
          },
          {
            "text": "5:4",
            "isCorrect": false
          },
          {
            "text": "2:3",
            "isCorrect": false
          },
          {
            "text": "3:2",
            "isCorrect": false
          }
        ],
        "explanation": "Ratio = 120 / 150 = 12 / 15 = 4:5.",
        "difficulty": "easy"
      },
      {
        "text": "Data table shows marks: Math=85, Physics=70, Chemistry=95, English=60. What is the average mark?",
        "options": [
          {
            "text": "75",
            "isCorrect": false
          },
          {
            "text": "77.5",
            "isCorrect": true
          },
          {
            "text": "80",
            "isCorrect": false
          },
          {
            "text": "82.5",
            "isCorrect": false
          }
        ],
        "explanation": "Average = (85 + 70 + 95 + 60) / 4 = 310 / 4 = 77.5.",
        "difficulty": "easy"
      },
      {
        "text": "A line graph shows temperatures over 4 days: 20\u00b0C, 25\u00b0C, 30\u00b0C, 21\u00b0C. What is the percentage drop from Day 3 to Day 4?",
        "options": [
          {
            "text": "25%",
            "isCorrect": false
          },
          {
            "text": "30%",
            "isCorrect": true
          },
          {
            "text": "33.3%",
            "isCorrect": false
          },
          {
            "text": "20%",
            "isCorrect": false
          }
        ],
        "explanation": "Drop = 30 - 21 = 9. % Drop = (9 / 30) * 100 = 30%.",
        "difficulty": "medium"
      },
      {
        "text": "In a class of 50 students, 30 are boys. If 20% of the boys and 40% of the girls fail, what percentage of the whole class passes?",
        "options": [
          {
            "text": "70%",
            "isCorrect": false
          },
          {
            "text": "72%",
            "isCorrect": true
          },
          {
            "text": "60%",
            "isCorrect": false
          },
          {
            "text": "68%",
            "isCorrect": false
          }
        ],
        "explanation": "Boys = 30, Girls = 20. Boys failed = 0.2*30 = 6. Girls failed = 0.4*20 = 8. Total failed = 14. Total passed = 50 - 14 = 36. Pass % = (36/50)*100 = 72%.",
        "difficulty": "hard"
      },
      {
        "text": "Revenue increased by 10% in Year 1 and 20% in Year 2. What is the net percentage increase over the two years?",
        "options": [
          {
            "text": "30%",
            "isCorrect": false
          },
          {
            "text": "32%",
            "isCorrect": true
          },
          {
            "text": "35%",
            "isCorrect": false
          },
          {
            "text": "40%",
            "isCorrect": false
          }
        ],
        "explanation": "Successive increase formula: a + b + (ab/100) = 10 + 20 + (200/100) = 32%.",
        "difficulty": "medium"
      },
      {
        "text": "A table shows exports in millions: Y1=10, Y2=15, Y3=20. What is the compound annual growth rate (approx) from Y1 to Y3?",
        "options": [
          {
            "text": "30%",
            "isCorrect": false
          },
          {
            "text": "41.4%",
            "isCorrect": true
          },
          {
            "text": "50%",
            "isCorrect": false
          },
          {
            "text": "100%",
            "isCorrect": false
          }
        ],
        "explanation": "CAGR = (End Value / Begin Value)^(1/years) - 1. (20/10)^(1/2) - 1 = sqrt(2) - 1 = 1.414 - 1 = 0.414 or 41.4%.",
        "difficulty": "hard"
      },
      {
        "text": "A pie chart represents 360 degrees. If a sector representing \"Education\" has an angle of 72 degrees, what percentage of the total does it represent?",
        "options": [
          {
            "text": "15%",
            "isCorrect": false
          },
          {
            "text": "20%",
            "isCorrect": true
          },
          {
            "text": "25%",
            "isCorrect": false
          },
          {
            "text": "30%",
            "isCorrect": false
          }
        ],
        "explanation": "Percentage = (72 / 360) * 100 = 20%.",
        "difficulty": "easy"
      }
    ]
  }
];

    let totalQuizzesSeeded = 0;
    let totalQuestionsSeeded = 0;

    for (const cat of categories) {
      let subject = await Subject.findOne({ name: cat.name });
      if (!subject) {
        subject = await Subject.create({
          name: cat.name,
          description: cat.desc,
          code: cat.code,
          isActive: true
        });
        console.log(`Created new Subject: ${subject.name} (${subject.code})`);
      } else {
        if (!subject.code || subject.code !== cat.code) {
          subject.code = cat.code;
          await subject.save();
        }
        console.log(`Subject already exists: ${subject.name} (${subject.code})`);
      }
    }

    for (const quizData of quizzesData) {
      const subject = await Subject.findOne({ code: quizData.categoryCode });
      if (!subject) throw new Error(`Subject ${quizData.categoryCode} not found.`);

      const quiz = await Quiz.findOneAndUpdate(
        { subject: subject._id, title: quizData.title },
        {
          title: quizData.title,
          description: quizData.description,
          subject: subject._id,
          timeLimit: quizData.timeLimit,
          passingScore: quizData.passingScore,
          isActive: true
        },
        { upsert: true, new: true }
      );

      console.log(`Quiz Upserted: ${quiz.title}`);
      totalQuizzesSeeded++;

      for (const mcq of quizData.questions) {
        await Question.findOneAndUpdate(
          { quiz: quiz._id, text: mcq.text },
          {
            ...mcq,
            quiz: quiz._id
          },
          { upsert: true, new: true }
        );
        totalQuestionsSeeded++;
      }
    }

    console.log(`✅ Successfully seeded ${totalQuizzesSeeded} Aptitude Quizzes and ${totalQuestionsSeeded} Questions.`);
    
    if (isStandalone) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding aptitude quizzes:', error);
    if (isStandalone) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedAptitudeQuizzes();
}

module.exports = seedAptitudeQuizzes;

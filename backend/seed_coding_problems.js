require('dotenv').config();
const mongoose = require('mongoose');
const CodingProblem = require('./src/models/CodingProblem');

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table'],
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' },
      { input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]' }
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n}',
      python: 'def twoSum(nums, target):\n  # Write your code here',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};'
    }
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string `s` containing just the characters `\'(\'`, `\')\'`, `\'{\'`, `\'}\'`, `\'[\'` and `\']\'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    difficulty: 'Easy',
    tags: ['Strings', 'Stacks'],
    testCases: [
      { input: 's = "()"', expectedOutput: 'true' },
      { input: 's = "()[]{}"', expectedOutput: 'true' },
      { input: 's = "(]"', expectedOutput: 'false' }
    ],
    starterCode: {
      javascript: 'function isValid(s) {\n  // Write your code here\n}',
      python: 'def isValid(s):\n  # Write your code here',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};'
    }
  },
  {
    title: 'Merge Intervals',
    description: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    difficulty: 'Medium',
    tags: ['Arrays', 'Sorting'],
    testCases: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', expectedOutput: '[[1,5]]' }
    ],
    starterCode: {
      javascript: 'function merge(intervals) {\n  // Write your code here\n}',
      python: 'def merge(intervals):\n  # Write your code here',
      java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n    }\n};'
    }
  },
  {
    title: 'LRU Cache',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n- `int get(int key)` Return the value of the key if the key exists, otherwise return -1.\n- `void put(int key, int value)` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.',
    difficulty: 'Medium',
    tags: ['Linked Lists', 'Hash Table'],
    testCases: [
      { input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', expectedOutput: '[null, null, null, 1, null, -1, null, -1, 3, 4]' }
    ],
    starterCode: {
      javascript: 'class LRUCache {\n  constructor(capacity) {\n  }\n  get(key) {\n  }\n  put(key, value) {\n  }\n}',
      python: 'class LRUCache:\n  def __init__(self, capacity: int):\n    pass\n  def get(self, key: int) -> int:\n    pass\n  def put(self, key: int, value: int) -> None:\n    pass',
      java: 'class LRUCache {\n    public LRUCache(int capacity) {\n    }\n    public int get(int key) {\n    }\n    public void put(int key, int value) {\n    }\n}',
      cpp: 'class LRUCache {\npublic:\n    LRUCache(int capacity) {\n    }\n    int get(int key) {\n    }\n    void put(int key, int value) {\n    }\n};'
    }
  },
  {
    title: 'N-Queens',
    description: 'The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens\' placement, where `\'Q\'` and `\'.\'` both indicate a queen and an empty space, respectively.',
    difficulty: 'Hard',
    tags: ['Recursion', 'Backtracking'],
    testCases: [
      { input: 'n = 4', expectedOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: 'n = 1', expectedOutput: '[["Q"]]' }
    ],
    starterCode: {
      javascript: 'function solveNQueens(n) {\n  // Write your code here\n}',
      python: 'def solveNQueens(n):\n  # Write your code here',
      java: 'class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        // Write your code here\n    }\n};'
    }
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
    console.log('Connected to MongoDB for coding problem seeding.');

    for (const problem of problems) {
      const exists = await CodingProblem.findOne({ title: problem.title });
      if (!exists) {
        await CodingProblem.create(problem);
        created++;
        console.log(`Created problem: ${problem.title}`);
      } else {
        skipped++;
        console.log(`Skipped existing problem: ${problem.title}`);
      }
    }

    console.log(`\nSeed Summary:`);
    console.log(`- Problems created: ${created}`);
    console.log(`- Problems skipped (already exist): ${skipped}`);
    console.log('Done.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedDatabase();

export const mockCodingProblems = [
  { id: 'c1', title: 'Two Sum', difficulty: 'Easy', acceptance: '51%', tags: ['Array', 'Hash Table'] },
  { id: 'c2', title: 'Reverse Linked List', difficulty: 'Easy', acceptance: '75%', tags: ['Linked List', 'Recursion'] },
  { id: 'c3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: '34%', tags: ['Hash Table', 'String', 'Sliding Window'] },
  { id: 'c4', title: 'Merge k Sorted Lists', difficulty: 'Hard', acceptance: '52%', tags: ['Linked List', 'Divide and Conquer', 'Heap'] },
  { id: 'c5', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', acceptance: '40%', tags: ['Tree', 'DFS', 'Dynamic Programming'] },
];

export const mockProblemDetails = {
  id: 'c1',
  title: 'Two Sum',
  difficulty: 'Easy',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
  timeLimit: '2 Seconds',
  memoryLimit: '256 MB',
  sampleInput: 'nums = [2,7,11,15], target = 9',
  sampleOutput: '[0,1]',
  explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
  hints: ['A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it is best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.', 'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array keeping how a hashtable works?'],
};

export const mockSubmissions = [
  { id: 'sub1', problemId: 'c1', problemTitle: 'Two Sum', status: 'Accepted', runtime: '48 ms', memory: '42.1 MB', language: 'C++', date: '2026-07-24T10:00:00Z' },
  { id: 'sub2', problemId: 'c2', problemTitle: 'Reverse Linked List', status: 'Wrong Answer', runtime: 'N/A', memory: 'N/A', language: 'Python', date: '2026-07-23T15:30:00Z' },
  { id: 'sub3', problemId: 'c3', problemTitle: 'Longest Substring', status: 'Time Limit Exceeded', runtime: 'N/A', memory: 'N/A', language: 'Java', date: '2026-07-22T08:00:00Z' }
];
const fetch = require('node-fetch'); // For making API requests
const fs = require('fs'); // To read/write files

// Function to fetch problem data from LeetCode API
async function fetchLeetCodeProblemData() {
  // Read your local 'my-problem.json' file
  let myProblems;
  try {
    myProblems = JSON.parse(fs.readFileSync('my-problem.json', 'utf8'));
  } catch (error) {
    console.error('Error reading my-problem.json:', error);
    return;
  }

  // GraphQL query to get liked and disliked problem IDs
  const query = `
    query {
      userProfile {
        favoriteQuestionIds
        dislikedQuestionIds
      }
    }
  `;

  // Replace 'YOUR_ACCESS_TOKEN' with the token if needed (for private data)
  const response = await fetch('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Provide a valid token if required
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  if (data.errors) {
    console.error('Error fetching data:', data.errors);
    return;
  }

  const favoriteProblems = data.data.userProfile.favoriteQuestionIds;
  const dislikedProblems = data.data.userProfile.dislikedQuestionIds;

  // Fetch problem details from LeetCode API
  await updateProblemData(myProblems, favoriteProblems, dislikedProblems);
}

// Function to fetch detailed problem information and update with liked/disliked status
async function updateProblemData(myProblems, likedIds, dislikedIds) {
  const apiUrl = 'https://leetcode.com/api/problems/all/';
  const response = await fetch(apiUrl);
  const problems = await response.json();

  // Update problems with 'liked' and 'disliked' status
  const updatedProblems = myProblems.map(problem => {
    // Find the problem details based on the problem ID
    const problemDetails = problems.stat_status_pairs.find(p => p.stat.question_id === problem.id);

    if (problemDetails) {
      const isLiked = likedIds.includes(problemDetails.stat.question_id);
      const isDisliked = dislikedIds.includes(problemDetails.stat.question_id);

      // Add the 'liked' and 'disliked' fields to the problem object
      return {
        ...problem,
        liked: isLiked,
        disliked: isDisliked,
        title: problemDetails.stat.question__title,
        difficulty: problemDetails.stat.difficulty,
      };
    }
    return problem; // If problem details not found, return as is
  });

  // Save the updated data to a new JSON file
  fs.writeFileSync('updated-problems.json', JSON.stringify(updatedProblems, null, 2), 'utf8');
  console.log('Updated problem data saved to "updated-problems.json"');
}

// Run the script
fetchLeetCodeProblemData();

// backend/server.js
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PROBLEMS_FILE = path.join(__dirname, 'my-problems.json');

// Read problems from JSON file
const readProblems = async () => {
  const data = await fs.readFile(PROBLEMS_FILE, 'utf8');
  return JSON.parse(data);
};

// Write problems to JSON file
const writeProblems = async (problems) => {
  await fs.writeFile(PROBLEMS_FILE, JSON.stringify(problems, null, 2));
};

// Get all problems
app.get('/api/problems', async (req, res) => {
  try {
    console.log('Fetching problems...');
    const problems = await readProblems();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle problem status
app.patch('/api/problems/:id/toggle', async (req, res) => {
  try {
    console.log('Toggling problem status...');
    const problems = await readProblems();
    const updatedProblems = problems.map(problem => {
      if (problem._id === req.params.id) {
        return { 
          ...problem, 
          done: !problem.done,
          completedAt: !problem.done ? new Date().toISOString() : null
        };
      }
      return problem;
    });
    
    await writeProblems(updatedProblems);
    res.json(updatedProblems.find(p => p._id === req.params.id));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle red flag status
app.patch('/api/problems/:id/redflag', async (req, res) => {
  try {
    console.log('Toggling red flag status...');
    const problems = await readProblems();
    const updatedProblems = problems.map(problem => {
      if (problem._id === req.params.id) {
        return { 
          ...problem, 
          redFlag: !problem.redFlag
        };
      }
      return problem;
    });
    
    await writeProblems(updatedProblems);
    res.json(updatedProblems.find(p => p._id === req.params.id));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
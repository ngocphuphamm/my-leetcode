// backend/server.js
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

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

// Helper function for git operations
const gitCommitAndPush = () => {
  return new Promise((resolve, reject) => {
    exec('git add . && git commit -m "update" && git push', {
      cwd: path.join(__dirname, '..')  // Execute in parent directory
    }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Git error: ${error}`);
        reject(error);
        return;
      }
      console.log(`Git output: ${stdout}`);
      resolve(stdout);
    });
  });
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
    await gitCommitAndPush();
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
    await gitCommitAndPush();
    res.json(updatedProblems.find(p => p._id === req.params.id));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/problems/:id/priority', async (req, res) => {
  try {
    const { priority } = req.body;
    if (priority !== null && (typeof priority !== 'number' || priority < 1 || priority > 3)) {
      return res.status(400).json({ message: "Priority must be null or a number between 1 and 3" });
    }

    const problems = await readProblems();
    const updatedProblems = problems.map(problem => {
      if (problem._id === req.params.id) {
        return { ...problem, priority };
      }
      return problem;
    });

    await writeProblems(updatedProblems);
    await gitCommitAndPush();
    
    const updatedProblem = updatedProblems.find(p => p._id === req.params.id);
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    
    res.json(updatedProblem);
  } catch (error) {
    res.status(500).json({ message: "Error updating priority", error: error.message });
  }
});

app.delete('/api/problems/:id/priority', async (req, res) => {
  try {
    console.log('Removing priority...');
    const problems = await readProblems();
    const updatedProblems = problems.map(problem => {
      if (problem._id === req.params.id) {
        const { priority, ...problemWithoutPriority } = problem;
        return problemWithoutPriority;
      }
      return problem;
    });
    
    await writeProblems(updatedProblems);
    await gitCommitAndPush();
    
    const updatedProblem = updatedProblems.find(p => p._id === req.params.id);
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    
    res.json(updatedProblem);
  } catch (error) {
    res.status(500).json({ message: "Error removing priority", error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
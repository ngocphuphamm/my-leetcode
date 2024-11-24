// ProblemsList.jsx
import React from 'react';
import axios from 'axios';
import './ProblemList.css';

const API_URL = 'http://localhost:5000/api';

const ProblemsList = () => {
  const [problems, setProblems] = React.useState([]);
  const [recentlyCompleted, setRecentlyCompleted] = React.useState({});

  React.useEffect(() => {
    fetchProblems();
    // Load recently completed from localStorage
    const saved = localStorage.getItem('recentlyCompleted');
    if (saved) {
      setRecentlyCompleted(JSON.parse(saved));
    }
  }, []);

  const isCompletedRecently = (problem) => {
    if (!problem.completedAt) return false;
    const completedDate = new Date(problem.completedAt).toDateString();
    return recentlyCompleted[problem._id] === completedDate;
  };

  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems`);
      setProblems(response.data);
      
      // Update recently completed problems
      const newRecentlyCompleted = {};
      response.data.forEach(problem => {
        if (problem.done && problem.completedAt) {
          newRecentlyCompleted[problem._id] = new Date(problem.completedAt).toDateString();
        }
      });
      
      localStorage.setItem('recentlyCompleted', JSON.stringify(newRecentlyCompleted));
      setRecentlyCompleted(newRecentlyCompleted);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const toggleProblemStatus = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/problems/${id}/toggle`);
      setProblems(problems.map(problem => 
        problem._id === id ? response.data : problem
      ));
    } catch (error) {
      console.error('Error toggling problem status:', error);
    }
  };

  const toggleRedFlag = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/problems/${id}/redflag`);
      setProblems(problems.map(problem => 
        problem._id === id ? response.data : problem
      ));
    } catch (error) {
      console.error('Error toggling red flag status:', error);
    }
  };

  return (
    <div className="problems-container">
      <h2>Problems List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Level</th>
            <th>Categories</th>
            <th>Description</th>
            <th>Status</th>
            <th>Completed Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem._id} 
                className={`${isCompletedRecently(problem) ? 'recently-completed' : ''} 
                           ${problem.redFlag ? 'red-flagged' : ''}`}>
              <td>{index + 1}</td>
              <td>{problem.name}</td>
              <td>{problem.level}</td>
              <td>{problem.categories?.join(', ')}</td>
              <td>{problem.description}</td>
              <td>{problem.done ? '✅' : '❌'}</td>
              <td>{problem.completedAt ? new Date(problem.completedAt).toLocaleDateString() : '-'}</td>
              <td>
                <button 
                  onClick={() => toggleProblemStatus(problem._id)}
                  className={`status-btn ${problem.done ? 'done' : 'pending'}`}
                >
                  {problem.done ? 'Mark Undone' : 'Mark Done'}
                </button>
                <button 
                  onClick={() => toggleRedFlag(problem._id)}
                  className={`flag-btn ${problem.redFlag ? 'flagged' : ''}`}
                >
                  🚩
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemsList;
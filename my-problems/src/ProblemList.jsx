// ProblemsList.jsx
import React from 'react';
import axios from 'axios';
import './ProblemList.css';

const API_URL = 'http://localhost:5000/api';

const ProblemsList = () => {
  const [problems, setProblems] = React.useState([]);
  const [recentlyCompleted, setRecentlyCompleted] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Debounce function for API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

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
      setIsLoading(true);
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
      setError('Failed to fetch problems');
      console.error('Error fetching problems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProblemStatus = async (id) => {
    // Optimistic update
    const updatedProblems = problems.map(problem =>
      problem._id === id ? { ...problem, done: !problem.done } : problem
    );
    setProblems(updatedProblems);

    try {
      await axios.patch(`${API_URL}/problems/${id}/toggle`);
    } catch (error) {
      // Revert on error
      setProblems(problems);
      console.error('Error toggling problem status:', error);
    }
  };

  const toggleRedFlag = debounce(async (id) => {
    // Optimistic update
    const updatedProblems = problems.map(problem =>
      problem._id === id ? { ...problem, redFlag: !problem.redFlag } : problem
    );
    setProblems(updatedProblems);

    try {
      await axios.patch(`${API_URL}/problems/${id}/redflag`);
    } catch (error) {
      // Revert on error
      setProblems(problems);
      console.error('Error toggling red flag status:', error);
    }
  }, 300);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
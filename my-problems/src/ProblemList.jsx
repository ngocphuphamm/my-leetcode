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

  const handleTogglePriority = async (id, currentPriority) => {
    try {
      // Cycle through priority levels: 1 -> 2 -> 3 -> null
      const newPriority = currentPriority === 3 ? null : (currentPriority ? (currentPriority % 3) + 1 : 1);
      
      const response = await axios.put(`${API_URL}/problems/${id}/priority`, {
        priority: newPriority
      });

      if (response.data) {
        setProblems(problems.map(prob => 
          prob._id === id ? {...prob, priority: newPriority} : prob
        ));
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="problems-container">
      <h2>Problems Lisst</h2>
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
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem._id}
              className={`
        ${problem.done ? 'completed' : ''}
        ${isCompletedRecently(problem) ? 'recently-completed' : ''} 
        ${problem.redFlag ? 'red-flagged' : ''}
      `}>
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
              <td>
                <button
                  onClick={() => handleTogglePriority(problem._id, problem.priority)}
                  className={`priority-btn priority-${problem.priority || 0}`}
                >
                  {[...Array(problem.priority || 0)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                  {!problem.priority && '☆'}
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
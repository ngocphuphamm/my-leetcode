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
  const [showCategories, setShowCategories] = React.useState(true);
  const [sortBy, setSortBy] = React.useState('priority'); // Add new state for sorting

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
    // Load categories visibility preference
    const categoriesVisible = localStorage.getItem('showCategories');
    if (categoriesVisible !== null) {
      setShowCategories(JSON.parse(categoriesVisible));
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

  const handleRemovePriority = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/problems/${id}/priority`);

      if (response.data) {
        setProblems(problems.map(prob => 
          prob._id === id ? {...prob, priority: undefined} : prob
        ));
      }
    } catch (error) {
      console.error('Error removing priority:', error);
    }
  };

  const toggleCategoriesVisibility = () => {
    const newValue = !showCategories;
    setShowCategories(newValue);
    localStorage.setItem('showCategories', JSON.stringify(newValue));
  };

  const getSortedProblems = () => {
    return [...problems].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          // Sort by priority (3 -> 2 -> 1 -> no priority)
          return (b.priority || 0) - (a.priority || 0);
        case 'status':
          // Sort by completion status (done first)
          return b.done - a.done;
        case 'pending':
          // Sort by pending status (not done first)
          return a.done - b.done;
        case 'redFlag':
          // Sort by red flag status
          return (b.redFlag || 0) - (a.redFlag || 0);
        default:
          return 0;
      }
    });
  };

  const getStats = () => {
    const stats = {
      redFlag: 0,
      done: 0,
      notDone: 0,
      priority1: 0,
      priority2: 0,
      priority3: 0
    };

    problems.forEach(problem => {
      if (problem.redFlag) stats.redFlag++;
      if (problem.done) stats.done++;
      else stats.notDone++;
      if (problem.priority === 1) stats.priority1++;
      if (problem.priority === 2) stats.priority2++;
      if (problem.priority === 3) stats.priority3++;
    });

    return stats;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="problems-container">
      <div className="problems-header">
        <h2>Problems List</h2>
        <div className="controls">
          <button onClick={toggleCategoriesVisibility}>
            {showCategories ? 'Hide Categories' : 'Show Categories'}
          </button>
          <div className="sort-controls">
            <button 
              onClick={() => setSortBy('priority')}
              className={sortBy === 'priority' ? 'active' : ''}
            >
              Sort by Priority
            </button>
            <button 
              onClick={() => setSortBy('status')}
              className={sortBy === 'status' ? 'active' : ''}
            >
              Sort by Completed
            </button>
            <button 
              onClick={() => setSortBy('pending')}
              className={sortBy === 'pending' ? 'active' : ''}
            >
              Sort by Pending
            </button>
            <button 
              onClick={() => setSortBy('redFlag')}
              className={sortBy === 'redFlag' ? 'active' : ''}
            >
              Sort by Red Flag
            </button>
          </div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <span className="stat-label">Red Flags:</span>
          <span className="stat-value red">{getStats().redFlag}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Completed:</span>
          <span className="stat-value green">{getStats().done}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Pending:</span>
          <span className="stat-value yellow">{getStats().notDone}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Priority ⭐:</span>
          <span className="stat-value gold">{getStats().priority1}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Priority ⭐⭐:</span>
          <span className="stat-value gold">{getStats().priority2}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Priority ⭐⭐⭐:</span>
          <span className="stat-value gold">{getStats().priority3}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Level</th>
            {showCategories && <th>Categories</th>}
            <th>Description</th>
            <th>Status</th>
            <th>Completed Date</th>
            <th>Action</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {getSortedProblems().map((problem, index) => (
            <tr key={problem._id}
              className={`
        ${problem.done ? 'completed' : ''}
        ${isCompletedRecently(problem) ? 'recently-completed' : ''} 
        ${problem.redFlag ? 'red-flagged' : ''}
        ${problem.priority ? 'has-priority' : ''}
      `}>
              <td>{index + 1}</td>
              <td>{problem.name}</td>
              <td>{problem.level}</td>
              {showCategories && <td>{problem.categories?.join(', ')}</td>}
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
                <div className="priority-controls">
                  <button
                    onClick={() => handleTogglePriority(problem._id, problem.priority)}
                    className={`priority-btn priority-${problem.priority || 0}`}
                  >
                    {[...Array(problem.priority || 0)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                    {!problem.priority && '☆'}
                  </button>
                  {problem.priority && (
                    <button
                      onClick={() => handleRemovePriority(problem._id)}
                      className="remove-priority-btn"
                      title="Remove priority"
                    >
                      ×
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemsList;
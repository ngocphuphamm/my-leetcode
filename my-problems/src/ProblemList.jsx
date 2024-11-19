// ProblemsList.jsx
import React from 'react';
import axios from 'axios';
import './ProblemList.css';

const API_URL = 'http://localhost:5000/api';

const ProblemsList = () => {
  const [problems, setProblems] = React.useState([]);

  React.useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems`);
      setProblems(response.data);
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map(problem => (
            <tr key={problem._id}>
              <td>{problem._id}</td>
              <td>{problem.name}</td>
              <td>{problem.level}</td>
              <td>{problem.categories?.join(', ')}</td>
              <td>{problem.description}</td>
              <td>{problem.done ? '✅' : '❌'}</td>
              <td>
                <button 
                  onClick={() => toggleProblemStatus(problem._id)}
                  className={`status-btn ${problem.done ? 'done' : 'pending'}`}
                >
                  {problem.done ? 'Mark Undone' : 'Mark Done'}
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
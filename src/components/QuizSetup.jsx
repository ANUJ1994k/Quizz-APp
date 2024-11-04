import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizSetup = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const navigate = useNavigate();

  const startQuiz = () => {
    // Pass parameters as state or store in local storage
    navigate('/quiz', { state: { name, category, difficulty, numQuestions } });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' ,gap:"10px", display:"flex", flexDirection:"column" }}>
      <h2>Set up your Quiz Based on difficulty level</h2><br/>
      <input type="text" placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}><br/>
        <option value="">Select Category</option>
        <option value="9">General Knowledge</option>
        <option value="21">Sports</option>
        <option value="22">Geography</option>
      </select>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><br/>
        <option value="">Select Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <input type="number" placeholder="Number of Questions" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} />
      <button onClick={startQuiz} style={{ backgroundColor: '#e91e63', color: '#fff', marginTop: '10px' }}>START QUIZ</button>
    </div>
  );
};

export default QuizSetup;

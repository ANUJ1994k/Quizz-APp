import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, difficulty, numQuestions, name } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const initialTime = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : 30;
  const [timer, setTimer] = useState(initialTime);

  const fetchQuestions = async (retryCount = 3) => {
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`);
      if (response.status === 429) throw new Error("Too many requests");
      const data = await response.json();
      if (data.results) setQuestions(data.results);
    } catch (error) {
      if (retryCount > 0) {
        console.log("Retrying fetch...");
        setTimeout(() => fetchQuestions(retryCount - 1), 2000); // Retry after 2 seconds
      } else {
        console.error("Failed to fetch questions:", error);
      }
    }
  };

  useEffect(() => {
    const cacheKey = `questions_${category}_${difficulty}_${numQuestions}`;
    const cachedQuestions = localStorage.getItem(cacheKey);

    if (cachedQuestions) {
      setQuestions(JSON.parse(cachedQuestions));
    } else if (category && difficulty && numQuestions) {
      fetchQuestions();
    }
  }, [category, difficulty, numQuestions]);

  useEffect(() => {
    if (questions.length > 0) {
      const cacheKey = `questions_${category}_${difficulty}_${numQuestions}`;
      localStorage.setItem(cacheKey, JSON.stringify(questions));
    }
  }, [questions, category, difficulty, numQuestions]);

  useEffect(() => {
    if (questions.length > 0 && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer, questions]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore((prevScore) => prevScore + 1);
    handleNextQuestion();
  };

  // Handle going to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(initialTime);  // Reset timer for the next question
    } else {
      saveToLeaderboard();
      navigate('/leaderboard');
    }
  };

  // Save the user's score to the leaderboard
  const saveToLeaderboard = () => {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const newEntry = { name, score };
    leaderboardData.push(newEntry);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
  };

  return (
    <div className='Quizz'>
      {questions.length > 0 && (
        <div className='Quizz2'>
          <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <p>{questions[currentQuestionIndex].question}</p>
          <div>
            {questions[currentQuestionIndex].incorrect_answers.map((answer, index) => (
              <button key={index} onClick={() => handleAnswer(false)}  style={{marginLeft:"10px"}}>{answer}</button>
            ))}
            <button onClick={() => handleAnswer(true)} style={{marginLeft:"10px"}}>{questions[currentQuestionIndex].correct_answer}</button>
          </div>
          <div style={{marginTop:"10px"}}>Time Remaining: {timer} seconds</div>
          <button onClick={handleNextQuestion}  style={{marginTop:"10px"}}>Next</button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;

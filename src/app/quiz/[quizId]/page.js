'use client';
import { useState, useEffect, useRef } from "react";

import { quiz } from "@/constant.js";

export default function QuizPage() {
  const { multiple_choice_questions, integer_questions } = quiz;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [integerAnswer, setIntegerAnswer] = useState("");
  const timerRef = useRef(null);

  const allQuestions = [...multiple_choice_questions, ...integer_questions];

  const handleAnswerSelect = (questionId, answer) => {
    const currentQuestion = allQuestions[questionId];
    let isCorrect = false;

    if (currentQuestion.options) {
     
      const correctOptionIndex = currentQuestion.answer.charCodeAt(0) - 65; 
      const correctAnswer = currentQuestion.options[correctOptionIndex];
      isCorrect = answer === correctAnswer;
    } else {
      
      isCorrect = answer === currentQuestion.answer;
    }

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setFeedback(isCorrect ? "Correct! 🎉" : "Incorrect! ❌");

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

   
    setTimeout(() => {
      if (currentQuestionIndex < allQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(30);
        setFeedback("");
        setIntegerAnswer(""); 
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      setFeedback("Time's up! ⏰");
      setTimeout(() => {
        if (currentQuestionIndex < allQuestions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTimeLeft(30);
          setFeedback("");
          setIntegerAnswer(""); // Reset integer input
        } else {
          setQuizCompleted(true);
        }
      }, 1000);
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, quizCompleted]);


const saveQuizHistory = async () => {
  const dbRequest = indexedDB.open("QuizHistoryDB", 2);

  dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("quizHistory")) {
      db.createObjectStore("quizHistory", { keyPath: "id", autoIncrement: true });
      console.log("Object store 'quizHistory' created.");
    }
  };

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("quizHistory", "readwrite");
    const store = transaction.objectStore("quizHistory");


    const quizResult = {
      date: new Date().toISOString(),
      score,
      totalQuestions: allQuestions.length,
    };

    const request = store.add(quizResult);

    request.onsuccess = () => {
      console.log("Quiz result saved to IndexedDB:", quizResult);
    };

    request.onerror = (error) => {
      console.error("Error saving quiz result:", error);
    };
  };

  dbRequest.onerror = (error) => {
    console.error("Error opening IndexedDB:", error);
  };
};
  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFeedback("");
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
    setIntegerAnswer(""); 
  };
  if (quizCompleted) {
    saveQuizHistory();
      return (
        <section className="max-w-3xl mx-auto p-8 bg-white shadow-lg mt-4 rounded-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🎉 Quiz Completed!</h1>
          <p className="text-xl font-semibold text-gray-700">
            Your Score: <span className="text-fuchsia-600">{score}</span> / {allQuestions.length}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-all"
          >
            🔄 Restart Quiz
          </button>
        </section>
      );
    }
  
    const currentQuestion = allQuestions[currentQuestionIndex];
  
    return (
      <section className="max-w-3xl mx-auto p-6 bg-white rounded-lg mt-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🧠 Quiz Time!</h1>
  
        {/* Progress Bar */}
        <div className="relative w-full bg-gray-300 rounded-full h-2 mb-4">
          <div
            className="absolute top-0 left-0 h-2 bg-fuchsia-500 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
          ></div>
        </div>
  
        {/* Timer */}
        <div className="flex justify-center items-center space-x-2 mb-4">
          <span className="text-lg font-medium text-gray-700">⏳ Time Left:</span>
          <span className={`text-lg font-bold ${timeLeft < 10 ? "text-red-500" : "text-fuchsia-500"}`}>
            {timeLeft} sec
          </span>
        </div>
  
        {/* Feedback */}
        {feedback && (
          <div className="mb-4 text-center transition-all">
            <p className={`text-xl font-semibold ${feedback.includes("Correct") ? "text-green-500" : "text-red-500"}`}>
              {feedback}
            </p>
          </div>
        )}
  
        {/* Current Question */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-sm">
          <p className="text-lg font-semibold mb-4">
            {`${currentQuestionIndex + 1}. ${currentQuestion.question}`}
          </p>
  
          {/* Multiple Choice Questions */}
          {currentQuestion.options ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-left hover:bg-fuchsia-500 hover:text-white transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            // Integer Questions
            <div className="flex flex-col items-center">
              <input
                type="number"
                value={integerAnswer}
                onChange={(e) => setIntegerAnswer(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring focus:ring-fuchsia-300"
                placeholder="Enter your answer"
              />
              <button
                onClick={() => handleAnswerSelect(currentQuestionIndex, parseInt(integerAnswer))}
                className="px-8 py-3 text-lg font-semibold bg-gradient-to-br from-[#ca05c6] to-[#582ea1] text-white  w-80 rounded-full mt-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
  
        <div className="text-center mt-6">
          <p className="text-lg text-gray-700">
            Question {currentQuestionIndex + 1} of {allQuestions.length}
          </p>
        </div>
      </section>
    );
  }

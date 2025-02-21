'use client'
import { useEffect, useState } from "react";

export default function QuizHistoryPage() {
  const [quizHistory, setQuizHistory] = useState([]);

  // Fetch quiz history from IndexedDB
  useEffect(() => {
    const dbRequest = indexedDB.open("QuizHistoryDB", 2);

    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("quizHistory")) {
        // Create the object store if it doesn't exist
        db.createObjectStore("quizHistory", { keyPath: "id", autoIncrement: true });
      }
    };

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("quizHistory", "readonly");
      const store = transaction.objectStore("quizHistory");
      const request = store.getAll();

      request.onsuccess = () => {
        setQuizHistory(request.result);
      };

      request.onerror = () => {
        console.error("Error fetching quiz history");
      };
    };

    dbRequest.onerror = () => {
      console.error("Error opening IndexedDB");
    };
  }, []);

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg mt-4 shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Quiz History</h1>

      {quizHistory.length === 0 ? (
        <p className="text-center text-gray-500">No quiz history found.</p>
      ) : (
        <div className="space-y-4">
          {quizHistory.map((quiz, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="font-medium">
                <span className="text-blue-500">Quiz #{index + 1}</span> -{" "}
                {new Date(quiz.date).toLocaleString()}
              </p>
              <p>
                Score: {quiz.score} / {quiz.totalQuestions}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
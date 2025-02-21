'use client'
import { useRouter } from "next/navigation";


export default function Quizzes() {
  const router= useRouter();

  return (
    <div className="flex flex-col items-center mt-20 min-h-screen font-poppins text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 ">List of Quizzes</h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-8  ">Click on the desired quiz to start</p>
      
      <a
      className="bg-white rounded-lg shadow-lg p-5 flex items-center justify-between cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        href={`/quiz/1`}
        onClick={(e) => {
          e.preventDefault();
          router.push(`/quiz/1`);
        }}
      >
        <h2 className="text-3xl font-semibold z ">1 - Sample Quiz</h2>
      </a>
    </div>
  );
}
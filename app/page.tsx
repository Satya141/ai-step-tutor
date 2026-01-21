"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [selectedClass, setSelectedClass] = useState("");
  const [board, setBoard] = useState("");
  const [subject, setSubject] = useState("");

  const startLearning = () => {
    if (!selectedClass || !board || !subject) return;

    router.push(
      `/tutor?class=${selectedClass}&board=${board}&subject=${subject}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          AI Step Tutor
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Personalized step-by-step learning
        </p>

        {/* CLASS */}
        <label className="block mb-1 font-semibold text-gray-800">
          Select Class
        </label>
        <select
          className="w-full mb-4 rounded-lg border border-gray-400 bg-white text-gray-900 font-medium px-3 py-2"
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Choose Class</option>
          {[6, 7, 8, 9, 10, 11, 12].map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>

        {/* BOARD */}
        <label className="block mb-1 font-semibold text-gray-800">
          Select Board
        </label>
        <select
          className="w-full mb-4 rounded-lg border border-gray-400 bg-white text-gray-900 font-medium px-3 py-2"
          onChange={(e) => setBoard(e.target.value)}
        >
          <option value="">Choose Board</option>
          <option value="cbse">CBSE</option>
          <option value="icse">ICSE</option>
          <option value="state">State Board</option>
        </select>

        {/* SUBJECT */}
        <label className="block mb-1 font-semibold text-gray-800">
          Select Subject
        </label>
        <select
          className="w-full mb-6 rounded-lg border border-gray-400 bg-white text-gray-900 font-medium px-3 py-2"
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Choose Subject</option>
          <option value="maths">Maths</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
          <option value="biology">Biology</option>
        </select>

        <button
          onClick={startLearning}
          disabled={!selectedClass || !board || !subject}
          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
            selectedClass && board && subject
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}


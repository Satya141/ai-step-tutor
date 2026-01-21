"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { subjectThemes, subjectBackgrounds } from "@/lib/themes";
import { loadHistory, saveHistory } from "@/lib/storage";

interface Message {
  role: "student" | "assistant";
  content: string;
}

export default function TutorPage() {
  const params = useSearchParams();
  const router = useRouter();
  
  const subject = params.get("subject") || "maths";
  const classLevel = params.get("class") || "";
  const board = params.get("board") || "";
  const theme = subjectThemes[subject] || "blue";
  const bgImage = subjectBackgrounds[subject];

  const [problem, setProblem] = useState("");
  const [studentStep, setStudentStep] = useState("");
  const [stepNumber, setStepNumber] = useState(1);
  const [mode, setMode] = useState<"idle" | "learning">("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Load chat history when subject changes
  useEffect(() => {
    const history = loadHistory(subject);
    setMessages(history);
    if (history.length > 0) {
      setMode("learning");
    }
  }, [subject]);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveHistory(subject, messages);
    }
  }, [messages, subject]);

  const submitStep = async () => {
    if (!studentStep.trim()) return;

    setMessages(prev => [...prev, { role: "student", content: studentStep }]);
    setLoading(true);

    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem,
        studentStep,
        stepNumber,
        mode: "step",
      }),
    });

    const data = await res.json();

    setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    setStepNumber(prev => prev + 1);
    setStudentStep("");
    setLoading(false);
  };

  const startSession = async () => {
    if (!problem.trim()) return;

    setMode("learning");
    setMessages([]);
    setStepNumber(1);
    setLoading(true);

    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem,
        mode: "concept",
      }),
    });

    const data = await res.json();

    setMessages([{ role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none', backgroundColor: '#f9fafb' }}
    >
      <div className="max-w-3xl mx-auto bg-white bg-opacity-95 rounded-xl p-6 shadow-2xl">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-4 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Step Tutor
            {subject && (
              <span className={`ml-3 text-2xl ${
                theme === "blue" ? "text-blue-600" :
                theme === "purple" ? "text-purple-600" :
                theme === "green" ? "text-green-600" :
                "text-teal-600"
              }`}>
                • {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </span>
            )}
          </h1>
          <div className={`h-1 w-20 mx-auto mt-2 rounded ${
            theme === "blue" ? "bg-blue-600" :
            theme === "purple" ? "bg-purple-600" :
            theme === "green" ? "bg-green-600" :
            "bg-teal-600"
          }`}></div>
          <p className="text-gray-600 mt-3">
            Learn step-by-step instead of getting full answers
          </p>
          {classLevel && board && (
            <p className="text-sm text-gray-500 mt-1">
              Class {classLevel} • {board.toUpperCase()}
            </p>
          )}
        </div>

        {mode === "idle" ? (
          <>
            {/* Problem Card - Setup */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">📝 Enter Your Problem</h2>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full rounded-lg border border-blue-300 px-4 py-3 text-gray-900 font-semibold placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows={4}
                placeholder="Type your problem here (e.g. Solve: 2x + 3 = 7)"
              />
              <button
                onClick={startSession}
                disabled={!problem.trim()}
                className={`w-full text-white px-6 py-3 rounded-lg font-semibold text-lg hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition ${
                  theme === "blue" ? "bg-blue-600 hover:bg-blue-700" :
                  theme === "purple" ? "bg-purple-600 hover:bg-purple-700" :
                  theme === "green" ? "bg-green-600 hover:bg-green-700" :
                  "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                🚀 Start Learning
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 How it works</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Enter your problem above</li>
                <li>• Get step-by-step guidance from AI</li>
                <li>• Submit your steps one by one</li>
                <li>• Learn by doing, not just seeing answers</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Problem Card - Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6">
              <h2 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Problem
              </h2>
              <p className="text-xl font-bold text-gray-900">
                {problem}
              </p>
            </div>

            {/* Student Input Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="flex items-center gap-2 text-sm font-bold text-indigo-700 uppercase tracking-wide mb-2">
                ✍️ Your Step
              </h2>

              <input
                type="text"
                className="w-full rounded-lg border border-indigo-300 px-4 py-3 text-gray-800 text-base placeholder:text-indigo-400 caret-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="Type your next step here…"
                value={studentStep}
                onChange={(e) => setStudentStep(e.target.value)}
                disabled={loading}
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={submitStep}
                  disabled={!studentStep.trim() || loading}
                  className={`flex-1 text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition ${
                    theme === "blue" ? "bg-blue-600 hover:bg-blue-700" :
                    theme === "purple" ? "bg-purple-600 hover:bg-purple-700" :
                    theme === "green" ? "bg-green-600 hover:bg-green-700" :
                    "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  {loading ? "Loading..." : "Submit Step"}
                </button>
                <button
                  onClick={() => {
                    setMode("idle");
                    setMessages([]);
                    setStudentStep("");
                    setStepNumber(1);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* AI Tutor Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                🤖 Tutor Response
              </h2>

              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  Your AI tutor will respond here after you submit your steps.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        msg.role === "assistant"
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "bg-gray-100 border-l-4 border-gray-400 text-right"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {msg.role === "assistant" ? "🤖 AI Tutor" : "👤 You"}
                      </p>
                      <p className="text-sm whitespace-pre-line text-gray-900">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                  {loading && (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-gray-600 italic">
                        Tutor is thinking...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat History Section */}
            {messages.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  📜 Chat History: {messages.length} message{messages.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-xs text-gray-600">
                  Your conversation is automatically saved for this subject.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

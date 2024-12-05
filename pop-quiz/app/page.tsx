"use client";

import { useState, useEffect } from "react";

interface Question {
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  answer: string;
}

const Quiz = () => {
  const [timerCounter, setTimerCounter] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [userName, setUserName] = useState("");
  const [quizQuestions] = useState<Question[]>([
    {
      question: "What does HTML stand for?",
      choiceA: "Hyper Text Makeup language",
      choiceB: "Henry Talks More than Larry",
      choiceC: "Hyper Text Markup Language",
      choiceD: "Hummus Taste More Love",
      answer: "Hyper Text Markup Language",
    },
    {
      question: "As of 2023, what's the most populated city in the world?",
      choiceA: "Tookyoo 東京",
      choiceB: "New York City ニューヨーク",
      choiceC: "Itaewon  イテウォン",
      choiceD: "Rio de Janeiro",
      answer: "Tookyoo 東京",
    },
    {
      question: "Whats the fastest animal in world? ",
      choiceA: "The Red-snapping Turtle ",
      choiceB: "The Pronghorn ",
      choiceC: "The Cheetah ",
      choiceD: "The Peregrine Falcon ",
      answer: "The Peregrine Falcon ",
    },
    {
      question: "On record, how fast can a Cheetah run? ",
      choiceA: "220 MPH - 240 MPH",
      choiceB: "150 MPH - 180 MPH",
      choiceC: "50km/h - 75 km/h",
      choiceD: "110 km/h - 120km/h",
      answer: "110 km/h - 120km/h",
    },
    {
      question: "Whats the capital of Colombia",
      choiceA: "Bogoto",
      choiceB: "Cali",
      choiceC: "Medellin",
      choiceD: "Bogota",
      answer: "Bogota",
    },
  ]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showScores, setShowScores] = useState(false);
  const [savedScores, setSavedScores] = useState<any[]>([]); // To hold saved scores
  const [isAnswerSelected, setIsAnswerSelected] = useState(false); // Track if an answer is selected

  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // Start the quiz and initialize the timer
  const startQuiz = () => {
    setIsQuizStarted(true);
    const newTimerId = setInterval(() => {
      setTimerCounter((prev) => {
        if (prev <= 1) {
          clearInterval(newTimerId);
          endQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerId(newTimerId); // Store timerId to clear later if needed
  };

  // End the quiz and display results
  const endQuiz = () => {
    if (timerId) clearInterval(timerId); // Ensure timer is cleared
    setIsQuizEnded(true);
  };

  // Check the user's answer and update score/timer accordingly
  const checkAnswer = (answer: string) => {
    if (isAnswerSelected) return; // Prevent further clicks after answer is selected
    setIsAnswerSelected(true); // Mark that an answer has been selected

    if (answer === quizQuestions[currentQuestion].answer) {
      setScore((prev) => prev + 5);
      setFeedbackMessage("Nice job! You got it right!");
    } else {
      setTimerCounter((prev) => Math.max(prev - 5, 0));
      setFeedbackMessage("Aw, better luck on the next question :(");
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setFeedbackMessage(""); // Reset feedback message
        setIsAnswerSelected(false); // Allow selecting an answer for the next question
      }, 1000);
    } else {
      endQuiz();
    }
  };

  // Save the score to localStorage
  const saveScore = () => {
    if (!userName) return; // Ensure username is provided before saving
    const scores = JSON.parse(localStorage.getItem("codequiz") || "[]");
    const newScore = { user: userName, finalScore: score };
    scores.push(newScore);
    localStorage.setItem("codequiz", JSON.stringify(scores));
    setSavedScores(scores); // Update the savedScores state
  };

  // Reset the quiz state to allow retaking the quiz
  const retakeQuiz = () => {
    setIsQuizStarted(false);
    setIsQuizEnded(false);
    setScore(0);
    setTimerCounter(60);
    setCurrentQuestion(0);
    setUserName("");
    setFeedbackMessage(""); // Reset feedback message
    if (timerId) clearInterval(timerId); // Clear the previous timer
  };

  useEffect(() => {
    // Load saved scores from localStorage when the component mounts
    const scores = JSON.parse(localStorage.getItem("codequiz") || "[]");
    setSavedScores(scores);
  }, []);

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center bg-white text-black p-6 rounded-3xl shadow-lg mx-auto">
        <header className="bg-info text-center text-black py-3 px-5">
          <h1 className="text-2xl font-bold">Pop Quiz</h1>
        </header>
        {!isQuizStarted && !isQuizEnded ? (
          <section className="text-center">
            <p className="py-3 px-5">Click "Start Quiz" to begin</p>
            <button
              onClick={startQuiz}
              className="bg-blue-500 text-white py-2 px-4 rounded-2xl"
            >
              Start Quiz
            </button>
          </section>
        ) : null}
        {isQuizStarted && !isQuizEnded ? (
          <section className="mb-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl">Time Left: {timerCounter}s</h3>
              <h3 className="text-xl">Score: {score}</h3>
            </div>
            <div className="text-center">
              <h2 className="text-2xl">
                {quizQuestions[currentQuestion].question}
              </h2>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <button
                  onClick={() =>
                    checkAnswer(quizQuestions[currentQuestion].choiceA)
                  }
                  disabled={isAnswerSelected}
                  className="bg-blue-600 text-black py-2 px-4 rounded-2xl"
                >
                  {quizQuestions[currentQuestion].choiceA}
                </button>
                <button
                  disabled={isAnswerSelected}
                  onClick={() =>
                    checkAnswer(quizQuestions[currentQuestion].choiceB)
                  }
                  className="bg-blue-600 text-black py-2 px-4 rounded-2xl"
                >
                  {quizQuestions[currentQuestion].choiceB}
                </button>
                <button
                  disabled={isAnswerSelected}
                  onClick={() =>
                    checkAnswer(quizQuestions[currentQuestion].choiceC)
                  }
                  className="bg-blue-600 text-black py-2 px-4 rounded-2xl"
                >
                  {quizQuestions[currentQuestion].choiceC}
                </button>
                <button
                  disabled={isAnswerSelected}
                  onClick={() =>
                    checkAnswer(quizQuestions[currentQuestion].choiceD)
                  }
                  className="bg-blue-600 text-black py-2 px-4 rounded-2xl"
                >
                  {quizQuestions[currentQuestion].choiceD}
                </button>
              </div>
            </div>
            {feedbackMessage && (
              <div className="mt-4 text-xl font-semibold text-center text-green-500">
                {feedbackMessage}
              </div>
            )}
          </section>
        ) : null}
        {isQuizEnded && (
          <div className="w-full flex flex-col items-center justify-center  ">
            <h4>Your Final score: {score}</h4>
            <input
              type="text"
              placeholder="Enter Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-4 p-2 border border-gray-300 rounded-2xl "
            />
            <div className="">
              <button
                onClick={saveScore}
                className="bg-green-500 text-black py-2 px-4 rounded-2xl mt-4 mr-2"
              >
                Save Score
              </button>
              <button
                onClick={retakeQuiz}
                className="bg-gray-500 text-white py-2 px-4 rounded-2xl mt-4"
              >
                Retake Quiz
              </button>
            </div>
            <div className="flex flex-col items-center justify-center my-5 cursor-pointer text-black rounded-3xl shadow-lg">
              <button
                onClick={() => {
                  setShowScores((prev) => !prev);
                }}
                className="flex flex-col items-center justify-center bg-red-500 text-white py-2 px-4 rounded-3xl"
              >
                {showScores ? "Close Score History" : "Show Score History"}
              </button>
            </div>
          </div>
        )}
      </div>

      {showScores && (
        <div className="w-full h-72 flex flex-col items-center justify-center my-5 bg-white text-black overflow-hidden rounded-3xl shadow-lg ">
          <h3 className="text-xl font-semibold underline underline-offset-2 py-3">
            Saved Scores
          </h3>

          <div className="w-full h-full flex flex-col items-center justify-start pb-5 bg-white text-black overflow-scroll">
            <ul>
              {savedScores.map((scoreEntry, index) => (
                <li key={index} className="mb-2">
                  {scoreEntry.user}: {scoreEntry.finalScore} points
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;

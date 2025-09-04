import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, RotateCcw, Trophy, Target } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizState {
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  score: number;
  timeRemaining: number;
  isFinished: boolean;
  showResult: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 6,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 7,
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
    correctAnswer: 2,
    difficulty: 'hard'
  },
  {
    id: 8,
    question: "Which programming language is known for its use in data science?",
    options: ["JavaScript", "Python", "C++", "Java"],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 9,
    question: "What is the hardest natural substance on Earth?",
    options: ["Quartz", "Granite", "Diamond", "Titanium"],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 10,
    question: "In which ocean is the Bermuda Triangle located?",
    options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    correctAnswer: 1,
    difficulty: 'easy'
  }
];

const QUIZ_DURATION = 300; // 5 minutes in seconds

function App() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: new Array(questions.length).fill(null),
    score: 0,
    timeRemaining: QUIZ_DURATION,
    isFinished: false,
    showResult: false
  });

  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isStarted && !quizState.isFinished && quizState.timeRemaining > 0) {
      timer = setTimeout(() => {
        setQuizState(prev => {
          if (prev.timeRemaining <= 1) {
            return { ...prev, timeRemaining: 0, isFinished: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isStarted, quizState.timeRemaining, quizState.isFinished]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showResult) return;
    
    const newAnswers = [...quizState.selectedAnswers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: newAnswers,
      showResult: true
    }));

    // Auto advance after showing result
    setTimeout(() => {
      if (quizState.currentQuestion === questions.length - 1) {
        // Quiz finished
        calculateScore(newAnswers);
      } else {
        setQuizState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          showResult: false
        }));
      }
    }, 1500);
  };

  const calculateScore = (answers: (number | null)[]) => {
    const correctCount = answers.reduce<number>((score, answer, index) => {
      return answer === questions[index].correctAnswer ? score + 1 : score;
    }, 0);

    setQuizState(prev => ({
      ...prev,
      score: typeof correctCount === 'number' ? correctCount : 0,
      isFinished: true
    }));
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: new Array(questions.length).fill(null),
      score: 0,
      timeRemaining: QUIZ_DURATION,
      isFinished: false,
      showResult: false
    });
    setIsStarted(false);
  };

  const goToPreviousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        showResult: false
      }));
    }
  };

  const goToNextQuestion = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showResult: false
      }));
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Trophy className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Knowledge Quiz</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Test your knowledge with our interactive quiz featuring 10 carefully crafted questions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">10</div>
                <div className="text-gray-700 font-medium">Questions</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">5</div>
                <div className="text-gray-700 font-medium">Minutes</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">Mixed</div>
                <div className="text-gray-700 font-medium">Difficulty</div>
              </div>
            </div>

            <button
              onClick={() => setIsStarted(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizState.isFinished) {
    const percentage = Math.round((quizState.score / questions.length) * 100);
    const getGrade = () => {
      if (percentage >= 90) return { grade: 'A+', message: 'Outstanding!', color: 'text-green-600' };
      if (percentage >= 80) return { grade: 'A', message: 'Excellent!', color: 'text-green-600' };
      if (percentage >= 70) return { grade: 'B', message: 'Good Job!', color: 'text-blue-600' };
      if (percentage >= 60) return { grade: 'C', message: 'Not Bad!', color: 'text-yellow-600' };
      return { grade: 'D', message: 'Keep Studying!', color: 'text-red-600' };
    };

    const gradeInfo = getGrade();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                percentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <Trophy className={`w-12 h-12 ${
                  percentage >= 70 ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
              <p className={`text-2xl font-semibold ${gradeInfo.color} mb-2`}>{gradeInfo.message}</p>
              <p className="text-lg text-gray-600">You've finished the knowledge quiz</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {quizState.score}/{questions.length}
                </div>
                <div className="text-gray-700 font-medium">Correct Answers</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8">
                <div className={`text-4xl font-bold ${gradeInfo.color} mb-2`}>
                  {gradeInfo.grade}
                </div>
                <div className="text-gray-700 font-medium">Final Grade</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="text-lg font-semibold text-gray-800 mb-4">Score Breakdown</div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Percentage:</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Used:</span>
                  <span className="font-semibold">{formatTime(QUIZ_DURATION - quizState.timeRemaining)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Answered:</span>
                  <span className="font-semibold">{questions.length}</span>
                </div>
              </div>
            </div>

            <button
              onClick={restartQuiz}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <RotateCcw className="w-5 h-5" />
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / questions.length) * 100;
  const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Quiz</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Target className="w-5 h-5" />
                <span className="font-medium">
                  Question {quizState.currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono font-medium">
                  {formatTime(quizState.timeRemaining)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 min-h-[500px] flex flex-col">
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-4">
              {currentQ.options.map((option, index) => {
                let buttonClass = "w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-[1.02] font-medium text-lg";
                
                if (!quizState.showResult) {
                  buttonClass += " border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md";
                } else {
                  if (index === currentQ.correctAnswer) {
                    buttonClass += " border-green-500 bg-green-50 text-green-800";
                  } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                    buttonClass += " border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += " border-gray-200 bg-gray-50 text-gray-600";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={quizState.showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {quizState.showResult && (
                        <div>
                          {index === currentQ.correctAnswer && (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          )}
                          {index === selectedAnswer && index !== currentQ.correctAnswer && (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={goToPreviousQuestion}
              disabled={quizState.currentQuestion === 0}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index < quizState.currentQuestion ? 'bg-green-500' :
                    index === quizState.currentQuestion ? 'bg-blue-500' :
                    'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNextQuestion}
              disabled={quizState.currentQuestion === questions.length - 1}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
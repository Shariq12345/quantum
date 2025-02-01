"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Lightbulb, RefreshCcw } from "lucide-react";

// Quiz Data
const quizQuestions = [
  {
    question: "What does 'bull market' mean?",
    options: [
      "A market with declining stock prices",
      "A market with rising stock prices",
      "A market with stable prices",
      "A cryptocurrency term",
    ],
    correctAnswer: "A market with rising stock prices",
    tip: "A 'bull market' indicates optimism, with stock prices trending upwards.",
  },
  {
    question: "What is a stock dividend?",
    options: [
      "A company's profit shared with stockholders",
      "A fee for trading stocks",
      "A type of bond",
      "The price of a stock when it’s first sold",
    ],
    correctAnswer: "A company's profit shared with stockholders",
    tip: "Dividends are payments made by companies to reward their shareholders.",
  },
  {
    question: "Which stock index tracks the top 500 U.S. companies?",
    options: ["NASDAQ", "Dow Jones", "S&P 500", "FTSE 100"],
    correctAnswer: "S&P 500",
    tip: "The S&P 500 represents the largest 500 companies in the U.S. economy.",
  },
  {
    question: "What does 'P/E ratio' stand for?",
    options: [
      "Price/Earnings Ratio",
      "Profit/Evaluation Ratio",
      "Portfolio/Equity Ratio",
      "Performance/Earnings Ratio",
    ],
    correctAnswer: "Price/Earnings Ratio",
    tip: "The P/E ratio helps investors understand if a stock is overvalued or undervalued.",
  },
];

const StockMarketQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const question = quizQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  // Handle answer selection
  const handleAnswer = (option: string) => {
    if (!isAnswered) {
      setSelectedAnswer(option);
      setIsAnswered(true);
      if (option === question.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  // Restart Quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pt-[120px] pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Stock Market Quiz
        </h1>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-6" />

        {/* Quiz Card */}
        <Card className="p-6 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full p-4 text-left rounded-lg transition-all ${
                    isAnswered
                      ? option === question.correctAnswer
                        ? "bg-green-500 text-white"
                        : option === selectedAnswer
                          ? "bg-red-500 text-white"
                          : "opacity-50"
                      : "hover:bg-gray-200"
                  }`}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Answer Feedback */}
            {isAnswered && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg flex items-center space-x-4">
                {isCorrect ? (
                  <CheckCircle className="text-green-500 h-6 w-6" />
                ) : (
                  <XCircle className="text-red-500 h-6 w-6" />
                )}
                <p className="text-gray-700">
                  {isCorrect
                    ? "Correct!"
                    : `Wrong! The correct answer is: ${question.correctAnswer}`}
                </p>
              </div>
            )}

            {/* Tip */}
            {isAnswered && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg flex items-center space-x-4">
                <Lightbulb className="text-yellow-500 h-6 w-6" />
                <p className="text-gray-700">{question.tip}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              {currentQuestion < quizQuestions.length - 1 ? (
                <Button
                  variant="default"
                  disabled={!isAnswered}
                  onClick={nextQuestion}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="default"
                  disabled={!isAnswered}
                  onClick={restartQuiz}
                  className="flex items-center"
                >
                  <RefreshCcw className="mr-2 h-5 w-5" />
                  Restart Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Score Display at End */}
        {currentQuestion === quizQuestions.length - 1 && isAnswered && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold">
              Your Score: {score} / {quizQuestions.length}
            </h2>
            <p className="text-gray-600">
              {score > 3
                ? "Great job! You're a stock market pro!"
                : score > 1
                  ? "Not bad! Keep learning and improving."
                  : "Keep practicing! The stock market can be tricky."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockMarketQuiz;

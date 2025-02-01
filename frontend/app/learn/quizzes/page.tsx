"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, PlayCircle } from "lucide-react";

const quizzes = [
  {
    title: "Stock Market Basics",
    description: "Test your knowledge on fundamental stock market concepts.",
    link: "/learn/quizzes/stock-market",
  },
  {
    title: "Investment Strategies",
    description:
      "Learn about different investment approaches and risk factors.",
    link: "/quizzes/investment-strategies",
  },
  {
    title: "Financial Terms",
    description: "Check how well you understand common financial terminology.",
    link: "/quizzes/financial-terms",
  },
  {
    title: "Personal Finance",
    description: "Assess your understanding of personal budgeting and savings.",
    link: "/quizzes/personal-finance",
  },
  {
    title: "Risk Management",
    description:
      "Evaluate your knowledge of financial risk and how to handle it.",
    link: "/quizzes/risk-management",
  },
  {
    title: "Cryptocurrency",
    description:
      "See how much you know about Bitcoin, Ethereum, and other cryptos.",
    link: "/quizzes/cryptocurrency",
  },
];

const QuizPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pt-[120px] pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Quizzes</h1>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Quiz Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz, index) => (
            <Card
              key={index}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
            >
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{quiz.description}</p>
              </CardContent>

              {/* Hover Overlay with Play Button */}
              <Link href={quiz.link} passHref>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="secondary" className="flex items-center">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Start Quiz
                  </Button>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredQuizzes.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No quizzes found. Try a different search.
          </p>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link href="/learn" passHref>
            <Button variant="outline" className="inline-flex items-center">
              <ArrowLeft className="mr-2" size={16} />
              Back to Learn
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

"use client";

import React from "react";
import Link from "next/link";
import {
  BookmarkIcon,
  Calculator,
  MessageCircle,
  MessageCircleIcon,
  MessageCircleQuestionIcon,
  YoutubeIcon,
} from "lucide-react";

// Data for the cards
const cardData = [
  {
    title: "Glossary",
    description:
      "Explore key market terms and their definitions to enhance your financial knowledge.",
    href: "/learn/glossary",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Videos",
    description:
      "Watch educational videos on a variety of financial topics to help you learn more.",
    href: "/learn/videos",
    icon: <YoutubeIcon size={49} className="text-red-500" />,
  },
  {
    title: "Beginner Guides",
    description:
      "Explore beginner guides to help you get started with investing.",
    href: "/learn/beginner-guides",
    icon: <BookmarkIcon size={49} className="text-green-500" />,
  },
  {
    title: "Quizzes",
    description:
      "Test your knowledge with quizzes on various financial topics.",
    href: "/learn/quizzes",
    icon: <MessageCircleQuestionIcon size={49} className="text-yellow-500" />,
  },
  {
    title: "Tools",
    description: "Access tools to help you manage your finances.",
    href: "/learn/tools",
    icon: <Calculator size={49} className="text-purple-500" />,
  },
  // Add more cards here as needed
];

const LearnPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pt-[120px] px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Learn</h1>
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card, index) => (
          <Link key={index} href={card.href}>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm text-center">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LearnPage;

import React from "react";
import Image from "next/image"; // For optimized images
import { Card, CardTitle, CardDescription } from "@/components/ui/card"; // UI Components
import { Separator } from "@/components/ui/separator";

// ✅ Reusable Component for Candlestick Pattern Cards
const PatternCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <Card className="flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all p-6">
      <Image
        src={image}
        alt={title}
        width={200}
        height={100}
        className="mb-4"
      />
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      <CardDescription className="text-sm text-gray-600">
        {description}
      </CardDescription>
    </Card>
  );
};

// ✅ Candlestick Patterns Data
const patterns = [
  {
    title: "Doji",
    description: "Indicates market indecision, potential trend reversal.",
    image: "/images/doji.png",
  },
  {
    title: "Hammer",
    description: "A bullish reversal pattern after a downtrend.",
    image: "/images/hammer.png",
  },
  {
    title: "Engulfing",
    description: "A strong reversal pattern signaling trend change.",
    image: "/images/engulfing.png",
  },
  {
    title: "Morning Star",
    description: "Bullish pattern indicating potential uptrend.",
    image: "/images/morning-star.png",
  },
  {
    title: "Evening Star",
    description: "Bearish pattern signaling a potential downtrend.",
    image: "/images/evening-star.png",
  },
];

const CandleStickPatterns = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl mt-[100px]">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Candlestick Patterns
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Learn how to read and interpret candlestick patterns for better
          trading decisions.
        </p>
      </header>

      <Separator className="mb-8" />

      {/* Overview Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What Are Candlestick Patterns?
        </h2>
        <p className="text-gray-600">
          Candlestick patterns are formations in price charts that help traders
          predict future price movements. They indicate buying and selling
          pressure, potential reversals, and market sentiment.
        </p>
      </section>

      {/* Patterns Grid */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Common Candlestick Patterns
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {patterns.map((pattern, index) => (
            <PatternCard
              key={index}
              title={pattern.title}
              description={pattern.description}
              image={pattern.image}
            />
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center mt-12">
        <p className="text-gray-500 text-sm">
          Enhance your trading skills by mastering these patterns!
        </p>
      </footer>
    </div>
  );
};

export default CandleStickPatterns;

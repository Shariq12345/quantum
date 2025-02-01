"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";

const glossaryTerms = [
  {
    term: "P/E Ratio",
    definition:
      "The Price-to-Earnings ratio is a valuation ratio of a company's current share price compared to its per-share earnings.",
  },
  {
    term: "Market Cap",
    definition:
      "Market Capitalization is the total market value of a company's outstanding shares.",
  },
  {
    term: "Dividend Yield",
    definition:
      "The dividend yield is the annual dividend payment divided by the stock's price, expressed as a percentage.",
  },
  {
    term: "Bull Market",
    definition:
      "A bull market is a period of time in financial markets when the price of an asset or security rises continuously.",
  },
  {
    term: "Bear Market",
    definition:
      "A bear market is when a market experiences prolonged price declines, typically falling 20% or more from recent highs.",
  },
  {
    term: "Liquidity",
    definition:
      "Liquidity refers to how easily an asset can be converted into cash without affecting its market price.",
  },
  {
    term: "Volatility",
    definition:
      "Volatility measures the rate at which the price of a security increases or decreases for a given set of returns.",
  },
  {
    term: "Asset Allocation",
    definition:
      "Asset allocation is the process of dividing an investment portfolio among different asset categories, such as stocks, bonds, and cash.",
  },
  {
    term: "Hedge",
    definition:
      "A hedge is an investment made to reduce the risk of adverse price movements in an asset.",
  },
  {
    term: "Blue Chip Stocks",
    definition:
      "Blue chip stocks are shares of large, well-established, and financially stable companies with a history of reliable performance.",
  },
  {
    term: "Mutual Fund",
    definition:
      "A mutual fund is an investment vehicle made up of a pool of funds collected from many investors to invest in securities like stocks, bonds, and other assets.",
  },
  {
    term: "Exchange-Traded Fund (ETF)",
    definition:
      "An ETF is a type of investment fund traded on stock exchanges, similar to stocks, that holds assets like stocks, commodities, or bonds.",
  },
  {
    term: "Initial Public Offering (IPO)",
    definition:
      "An IPO is the process by which a private company becomes publicly traded on a stock exchange by offering its shares to the public for the first time.",
  },
  {
    term: "Capital Gains",
    definition:
      "Capital gains refer to the increase in the value of an asset or investment above its purchase price.",
  },
  {
    term: "Risk Tolerance",
    definition:
      "Risk tolerance is the degree of variability in investment returns that an individual is willing to withstand.",
  },
  {
    term: "Index Fund",
    definition:
      "An index fund is a type of mutual fund or ETF designed to track the components of a financial market index, such as the S&P 500.",
  },
  {
    term: "Short Selling",
    definition:
      "Short selling involves borrowing shares of a stock you don't own, selling them, and hoping to buy them back later at a lower price to make a profit.",
  },
  {
    term: "Yield Curve",
    definition:
      "The yield curve is a graph that plots the interest rates of bonds with the same credit quality but different maturity dates.",
  },
  {
    term: "Leverage",
    definition:
      "Leverage involves borrowing capital to increase the potential return on investment.",
  },
  {
    term: "Portfolio Diversification",
    definition:
      "Diversification is the strategy of spreading investments across various financial instruments, industries, or other categories to reduce risk.",
  },
];

const GlossaryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filteredTerms = glossaryTerms.filter((term) =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pt-[120px] pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Financial Glossary
        </h1>
        <div className="mb-8 relative">
          <Input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTerms.map((term, index) => (
            <Card
              key={index}
              className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() =>
                setExpandedTerm(expandedTerm === term.term ? null : term.term)
              }
            >
              <CardHeader>
                <CardTitle>{term.term}</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-gray-600 text-sm ${expandedTerm === term.term ? "" : "line-clamp-2"}`}
                >
                  {term.definition}
                </p>
                {expandedTerm !== term.term && (
                  <Button
                    variant="link"
                    className="mt-2 p-0"
                    onClick={() => setExpandedTerm(term.term)}
                  >
                    Learn more
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredTerms.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No terms found. Try a different search.
          </p>
        )}
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

export default GlossaryPage;

import type React from "react";
import Link from "next/link"; // Import Next.js Link
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CandlestickChart,
  TrendingUp,
  DollarSign,
  BarChart2,
  PieChart,
  BookOpen,
} from "lucide-react";

const guides = [
  {
    title: "Candlestick Patterns",
    description:
      "Learn to read and interpret candlestick charts for better trading decisions.",
    icon: CandlestickChart,
    link: "beginner-guides/guides/candlestick-patterns",
  },
  {
    title: "Market Orders",
    description:
      "Understand different types of market orders and when to use them.",
    icon: TrendingUp,
    link: "beginner-guides/guides/market-orders",
  },
  {
    title: "Fundamental Analysis",
    description:
      "Discover how to analyze a company's financial health and potential.",
    icon: DollarSign,
    link: "beginner-guides/guides/fundamental-analysis",
  },
  {
    title: "Technical Analysis",
    description:
      "Master the art of predicting price movements using historical data.",
    icon: BarChart2,
    link: "beginner-guides/guides/technical-analysis",
  },
  {
    title: "Portfolio Diversification",
    description: "Learn how to spread your investments to minimize risk.",
    icon: PieChart,
    link: "beginner-guides/guides/portfolio-diversification",
  },
  {
    title: "Investment Strategies",
    description:
      "Explore various investment strategies for different financial goals.",
    icon: BookOpen,
    link: "beginner-guides/guides/investment-strategies",
  },
];

const BeginnerGuides: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-[120px]">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          Beginner&apos;s Guide to Investing
        </h1>
        <p className="text-base text-muted-foreground">
          Master the basics of investing with our comprehensive guides
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <guide.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{guide.title}</CardTitle>
              <CardDescription>{guide.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link href={guide.link} passHref>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeginnerGuides;

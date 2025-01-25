"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import NewsFilter from "./news-filter";
import { format } from "date-fns";

interface NewsArticle {
  id: number;
  author: string;
  created_at: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  images: { size: string; url: string }[];
  symbols: string[];
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const options = {
        method: "GET",
        url: "https://data.alpaca.markets/v1beta1/news",
        params: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          end: new Date().toISOString(),
          sort: "desc",
          limit: 50,
        },
        headers: {
          accept: "application/json",
          "APCA-API-KEY-ID": process.env.NEXT_PUBLIC_ALPACA_API_KEY,
          "APCA-API-SECRET-KEY": process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY,
        },
      };

      const response = await axios.request(options);
      setNews(response.data.news);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter((article) => {
    if (filter === "all") return true;
    return article.symbols.includes(filter);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-[7rem] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
              Quantum Pulse
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Stay ahead with the latest market insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNews}
              disabled={isLoading}
              className="transition-all duration-300 ease-in-out hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* News Filter */}
        {/* <NewsFilter filter={filter} setFilter={setFilter} /> */}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => (
                  <Card
                    key={index}
                    className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
                  >
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
            : filteredNews.map((article) => (
                <Card
                  key={article.id}
                  className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <CardHeader className="p-0 overflow-hidden">
                    <img
                      src={
                        article.images.length > 0
                          ? article.images.find((img) => img.size === "large")
                              ?.url ||
                            "https://placehold.co/384x192?text=No+Image+Available"
                          : "https://placehold.co/384x192?text=No+Image+Available"
                      }
                      alt={article.headline}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <CardTitle className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.headline}
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.summary || "No summary available."}
                    </CardDescription>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {article.source}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(article.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700">
          Data provided by Alpaca Markets | © {new Date().getFullYear()}{" "}
          Quantum
        </div>
      </div>
    </div>
  );
};

export default NewsPage;

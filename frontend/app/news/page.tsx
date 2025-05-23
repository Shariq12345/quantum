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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, Calendar, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface NewsArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("market");

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const apiUrl = getApiUrl(filter);
      const response = await axios.get(apiUrl);
      setNews(response.data.articles);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    setIsLoading(false);
  };

  const getApiUrl = (filter: string) => {
    switch (filter) {
      case "bitcoin":
        return `https://newsapi.org/v2/everything?q=bitcoin&apiKey=a9197c465fcd48898b38ee4d46`;
      case "apple":
        return `https://newsapi.org/v2/everything?q=apple&from=2025-02-06&to=2025-02-06&sortBy=popularity&apiKey=a9197c465fcd48898b38ee4d46e34dd2`;
      case "tech":
        return `https://newsapi.org/v2/everything?domains=techcrunch.com,thenextweb.com&apiKey=a9197c465fcd48898b38ee4d46e34dd2`;
      default:
        return `https://newsapi.org/v2/top-headlines?q=market&apiKey=a9197c465fcd48898b38ee4d46e34dd2`;
    }
  };

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=a9197c465fcd48898b38ee4d46e34dd2`
      );
      setNews(response.data.articles);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-[7rem] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
              Quantum Pulse
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
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

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center w-full md:w-1/2 space-x-2">
            <Input
              placeholder="Search for news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white dark:bg-gray-800"
            />
            <Button
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700 
              hover:transition-all hover:duration-300 ease-in-out
              "
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-1/3 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market News</SelectItem>
              <SelectItem value="bitcoin">Bitcoin News</SelectItem>
              <SelectItem value="apple">Apple News</SelectItem>
              <SelectItem value="tech">TechCrunch & The Next Web</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
            : news.map((article, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <CardHeader className="p-0 overflow-hidden">
                    <img
                      src={
                        article.urlToImage ||
                        "https://placehold.co/384x192?text=No+Image+Available"
                      }
                      alt={article.title}
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
                        {article.title}
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.description || "No description available."}
                    </CardDescription>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {article.source.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(article.publishedAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700">
          Data provided by NewsAPI | © {new Date().getFullYear()} Quantum
        </div>
      </div>
    </div>
  );
};

export default NewsPage;

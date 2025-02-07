"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Clock, ExternalLink } from "lucide-react";
import moment from "moment";

interface NewsFeedProps {
  symbol: string;
}

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  site: string;
  time: number;
  favicon_url: string;
  description: string;
}

export const NewsFeed = ({ symbol }: NewsFeedProps) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://api.tickertick.com/feed?q=z:${symbol}&n=6`
        );
        setNews(response.data.stories || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  return (
    <div className="bg-gradient-to-br from-background to-secondary p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-emerald-600">
        Latest News for {symbol.toUpperCase()}
      </h2>
      {loading ? (
        <SkeletonLoader />
      ) : news.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center text-lg">
          No news available for {symbol.toUpperCase()}.
        </p>
      )}
    </div>
  );
};

const NewsCard = ({ article }: { article: NewsArticle }) => (
  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
    <CardContent className="p-4">
      <div className="flex items-center mb-3">
        <img
          src={article.favicon_url || "/placeholder.svg"}
          alt={`${article.site} icon`}
          className="h-6 w-6 mr-2 rounded-full"
        />
        <span className="text-sm font-medium text-muted-foreground">
          {article.site}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {article.description}
      </p>
      <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{moment(article.time).fromNow()}</span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-emerald-600 hover:text-emerald-600/80 transition-colors"
        >
          Read more
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>
    </CardContent>
  </Card>
);

// Skeleton Loader for News Feed
const SkeletonLoader = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(3)].map((_, index) => (
      <Card key={index} className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <Skeleton className="h-6 w-6 rounded-full mr-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

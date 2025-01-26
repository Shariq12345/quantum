"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Video {
  id: string;
  title: string;
  description: string;
}

const videos: Video[] = [
  {
    id: "p7HKvqRI_Bo",
    title: "How does the stock market work? - Oliver Elfenbaum",
    description:
      "Lesson by Oliver Elfenbaum, directed by Tom Gran & Madeleine Grossi.",
  },
  {
    id: "ZCFkWDdmXG8",
    title: "Explained | The Stock Market | FULL EPISODE | Netflix",
    description:
      "In this episode: Does the stock market accurately reflect the status of the economy? Finance specialists discuss market history, valuations and CEO incentives.",
  },
  {
    id: "lNdOtlpmH5U",
    title: "How to Invest for Beginners (2025)",
    description:
      "A step-by-step guide to getting started with investing, even if you're new to it.",
  },
];

const VideosPage = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pt-[120px] pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Educational Videos
        </h1>

        {activeVideo && (
          <div className="mb-8">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-w-16 aspect-h-6">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-4">
                <Button variant="outline" onClick={() => setActiveVideo(null)}>
                  Close Video
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                    alt={video.title}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => setActiveVideo(video.id)}
                  >
                    <Youtube className="mr-2 h-4 w-4" />
                    Watch Here
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      YouTube
                    </a>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
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

export default VideosPage;

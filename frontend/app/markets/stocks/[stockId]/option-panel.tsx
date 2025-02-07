"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

interface OptionPanelProps {
  symbol: string;
}

interface OptionData {
  [key: string]: {
    dailyBar?: {
      c: number;
      h: number;
      l: number;
      o: number;
      v: number;
    };
    latestQuote?: {
      ap: number;
      bp: number;
      as: number;
      bs: number;
    };
  };
}

export const OptionPanel = ({ symbol }: OptionPanelProps) => {
  const [optionsData, setOptionsData] = useState<OptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const fetchOptionsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "APCA-API-KEY-ID": process.env.NEXT_PUBLIC_ALPACA_API_KEY!,
        "APCA-API-SECRET-KEY": process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY!,
      },
    };

    try {
      const response = await fetch(
        `https://data.alpaca.markets/v1beta1/options/snapshots/${symbol}?feed=indicative&limit=10`,
        options
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOptionsData(data.snapshots);
      setShowAnimation(true);
    } catch (error) {
      console.error("Error fetching options data:", error);
      setError("Failed to fetch options data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchOptionsData();
  }, [fetchOptionsData]);

  // Extract strike price from option symbol (e.g., "00105000" → "105.00")
  const extractStrikePrice = (symbol: string) => {
    const strike = symbol.slice(11, 16); // Extract "00105"
    return `${parseInt(strike)}.00`; // Convert to "105.00"
  };

  // Extract expiry date from option symbol (e.g., "250131" → "2025-01-31")
  const extractExpiryDate = (symbol: string) => {
    const expiry = symbol.slice(4, 10); // Extract "250131"
    const year = `20${expiry.slice(0, 2)}`; // Convert "25" to "2025"
    const month = expiry.slice(2, 4); // Extract "01"
    const day = expiry.slice(4, 6); // Extract "31"
    return `${year}-${month}-${day}`; // Format as "2025-01-31"
  };

  const renderOptionTable = (options: [string, OptionData[string]][]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Expiry</TableHead>
            <TableHead className="w-[100px]">Strike</TableHead>
            <TableHead>Bid</TableHead>
            <TableHead>Ask</TableHead>
            {!isMobile && (
              <>
                <TableHead>Volume</TableHead>
                <TableHead>Open</TableHead>
                <TableHead>High</TableHead>
                <TableHead>Low</TableHead>
                <TableHead>Close</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {options
            .filter(([key]) => key.slice(11, 16).includes(searchTerm))
            .map(([key, data]) => (
              <TableRow key={key}>
                <TableCell>{extractExpiryDate(key)}</TableCell>
                <TableCell className="font-medium">
                  {extractStrikePrice(key)}
                </TableCell>
                <TableCell>{data.latestQuote?.bp.toFixed(2)}</TableCell>
                <TableCell>{data.latestQuote?.ap.toFixed(2)}</TableCell>
                {!isMobile && (
                  <>
                    <TableCell>{data.dailyBar?.v}</TableCell>
                    <TableCell>{data.dailyBar?.o.toFixed(2)}</TableCell>
                    <TableCell>{data.dailyBar?.h.toFixed(2)}</TableCell>
                    <TableCell>{data.dailyBar?.l.toFixed(2)}</TableCell>
                    <TableCell>{data.dailyBar?.c.toFixed(2)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderSkeletonTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Strike</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Bid</TableHead>
            <TableHead>Ask</TableHead>
            {!isMobile && (
              <>
                <TableHead>Volume</TableHead>
                <TableHead>Open</TableHead>
                <TableHead>High</TableHead>
                <TableHead>Low</TableHead>
                <TableHead>Close</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              {[...Array(isMobile ? 4 : 9)].map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  const callOptions = optionsData
    ? Object.entries(optionsData).filter(
        ([key]) => key[10] === "C" // 10th character is "C" for Call
      )
    : [];
  const putOptions = optionsData
    ? Object.entries(optionsData).filter(
        ([key]) => key[10] === "P" // 10th character is "P" for Put
      )
    : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>{symbol} Option Chain</span>
          <div className="text-sm font-normal">
            <span className="mr-4">
              <ArrowUpIcon className="inline-block w-4 h-4 mr-1 text-green-500" />
              Calls
            </span>
            <span>
              <ArrowDownIcon className="inline-block w-4 h-4 mr-1 text-red-500" />
              Puts
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search strike price..."
            className="flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            onClick={fetchOptionsData}
            disabled={loading}
            className="bg-emerald-600"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <Tabs defaultValue="calls" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="puts">Puts</TabsTrigger>
          </TabsList>
          <TabsContent value="calls">
            <div className="rounded-md border">
              {loading ? renderSkeletonTable() : renderOptionTable(callOptions)}
            </div>
          </TabsContent>
          <TabsContent value="puts">
            <div className="rounded-md border">
              {loading ? renderSkeletonTable() : renderOptionTable(putOptions)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

"use client";
import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Activity,
  BarChart2,
  DollarSign,
  Info,
  Newspaper,
  Globe,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import StockChart from "@/components/stock-charts";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricalData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AdditionalInfo {
  moving_average_fast: number;
  moving_average_slow: number;
  rsi: number;
  macd: number;
  macd_signal: number;
  macd_histogram: number;
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
  };
  volume_indicators: {
    adi: number;
    obv: number;
  };
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

interface PredictionResponse {
  predicted_price: number;
  historical_data: HistoricalData[];
  additional_info: AdditionalInfo;
  last_updated: string;
  news: NewsArticle[];
}

export default function StockPrediction() {
  const [symbol, setSymbol] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(
    null
  );
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!symbol) {
      setError("Please enter a stock symbol");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<PredictionResponse>(
        "http://localhost:5000/api/predict",
        { symbol: symbol.toUpperCase() }
      );
      console.log("Received data:", response.data);
      setPrediction(response.data.predicted_price);
      setHistoricalData(response.data.historical_data);
      setAdditionalInfo(response.data.additional_info);
      setNews(response.data.news);
    } catch (error) {
      setError("Failed to fetch prediction. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedChartData = historicalData.map((row) => ({
    time: new Date(row.timestamp).toISOString().split("T")[0], // Convert to yyyy-mm-dd
    // time: new Date(row.timestamp).getTime() / 1000, // Convert to yyyy-mm-dd
    open: row.open,
    high: row.high,
    low: row.low,
    close: row.close,
  }));

  const formattedVolumeData = historicalData.map((row: any) => ({
    time: new Date(row.timestamp).toISOString().split("T")[0], // Convert to yyyy-mm-dd
    value: row.volume,
  }));

  const formattedSmaData = historicalData.map((row) => ({
    time: new Date(row.timestamp).toISOString().split("T")[0],
    value: additionalInfo?.moving_average_fast || 0,
  }));

  const formattedRsiData = historicalData.map((row) => ({
    time: new Date(row.timestamp).toISOString().split("T")[0],
    value: additionalInfo?.rsi || 0,
  }));

  const formattedMacdData = historicalData.map((row) => ({
    time: new Date(row.timestamp).toISOString().split("T")[0],
    value: additionalInfo?.macd || 0,
  }));

  const indicators = {
    sma: formattedSmaData,
    rsi: formattedRsiData,
    macd: formattedMacdData,
  };

  console.log("Formatted Chart Data:", formattedChartData);

  const chartData = {
    labels: historicalData.map((row) => {
      // Parse the timestamp into a Date object
      const date = new Date(row.timestamp);
      // Format the date to display day, date, and year
      return date.toLocaleDateString("en-US", {
        weekday: "short", // "Thu"
        day: "2-digit", // "05"
        month: "short", // "Dec"
        year: "numeric", // "2024"
      });
    }),
    datasets: [
      {
        label: "Price",
        data: historicalData.map((row) => row.close),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
      },
      {
        label: "Volume",
        data: historicalData.map((row) => row.volume),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${symbol.toUpperCase()} Stock Price History`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
      y1: {
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[100px]">
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                AI Stock Price Prediction
              </CardTitle>
              <CardDescription className="text-base">
                Enter a stock symbol to get price predictions and technical
                analysis insights powered by machine learning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Enter stock symbol (e.g., AAPL)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="md:w-64"
                  />
                  <Button
                    onClick={handlePredict}
                    disabled={isLoading}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Activity className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Predict Price
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                )}

                {prediction && additionalInfo && (
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[400px]">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="technical">Technical</TabsTrigger>
                      <TabsTrigger value="volume">Volume</TabsTrigger>
                      <TabsTrigger value="chart">Chart</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">
                            Price Prediction
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold text-green-800">
                                  Predicted Price
                                </h3>
                              </div>
                              <p className="text-2xl font-bold text-green-700 mt-2">
                                ${prediction.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-800">
                                  Price Movement
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                {prediction >
                                historicalData[historicalData.length - 1]
                                  ?.close ? (
                                  <>
                                    <ArrowUp className="h-5 w-5 text-green-600" />
                                    <span className="text-green-600 font-semibold">
                                      Upward Trend
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowDown className="h-5 w-5 text-red-600" />
                                    <span className="text-red-600 font-semibold">
                                      Downward Trend
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="technical">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">
                            Technical Indicators
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">RSI</span>
                                <Badge
                                  variant={
                                    additionalInfo.rsi > 70
                                      ? "destructive"
                                      : additionalInfo.rsi < 30
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {additionalInfo?.rsi?.toFixed(2)}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Fast MA
                                </span>
                                <Badge variant="outline">
                                  {additionalInfo?.moving_average_fast?.toFixed(
                                    2
                                  )}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Slow MA
                                </span>
                                <Badge variant="outline">
                                  {additionalInfo?.moving_average_slow?.toFixed(
                                    2
                                  )}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  MACD
                                </span>
                                <Badge variant="outline">
                                  {additionalInfo?.macd?.toFixed(2)}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Signal
                                </span>
                                <Badge variant="outline">
                                  {additionalInfo?.macd_signal?.toFixed(2)}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Histogram
                                </span>
                                <Badge variant="outline">
                                  {additionalInfo?.macd_histogram?.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="volume">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">
                            Volume Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                <h3 className="font-semibold">ADI</h3>
                              </div>
                              <p className="text-lg font-bold mt-2">
                                {additionalInfo?.volume_indicators.adi.toFixed(
                                  2
                                )}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                <h3 className="font-semibold">OBV</h3>
                              </div>
                              <p className="text-lg font-bold mt-2">
                                {additionalInfo?.volume_indicators.obv.toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="chart">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">
                            Price History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[500px]">
                            <StockChart
                              data={formattedChartData}
                              volumeData={formattedVolumeData}
                              indicators={indicators}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

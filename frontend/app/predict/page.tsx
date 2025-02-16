"use client";
import { useEffect, useState } from "react";
import axios from "axios";
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
  Activity,
  BarChart2,
  DollarSign,
  Info,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import StockChart from "@/components/stock-charts";
import DisclaimerSection from "./disclaimer";
import PredictionRationale from "./rationale";

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
  useEffect(() => {
    document.title = "AI Stock Price Prediction | Quantum";
  }, []);
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
        {
          symbol: symbol.toUpperCase(),
        }
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

  // console.log("Formatted Chart Data:", formattedChartData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-[120px]">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                AI Stock Forecast
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 max-w-2xl mx-auto">
                Enter a stock symbol to get price predictions and technical
                analysis insights powered by advanced machine learning
                algorithms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Input
                    type="text"
                    placeholder="Enter stock symbol (e.g., AAPL)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="sm:w-64 text-center sm:text-left"
                  />
                  <Button
                    onClick={handlePredict}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Activity className="mr-2 h-4 w-4 animate-pulse" />
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
                  <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isLoading && (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <Skeleton className="h-32 w-full rounded-xl" />
                      <Skeleton className="h-32 w-full rounded-xl" />
                      <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                  </div>
                )}

                {prediction && additionalInfo && (
                  <Tabs
                    defaultValue="overview"
                    className="w-full max-w-4xl mx-auto"
                  >
                    <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                      <TabsTrigger value="overview" className="text-sm">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="technical" className="text-sm">
                        Technical
                      </TabsTrigger>
                      <TabsTrigger value="volume" className="text-sm">
                        Volume
                      </TabsTrigger>
                      <TabsTrigger value="chart" className="text-sm">
                        Chart
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <Card className="bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl text-gray-800">
                            Price Prediction
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 shadow-md">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-6 w-6 text-emerald-600" />
                                <h3 className="font-semibold text-emerald-800 text-lg">
                                  Predicted Price
                                </h3>
                              </div>
                              <p className="text-3xl font-bold text-emerald-700">
                                ${prediction.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-md">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-6 w-6 text-blue-600" />
                                <h3 className="font-semibold text-blue-800 text-lg">
                                  Price Movement
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                {prediction >
                                historicalData[historicalData.length - 1]
                                  ?.close ? (
                                  <>
                                    <ArrowUp className="h-6 w-6 text-emerald-600" />
                                    <span className="text-emerald-600 font-semibold text-lg">
                                      Upward Trend
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowDown className="h-6 w-6 text-red-600" />
                                    <span className="text-red-600 font-semibold text-lg">
                                      Downward Trend
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="mt-6">
                        <PredictionRationale
                          currentPrice={
                            historicalData[historicalData.length - 1]?.close
                          }
                          predictedPrice={prediction}
                          technicalIndicators={additionalInfo}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="technical">
                      <Card className="bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl text-gray-800">
                            Technical Indicators
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
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
                              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                                <span className="text-sm font-medium">
                                  Fast MA
                                </span>
                                <Badge variant="outline">
                                  {additionalInfo?.moving_average_fast?.toFixed(
                                    2
                                  )}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
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
                              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                                <span className="text-sm font-medium">
                                  MACD
                                </span>
                                <Badge variant="outline">
                                  {additionalInfo?.macd?.toFixed(2)}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                                <span className="text-sm font-medium">
                                  Signal
                                </span>
                                <Badge variant="outline">
                                  {additionalInfo?.macd_signal?.toFixed(2)}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
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
                      <Card className="bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl text-gray-800">
                            Volume Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                              <div className="flex items-center gap-2 mb-2">
                                <Info className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-800">
                                  ADI
                                </h3>
                              </div>
                              <p className="text-2xl font-bold text-gray-700">
                                {additionalInfo?.volume_indicators.adi.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>
                            <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                              <div className="flex items-center gap-2 mb-2">
                                <Info className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-800">
                                  OBV
                                </h3>
                              </div>
                              <p className="text-2xl font-bold text-gray-700">
                                {additionalInfo?.volume_indicators.obv.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="chart">
                      <Card className="bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl text-gray-800">
                            Price History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[500px] w-full">
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
        <DisclaimerSection />
      </div>
    </div>
  );
}

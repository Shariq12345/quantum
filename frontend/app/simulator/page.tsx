"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  BookOpen,
  Clock,
  HelpCircle,
  LineChart,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

// Types
type Trade = {
  id: string;
  type: "buy" | "sell";
  price: number;
  shares: number;
  timestamp: Date;
  total: number;
};

type Order = {
  id: string;
  type: "buy" | "sell";
  orderType: "market" | "limit" | "stop";
  price: number;
  targetPrice?: number;
  shares: number;
  status: "pending" | "filled" | "cancelled";
  timestamp: Date;
};

type NewsItem = {
  id: string;
  title: string;
  content: string;
  impact: "positive" | "negative" | "neutral";
  timestamp: Date;
};

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

export default function TradingSimulator() {
  // State
  const [darkMode, setDarkMode] = useState(false);
  const [stockData, setStockData] = useState<number[]>([]);
  const [volumeData, setVolumeData] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<Date[]>([]);
  const [cashBalance, setCashBalance] = useState(100000); // Starting balance
  const [sharesOwned, setSharesOwned] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">(
    "market"
  );
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [volatility, setVolatility] = useState(1);
  const [timeScale, setTimeScale] = useState<"1m" | "5m" | "15m" | "1h" | "1d">(
    "5m"
  );
  const [simulationSpeed, setSimulationSpeed] = useState(5000); // ms
  const [chartType, setChartType] = useState<"line" | "candle">("line");
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [marketStatus, setMarketStatus] = useState<"open" | "closed">("open");
  const [watchlist, setWatchlist] = useState<Stock[]>([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 175.23,
      change: 2.34,
      changePercent: 1.35,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 325.76,
      change: -1.23,
      changePercent: -0.38,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 132.45,
      change: 0.87,
      changePercent: 0.66,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 128.91,
      change: -2.15,
      changePercent: -1.64,
    },
  ]);
  const [selectedStock, setSelectedStock] = useState("DEMO");
  const [leverage, setLeverage] = useState(1);
  const [showNews, setShowNews] = useState(true);

  // Generate fake stock data
  useEffect(() => {
    const generateFakeData = () => {
      const initialPrice = 100;
      const newPrices = [initialPrice];
      const newVolumes = [1000];
      const newTimestamps: Date[] = [new Date()];

      // Generate historical data
      for (let i = 1; i < 100; i++) {
        const lastPrice = newPrices[i - 1];
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const newPrice = Math.max(lastPrice + randomChange, 10);
        newPrices.push(newPrice);

        // Generate random volume
        const volume = Math.floor(Math.random() * 5000) + 500;
        newVolumes.push(volume);

        // Generate timestamps based on timeScale
        const lastTime = new Date(newTimestamps[i - 1]);
        switch (timeScale) {
          case "1m":
            lastTime.setMinutes(lastTime.getMinutes() - 1);
            break;
          case "5m":
            lastTime.setMinutes(lastTime.getMinutes() - 5);
            break;
          case "15m":
            lastTime.setMinutes(lastTime.getMinutes() - 15);
            break;
          case "1h":
            lastTime.setHours(lastTime.getHours() - 1);
            break;
          case "1d":
            lastTime.setDate(lastTime.getDate() - 1);
            break;
        }
        newTimestamps.push(lastTime);
      }

      setStockData(newPrices);
      setVolumeData(newVolumes);
      setTimestamps(newTimestamps.reverse());
      setCurrentPrice(newPrices[newPrices.length - 1]);

      // Generate fake news
      generateNews();
    };

    generateFakeData();

    const interval = setInterval(() => {
      if (marketStatus === "open") {
        setStockData((prevData) => {
          const lastPrice = prevData[prevData.length - 1];
          const randomChange = (Math.random() - 0.5) * 2 * volatility;
          const newPrice = Math.max(lastPrice + randomChange, 10);
          return [...prevData, newPrice].slice(-100);
        });

        setVolumeData((prevData) => {
          const volume = Math.floor(Math.random() * 5000) + 500;
          return [...prevData, volume].slice(-100);
        });

        setTimestamps((prevData) => {
          const newTime = new Date();
          return [...prevData, newTime].slice(-100);
        });

        setCurrentPrice((prevPrice) => {
          const randomChange = (Math.random() - 0.5) * 2 * volatility;
          return Math.max(prevPrice + randomChange, 10);
        });

        // Process pending orders
        processOrders();
      }
    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [volatility, timeScale, simulationSpeed, marketStatus]);

  // Process pending orders
  const processOrders = () => {
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];

      updatedOrders.forEach((order) => {
        if (order.status === "pending") {
          if (order.orderType === "market") {
            // Market orders execute immediately
            executeOrder(order);
            order.status = "filled";
          } else if (order.orderType === "limit") {
            // Limit orders: buy when price <= target, sell when price >= target
            if (
              (order.type === "buy" &&
                currentPrice <= (order.targetPrice || 0)) ||
              (order.type === "sell" &&
                currentPrice >= (order.targetPrice || 0))
            ) {
              executeOrder(order);
              order.status = "filled";
            }
          } else if (order.orderType === "stop") {
            // Stop orders: buy when price >= target, sell when price <= target
            if (
              (order.type === "buy" &&
                currentPrice >= (order.targetPrice || 0)) ||
              (order.type === "sell" &&
                currentPrice <= (order.targetPrice || 0))
            ) {
              executeOrder(order);
              order.status = "filled";
            }
          }
        }
      });

      return updatedOrders;
    });
  };

  // Execute an order
  const executeOrder = (order: Order) => {
    if (order.type === "buy") {
      const totalCost = order.shares * currentPrice * leverage;
      if (totalCost <= cashBalance) {
        setCashBalance((prev) => prev - totalCost);
        setSharesOwned((prev) => prev + order.shares);

        // Record the trade
        const newTrade: Trade = {
          id: Math.random().toString(36).substring(2, 9),
          type: "buy",
          price: currentPrice,
          shares: order.shares,
          timestamp: new Date(),
          total: totalCost,
        };
        setTrades((prev) => [newTrade, ...prev]);
      }
    } else if (order.type === "sell") {
      if (order.shares <= sharesOwned) {
        const totalRevenue = order.shares * currentPrice * leverage;
        setCashBalance((prev) => prev + totalRevenue);
        setSharesOwned((prev) => prev - order.shares);

        // Record the trade
        const newTrade: Trade = {
          id: Math.random().toString(36).substring(2, 9),
          type: "sell",
          price: currentPrice,
          shares: order.shares,
          timestamp: new Date(),
          total: totalRevenue,
        };
        setTrades((prev) => [newTrade, ...prev]);
      }
    }
  };

  // Generate fake news
  const generateNews = () => {
    const newsItems: NewsItem[] = [
      {
        id: "1",
        title: "Quarterly Earnings Exceed Expectations",
        content:
          "The company reported earnings of $2.45 per share, exceeding analyst expectations of $2.20 per share.",
        impact: "positive",
        timestamp: new Date(Date.now() - 25 * 60000),
      },
      {
        id: "2",
        title: "New Product Launch Announced",
        content:
          "The company announced the launch of a new product line expected to boost revenue by 15% in the coming year.",
        impact: "positive",
        timestamp: new Date(Date.now() - 55 * 60000),
      },
      {
        id: "3",
        title: "Regulatory Investigation Underway",
        content:
          "Regulators have launched an investigation into the company's business practices.",
        impact: "negative",
        timestamp: new Date(Date.now() - 120 * 60000),
      },
      {
        id: "4",
        title: "Market Volatility Expected to Continue",
        content:
          "Analysts predict continued market volatility due to economic uncertainty.",
        impact: "neutral",
        timestamp: new Date(Date.now() - 180 * 60000),
      },
      {
        id: "5",
        title: "Industry Growth Slowing",
        content:
          "Recent data suggests industry growth is slowing, which may impact future earnings.",
        impact: "negative",
        timestamp: new Date(Date.now() - 240 * 60000),
      },
    ];

    setNews(newsItems);
  };

  // Buy Stocks
  const handleBuy = () => {
    const amount = Number.parseInt(buyAmount, 10);
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount");

    if (orderType === "market") {
      const totalCost = amount * currentPrice * leverage;
      if (totalCost > cashBalance) return alert("Insufficient funds");

      // Create and execute market order immediately
      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 9),
        type: "buy",
        orderType: "market",
        price: currentPrice,
        shares: amount,
        status: "filled",
        timestamp: new Date(),
      };

      setOrders((prev) => [newOrder, ...prev]);
      executeOrder(newOrder);
    } else {
      // Create limit or stop order
      const targetPriceValue =
        orderType === "limit"
          ? Number.parseFloat(limitPrice)
          : Number.parseFloat(stopPrice);
      if (isNaN(targetPriceValue) || targetPriceValue <= 0) {
        return alert(`Invalid ${orderType} price`);
      }

      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 9),
        type: "buy",
        orderType: orderType,
        price: currentPrice,
        targetPrice: targetPriceValue,
        shares: amount,
        status: "pending",
        timestamp: new Date(),
      };

      setOrders((prev) => [newOrder, ...prev]);
    }

    setBuyAmount("");
    setLimitPrice("");
    setStopPrice("");
  };

  // Sell Stocks
  const handleSell = () => {
    const amount = Number.parseInt(sellAmount, 10);
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount");
    if (amount > sharesOwned) return alert("Not enough shares");

    if (orderType === "market") {
      // Create and execute market order immediately
      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 9),
        type: "sell",
        orderType: "market",
        price: currentPrice,
        shares: amount,
        status: "filled",
        timestamp: new Date(),
      };

      setOrders((prev) => [newOrder, ...prev]);
      executeOrder(newOrder);
    } else {
      // Create limit or stop order
      const targetPriceValue =
        orderType === "limit"
          ? Number.parseFloat(limitPrice)
          : Number.parseFloat(stopPrice);
      if (isNaN(targetPriceValue) || targetPriceValue <= 0) {
        return alert(`Invalid ${orderType} price`);
      }

      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 9),
        type: "sell",
        orderType: orderType,
        price: currentPrice,
        targetPrice: targetPriceValue,
        shares: amount,
        status: "pending",
        timestamp: new Date(),
      };

      setOrders((prev) => [newOrder, ...prev]);
    }

    setSellAmount("");
    setLimitPrice("");
    setStopPrice("");
  };

  // Cancel order
  const cancelOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  // Toggle market status
  const toggleMarketStatus = () => {
    setMarketStatus((prev) => (prev === "open" ? "closed" : "open"));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Calculate Portfolio Value
  const portfolioValue = cashBalance + sharesOwned * currentPrice * leverage;

  // Calculate profit/loss
  const calculatePnL = () => {
    const investedAmount = trades.reduce((total, trade) => {
      if (trade.type === "buy") return total + trade.total;
      if (trade.type === "sell") return total - trade.total;
      return total;
    }, 0);

    const currentHoldings = sharesOwned * currentPrice * leverage;
    return currentHoldings + cashBalance - 100000; // Initial balance was 100000
  };

  const pnl = calculatePnL();
  const pnlPercentage = (pnl / 100000) * 100;

  // Technical Indicators
  // Moving Average Calculation
  const calculateMA = (data: number[], period: number) => {
    return data.map((_, i, arr) =>
      i < period - 1
        ? null
        : arr.slice(i - period + 1, i + 1).reduce((sum, val) => sum + val, 0) /
          period
    );
  };

  // RSI Calculation
  const calculateRSI = (data: number[], period = 14) => {
    if (data.length < period + 1) return "N/A";

    let gains = 0,
      losses = 0;
    for (let i = 1; i <= period; i++) {
      const diff = data[data.length - i] - data[data.length - i - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }

    if (losses === 0) return "100";

    const rs = gains / losses;
    return (100 - 100 / (1 + rs)).toFixed(2);
  };

  // MACD Calculation
  const calculateMACD = (data: number[]) => {
    if (data.length < 26) return { macd: [], signal: [], histogram: [] };

    const ema12 = calculateEMA(data, 12);
    const ema26 = calculateEMA(data, 26);

    const macdLine = ema12.map((value, i) => {
      if (value === null || ema26[i] === null) return null;
      return value - (ema26[i] || 0);
    });

    const signalLine = calculateEMA(
      macdLine.filter((v) => v !== null) as number[],
      9
    );

    const histogram = macdLine.map((value, i) => {
      if (value === null || signalLine[i] === null) return null;
      return value - (signalLine[i] || 0);
    });

    return { macd: macdLine, signal: signalLine, histogram };
  };

  // EMA Calculation
  const calculateEMA = (data: number[], period: number) => {
    const k = 2 / (period + 1);
    const emaData: (number | null)[] = Array(data.length).fill(null);

    // Start with SMA for the first EMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i];
    }
    emaData[period - 1] = sum / period;

    // Calculate EMA for the rest
    for (let i = period; i < data.length; i++) {
      emaData[i] = data[i] * k + (emaData[i - 1] || 0) * (1 - k);
    }

    return emaData;
  };

  // Bollinger Bands Calculation
  const calculateBollingerBands = (
    data: number[],
    period = 20,
    multiplier = 2
  ) => {
    const sma = calculateMA(data, period);

    const upperBand = sma.map((value, i) => {
      if (value === null) return null;

      // Calculate standard deviation
      const slice = data.slice(i - period + 1, i + 1);
      const mean = value;
      const squaredDiffs = slice.map((val) => Math.pow(val - mean, 2));
      const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / period;
      const stdDev = Math.sqrt(variance);

      return value + multiplier * stdDev;
    });

    const lowerBand = sma.map((value, i) => {
      if (value === null) return null;

      // Calculate standard deviation
      const slice = data.slice(i - period + 1, i + 1);
      const mean = value;
      const squaredDiffs = slice.map((val) => Math.pow(val - mean, 2));
      const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / period;
      const stdDev = Math.sqrt(variance);

      return value - multiplier * stdDev;
    });

    return { middle: sma, upper: upperBand, lower: lowerBand };
  };

  // Chart Data
  const chartData = useMemo(() => {
    const ma50 = calculateMA(stockData, 50);
    const ma200 = calculateMA(stockData, 200);
    const bollingerBands = calculateBollingerBands(stockData);

    return {
      labels: timestamps.map((date) => date.toLocaleTimeString()),
      datasets: [
        {
          label: "Stock Price",
          data: stockData,
          borderColor: darkMode ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)",
          backgroundColor: darkMode
            ? "rgba(59, 130, 246, 0.1)"
            : "rgba(37, 99, 235, 0.1)",
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 2,
        },
        ...(showIndicators
          ? [
              {
                label: "50-Period MA",
                data: ma50,
                borderColor: darkMode ? "rgb(239, 68, 68)" : "rgb(220, 38, 38)",
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false,
              },
              {
                label: "200-Period MA",
                data: ma200,
                borderColor: darkMode ? "rgb(34, 197, 94)" : "rgb(22, 163, 74)",
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false,
              },
              {
                label: "Upper Bollinger Band",
                data: bollingerBands.upper,
                borderColor: darkMode
                  ? "rgba(168, 85, 247, 0.6)"
                  : "rgba(147, 51, 234, 0.6)",
                borderWidth: 1,
                pointRadius: 0,
                borderDash: [5, 5],
                fill: false,
              },
              {
                label: "Lower Bollinger Band",
                data: bollingerBands.lower,
                borderColor: darkMode
                  ? "rgba(168, 85, 247, 0.6)"
                  : "rgba(147, 51, 234, 0.6)",
                borderWidth: 1,
                pointRadius: 0,
                borderDash: [5, 5],
                fill: false,
              },
            ]
          : []),
      ],
    };
  }, [stockData, timestamps, showIndicators, darkMode]);

  // Volume Chart Data
  const volumeChartData = useMemo(() => {
    return {
      labels: timestamps.map((date) => date.toLocaleTimeString()),
      datasets: [
        {
          label: "Volume",
          data: volumeData,
          backgroundColor: darkMode
            ? "rgba(59, 130, 246, 0.5)"
            : "rgba(37, 99, 235, 0.5)",
          borderColor: darkMode
            ? "rgba(59, 130, 246, 0.8)"
            : "rgba(37, 99, 235, 0.8)",
          borderWidth: 1,
        },
      ],
    };
  }, [volumeData, timestamps, darkMode]);

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
          color: darkMode ? "#9ca3af" : "#4b5563",
        },
        grid: {
          display: false,
        },
      },
      y: {
        position: "right" as const,
        ticks: {
          color: darkMode ? "#9ca3af" : "#4b5563",
        },
        grid: {
          color: darkMode
            ? "rgba(75, 85, 99, 0.2)"
            : "rgba(209, 213, 219, 0.5)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: darkMode ? "#e5e7eb" : "#1f2937",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode
          ? "rgba(17, 24, 39, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: darkMode ? "#e5e7eb" : "#1f2937",
        bodyColor: darkMode ? "#e5e7eb" : "#1f2937",
        borderColor: darkMode
          ? "rgba(75, 85, 99, 0.2)"
          : "rgba(209, 213, 219, 0.5)",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        intersect: false,
        mode: "index" as const,
      },
    },
    animation: {
      duration: 0, // general animation time
    },
    transitions: {
      active: {
        animation: {
          duration: 0, // duration of animations when hovering an item
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 4,
        hoverBorderWidth: 2,
      },
    },
  };

  // Volume Chart Options
  const volumeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        position: "right" as const,
        ticks: {
          color: darkMode ? "#9ca3af" : "#4b5563",
        },
        grid: {
          color: darkMode
            ? "rgba(75, 85, 99, 0.2)"
            : "rgba(209, 213, 219, 0.5)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode
          ? "rgba(17, 24, 39, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: darkMode ? "#e5e7eb" : "#1f2937",
        bodyColor: darkMode ? "#e5e7eb" : "#1f2937",
        borderColor: darkMode
          ? "rgba(75, 85, 99, 0.2)"
          : "rgba(209, 213, 219, 0.5)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        intersect: false,
        mode: "index" as const,
      },
    },
    animation: {
      duration: 0,
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} ${fullscreen ? "fixed inset-0 z-50 bg-background" : ""} pt-[100px] `}
    >
      <div className="dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold dark:text-white">
              Advanced Trading Simulator
            </h1>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleDarkMode}
                    >
                      {darkMode ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="5" />
                          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Dark Mode</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>

              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleMarketStatus}
                    >
                      {marketStatus === "open" ? (
                        <Clock className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-red-500" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Market is {marketStatus === "open" ? "Open" : "Closed"}
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>

              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFullscreen(!fullscreen)}
                    >
                      {fullscreen ? (
                        <Minimize2 className="h-5 w-5" />
                      ) : (
                        <Maximize2 className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowIndicators(!showIndicators)}
                  >
                    {showIndicators ? "Hide Indicators" : "Show Indicators"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowVolume(!showVolume)}>
                    {showVolume ? "Hide Volume" : "Show Volume"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowNews(!showNews)}>
                    {showNews ? "Hide News" : "Show News"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Simulation Speed</span>
                      <Select
                        value={simulationSpeed.toString()}
                        onValueChange={(value) =>
                          setSimulationSpeed(Number.parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1000">Fast</SelectItem>
                          <SelectItem value="5000">Normal</SelectItem>
                          <SelectItem value="10000">Slow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Volatility</span>
                      <Select
                        value={volatility.toString()}
                        onValueChange={(value) =>
                          setVolatility(Number.parseFloat(value))
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">Low</SelectItem>
                          <SelectItem value="1">Medium</SelectItem>
                          <SelectItem value="2">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Column - Portfolio & Trading */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Portfolio Overview</span>
                    <Badge
                      variant={pnl >= 0 ? "outline" : "destructive"}
                      className={pnl >= 0 ? "bg-green-500" : "bg-red-500"}
                    >
                      {pnl >= 0 ? "+" : ""}
                      {pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Cash Balance
                    </span>
                    <span className="font-medium">
                      ${cashBalance.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Shares Owned
                    </span>
                    <span className="font-medium">{sharesOwned}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Current Price
                    </span>
                    <span className="font-medium">
                      ${currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Position Value
                    </span>
                    <span className="font-medium">
                      ${(sharesOwned * currentPrice * leverage).toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Portfolio Value
                    </span>
                    <span className="font-semibold">
                      ${portfolioValue.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Leverage
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{leverage}x</span>
                      <Select
                        value={leverage.toString()}
                        onValueChange={(value) =>
                          setLeverage(Number.parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-16 h-7">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                          <SelectItem value="5">5x</SelectItem>
                          <SelectItem value="10">10x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Technical Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      RSI (14)
                    </span>
                    <span
                      className={`font-medium ${
                        calculateRSI(stockData) === "N/A"
                          ? ""
                          : Number.parseFloat(
                                calculateRSI(stockData) as string
                              ) > 70
                            ? "text-red-500"
                            : Number.parseFloat(
                                  calculateRSI(stockData) as string
                                ) < 30
                              ? "text-green-500"
                              : ""
                      }`}
                    >
                      {calculateRSI(stockData)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      MA (50)
                    </span>
                    <span className="font-medium">
                      $
                      {calculateMA(stockData, 50)[
                        stockData.length - 1
                      ]?.toFixed(2) || "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      MA (200)
                    </span>
                    <span className="font-medium">
                      $
                      {calculateMA(stockData, 200)[
                        stockData.length - 1
                      ]?.toFixed(2) || "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Bollinger Bands
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-green-500">
                        Upper: $
                        {calculateBollingerBands(stockData).upper[
                          stockData.length - 1
                        ]?.toFixed(2) || "N/A"}
                      </div>
                      <div className="text-xs">
                        Middle: $
                        {calculateBollingerBands(stockData).middle[
                          stockData.length - 1
                        ]?.toFixed(2) || "N/A"}
                      </div>
                      <div className="text-xs text-red-500">
                        Lower: $
                        {calculateBollingerBands(stockData).lower[
                          stockData.length - 1
                        ]?.toFixed(2) || "N/A"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="buy">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="space-y-4">
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="order-type">Order Type</Label>
                        <Select
                          value={orderType}
                          onValueChange={(value: "market" | "limit" | "stop") =>
                            setOrderType(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select order type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market</SelectItem>
                            <SelectItem value="limit">Limit</SelectItem>
                            <SelectItem value="stop">Stop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="buy-amount">Shares</Label>
                        <Input
                          id="buy-amount"
                          type="number"
                          placeholder="Enter amount"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                        />
                      </div>

                      {orderType === "limit" && (
                        <div className="space-y-2">
                          <Label htmlFor="limit-price">Limit Price ($)</Label>
                          <Input
                            id="limit-price"
                            type="number"
                            placeholder="Enter limit price"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                          />
                        </div>
                      )}

                      {orderType === "stop" && (
                        <div className="space-y-2">
                          <Label htmlFor="stop-price">Stop Price ($)</Label>
                          <Input
                            id="stop-price"
                            type="number"
                            placeholder="Enter stop price"
                            value={stopPrice}
                            onChange={(e) => setStopPrice(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Estimated Cost</Label>
                        <div className="text-lg font-semibold">
                          $
                          {(
                            Number.parseFloat(buyAmount || "0") *
                            currentPrice *
                            leverage
                          ).toFixed(2)}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleBuy}
                        disabled={
                          !buyAmount ||
                          Number.parseInt(buyAmount) <= 0 ||
                          marketStatus === "closed"
                        }
                      >
                        Buy {orderType !== "market" ? `(${orderType})` : ""}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="sell" className="space-y-4">
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="order-type">Order Type</Label>
                        <Select
                          value={orderType}
                          onValueChange={(value: "market" | "limit" | "stop") =>
                            setOrderType(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select order type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market</SelectItem>
                            <SelectItem value="limit">Limit</SelectItem>
                            <SelectItem value="stop">Stop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sell-amount">Shares</Label>
                        <Input
                          id="sell-amount"
                          type="number"
                          placeholder="Enter amount"
                          value={sellAmount}
                          onChange={(e) => setSellAmount(e.target.value)}
                        />
                      </div>

                      {orderType === "limit" && (
                        <div className="space-y-2">
                          <Label htmlFor="limit-price">Limit Price ($)</Label>
                          <Input
                            id="limit-price"
                            type="number"
                            placeholder="Enter limit price"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                          />
                        </div>
                      )}

                      {orderType === "stop" && (
                        <div className="space-y-2">
                          <Label htmlFor="stop-price">Stop Price ($)</Label>
                          <Input
                            id="stop-price"
                            type="number"
                            placeholder="Enter stop price"
                            value={stopPrice}
                            onChange={(e) => setStopPrice(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Estimated Revenue</Label>
                        <div className="text-lg font-semibold">
                          $
                          {(
                            Number.parseFloat(sellAmount || "0") *
                            currentPrice *
                            leverage
                          ).toFixed(2)}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleSell}
                        disabled={
                          !sellAmount ||
                          Number.parseInt(sellAmount) <= 0 ||
                          Number.parseInt(sellAmount) > sharesOwned ||
                          marketStatus === "closed"
                        }
                      >
                        Sell {orderType !== "market" ? `(${orderType})` : ""}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Middle and Right Columns - Charts and Data */}
            <div className="lg:col-span-3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          {selectedStock} - ${currentPrice.toFixed(2)}
                        </CardTitle>
                        <Badge
                          variant={
                            stockData[stockData.length - 1] >
                            stockData[stockData.length - 2]
                              ? "outline"
                              : "destructive"
                          }
                          className={
                            stockData[stockData.length - 1] >
                            stockData[stockData.length - 2]
                              ? "bg-green-500"
                              : "bg-red-500"
                          }
                        >
                          {stockData[stockData.length - 1] >
                          stockData[stockData.length - 2]
                            ? "+"
                            : ""}
                          {(
                            stockData[stockData.length - 1] -
                            stockData[stockData.length - 2]
                          ).toFixed(2)}
                          (
                          {(
                            ((stockData[stockData.length - 1] -
                              stockData[stockData.length - 2]) /
                              stockData[stockData.length - 2]) *
                            100
                          ).toFixed(2)}
                          %)
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={timeScale}
                          onValueChange={(
                            value: "1m" | "5m" | "15m" | "1h" | "1d"
                          ) => setTimeScale(value)}
                        >
                          <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1m">1m</SelectItem>
                            <SelectItem value="5m">5m</SelectItem>
                            <SelectItem value="15m">15m</SelectItem>
                            <SelectItem value="1h">1h</SelectItem>
                            <SelectItem value="1d">1d</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setChartType(
                              chartType === "line" ? "candle" : "line"
                            )
                          }
                        >
                          {chartType === "line" ? (
                            <LineChart className="h-4 w-4" />
                          ) : (
                            <BarChart3 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <Line data={chartData} options={chartOptions} />
                    </div>
                    {showVolume && (
                      <div className="h-[100px] mt-2">
                        <Bar
                          data={volumeChartData}
                          options={volumeChartOptions}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Watchlist</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Chg%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {watchlist.map((stock) => (
                          <TableRow
                            key={stock.symbol}
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => setSelectedStock(stock.symbol)}
                          >
                            <TableCell className="font-medium">
                              {stock.symbol}
                            </TableCell>
                            <TableCell className="text-right">
                              ${stock.price.toFixed(2)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${stock.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {stock.changePercent >= 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow
                          className={`cursor-pointer hover:bg-muted ${selectedStock === "DEMO" ? "bg-muted" : ""}`}
                          onClick={() => setSelectedStock("DEMO")}
                        >
                          <TableCell className="font-medium">DEMO</TableCell>
                          <TableCell className="text-right">
                            ${currentPrice.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${stockData[stockData.length - 1] > stockData[stockData.length - 2] ? "text-green-500" : "text-red-500"}`}
                          >
                            {stockData[stockData.length - 1] >
                            stockData[stockData.length - 2]
                              ? "+"
                              : ""}
                            {(
                              ((stockData[stockData.length - 1] -
                                stockData[stockData.length - 2]) /
                                stockData[stockData.length - 2]) *
                              100
                            ).toFixed(2)}
                            %
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Open Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[200px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Shares</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.filter((order) => order.status === "pending")
                            .length > 0 ? (
                            orders
                              .filter((order) => order.status === "pending")
                              .map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        order.type === "buy"
                                          ? "outline"
                                          : "secondary"
                                      }
                                      className={
                                        order.type === "buy"
                                          ? "border-green-500 text-green-500"
                                          : "border-red-500 text-red-500"
                                      }
                                    >
                                      {order.type.toUpperCase()} (
                                      {order.orderType})
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{order.shares}</TableCell>
                                  <TableCell>
                                    $
                                    {order.targetPrice?.toFixed(2) ||
                                      order.price.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    >
                                      {order.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => cancelOrder(order.id)}
                                    >
                                      Cancel
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center text-muted-foreground py-4"
                              >
                                No open orders
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Trade History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[200px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Shares</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trades.length > 0 ? (
                            trades.map((trade) => (
                              <TableRow key={trade.id}>
                                <TableCell>
                                  <Badge
                                    variant={
                                      trade.type === "buy"
                                        ? "outline"
                                        : "secondary"
                                    }
                                    className={
                                      trade.type === "buy"
                                        ? "border-green-500 text-green-500"
                                        : "border-red-500 text-red-500"
                                    }
                                  >
                                    {trade.type.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell>{trade.shares}</TableCell>
                                <TableCell>${trade.price.toFixed(2)}</TableCell>
                                <TableCell>${trade.total.toFixed(2)}</TableCell>
                                <TableCell>
                                  {trade.timestamp.toLocaleTimeString()}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center text-muted-foreground py-4"
                              >
                                No trade history
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {showNews && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Market News</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[200px]">
                      <div className="p-4 space-y-4">
                        {news.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <Badge
                              variant="outline"
                              className={
                                item.impact === "positive"
                                  ? "border-green-500 text-green-500"
                                  : item.impact === "negative"
                                    ? "border-red-500 text-red-500"
                                    : "border-gray-500 text-gray-500"
                              }
                            >
                              {item.impact.charAt(0).toUpperCase() +
                                item.impact.slice(1)}
                            </Badge>
                            <div className="space-y-1">
                              <h4 className="font-semibold">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.content}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4">
                <HelpCircle className="h-4 w-4 mr-2" />
                Trading Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Trading Simulator Guide</DialogTitle>
                <DialogDescription>
                  Learn how to use the trading simulator effectively
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order Types</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Market Order:</strong> Executes immediately at the
                      current market price.
                      <br />
                      <strong>Limit Order:</strong> Executes only at the
                      specified price or better. For buy orders, the order will
                      execute when the price falls to or below your limit price.
                      For sell orders, the order will execute when the price
                      rises to or above your limit price.
                      <br />
                      <strong>Stop Order:</strong> Becomes a market order when
                      the price reaches a specified level. For buy orders, the
                      order will execute when the price rises to or above your
                      stop price. For sell orders, the order will execute when
                      the price falls to or below your stop price.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      Technical Indicators
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>RSI (Relative Strength Index):</strong> Measures
                      the speed and change of price movements. Values above 70
                      indicate overbought conditions, while values below 30
                      indicate oversold conditions.
                      <br />
                      <strong>Moving Averages:</strong> Show the average price
                      over a specific period. The 50-period and 200-period
                      moving averages are commonly used to identify trends.
                      <br />
                      <strong>Bollinger Bands:</strong> Consist of a middle band
                      (20-period moving average) and two outer bands (standard
                      deviations). They help identify volatility and potential
                      price targets.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Leverage</h3>
                    <p className="text-sm text-muted-foreground">
                      Leverage allows you to control a larger position with a
                      smaller amount of capital. For example, with 2x leverage,
                      you can control $2,000 worth of stock with $1,000.
                      However, leverage amplifies both gains and losses, so use
                      it cautiously.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Risk Management</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Position Sizing:</strong> Don't risk too much on a
                      single trade. A common rule is to risk no more than 1-2%
                      of your portfolio on any single trade.
                      <br />
                      <strong>Stop Loss:</strong> Use stop orders to
                      automatically exit trades when they move against you by a
                      predetermined amount.
                      <br />
                      <strong>Take Profit:</strong> Set price targets to lock in
                      profits when a trade moves in your favor.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      Trading Strategies
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Trend Following:</strong> Buy in uptrends and sell
                      in downtrends. Use moving averages to identify the trend
                      direction.
                      <br />
                      <strong>Mean Reversion:</strong> Buy when prices are
                      oversold and sell when they are overbought. RSI can help
                      identify these conditions.
                      <br />
                      <strong>Breakout Trading:</strong> Enter trades when the
                      price breaks above resistance or below support levels.
                      <br />
                      <strong>News Trading:</strong> Trade based on market news
                      and events that might impact stock prices.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      Simulator Features
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Market Status:</strong> Toggle between open and
                      closed market conditions.
                      <br />
                      <strong>Volatility Settings:</strong> Adjust market
                      volatility to simulate different market conditions.
                      <br />
                      <strong>Time Scales:</strong> Switch between different
                      time frames (1m, 5m, 15m, 1h, 1d).
                      <br />
                      <strong>Simulation Speed:</strong> Control how quickly the
                      market simulation runs.
                    </p>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Advanced Tutorials
                </Button>
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Simulation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

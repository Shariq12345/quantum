"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Building2,
  DollarSign,
  Globe,
  Info,
  Layers,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components

interface FundamentalsProps {
  symbol: string;
}

interface StockData {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export const Fundamentals = ({ symbol }: FundamentalsProps) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setStockData(data[0]);
        } else {
          setError("No data found for the given symbol.");
        }
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-400">
        {error}
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        No data available.
      </div>
    );
  }

  return (
    <TooltipProvider>
      {" "}
      {/* Wrap the entire component with TooltipProvider */}
      <div className="space-y-6 py-6">
        <HeaderSection stockData={stockData} />
        <KeyMetrics stockData={stockData} />
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Company Details</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <OverviewTab stockData={stockData} />
          </TabsContent>
          <TabsContent value="details">
            <DetailsTab stockData={stockData} />
          </TabsContent>
          <TabsContent value="description">
            <DescriptionTab stockData={stockData} />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

const HeaderSection = ({ stockData }: { stockData: StockData }) => (
  <div className="flex items-center space-x-6 bg-card p-6 rounded-xl shadow-lg">
    <img
      src={stockData.image || "/placeholder.svg"}
      alt={stockData.companyName}
      className="w-15 h-14 rounded-lg object-cover bg-gray-200"
    />
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        {stockData.companyName}
      </h1>
      <p className="text-emerald-600 text-lg">
        {stockData.symbol} • {stockData.exchangeShortName}
      </p>
    </div>
  </div>
);

const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1e12) {
    return `${(marketCap / 1e12).toFixed(2)}T`; // Trillions
  } else if (marketCap >= 1e9) {
    return `${(marketCap / 1e9).toFixed(2)}B`; // Billions
  } else if (marketCap >= 1e6) {
    return `${(marketCap / 1e6).toFixed(2)}M`; // Millions
  } else {
    return marketCap.toLocaleString(); // Fallback for smaller numbers
  }
};

const KeyMetrics = ({ stockData }: { stockData: StockData }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {[
      {
        label: "Current Price",
        value: `${stockData.price} ${stockData.currency}`,
        icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
        tooltip: "The current price of the stock in the market.",
      },
      {
        label: "Market Cap",
        value: formatMarketCap(stockData.mktCap),
        icon: <BarChart3 className="h-5 w-5 text-emerald-600" />,
        tooltip: "The total market value of the company's shares.",
      },
      {
        label: "Beta",
        value: stockData.beta.toFixed(2),
        icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
        tooltip: "Measures the stock's volatility compared to the market.",
      },
      {
        label: "Avg Volume",
        value: `${(stockData.volAvg / 1e6).toFixed(2)}M`,
        icon: <Layers className="h-5 w-5 text-emerald-600" />,
        tooltip: "The average number of shares traded per day.",
      },
      {
        label: "Dividend",
        value: stockData.lastDiv.toFixed(2),
        icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
        tooltip: "The amount paid to shareholders as a portion of profits.",
      },
    ].map((metric, index) => (
      <Tooltip key={index}>
        {" "}
        {/* Wrap each metric in a Tooltip */}
        <TooltipTrigger asChild>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{metric.tooltip}</p> {/* Tooltip content */}
        </TooltipContent>
      </Tooltip>
    ))}
  </div>
);

const OverviewTab = ({ stockData }: { stockData: StockData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Company Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <InfoRow label="CEO" value={stockData.ceo} icon={<Users />} />
        <InfoRow label="Sector" value={stockData.sector} icon={<Layers />} />
        <InfoRow
          label="Industry"
          value={stockData.industry}
          icon={<Building2 />}
        />
        <InfoRow
          label="Employees"
          value={stockData.fullTimeEmployees}
          icon={<Users />}
        />
        <InfoRow label="Founded" value={stockData.ipoDate} icon={<Info />} />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <InfoRow label="Country" value={stockData.country} icon={<Globe />} />
        <InfoRow
          label="Address"
          value={stockData.address}
          icon={<Building2 />}
        />
        <InfoRow label="City" value={stockData.city} icon={<Building2 />} />
        <InfoRow label="State" value={stockData.state} icon={<Building2 />} />
        <InfoRow label="Zip" value={stockData.zip} icon={<Info />} />
      </CardContent>
    </Card>
  </div>
);

const DetailsTab = ({ stockData }: { stockData: StockData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Additional Details</CardTitle>
    </CardHeader>
    <CardContent>
      <InfoRow label="CIK" value={stockData.cik} icon={<Info />} />
      <InfoRow label="ISIN" value={stockData.isin} icon={<Info />} />
      <InfoRow label="CUSIP" value={stockData.cusip} icon={<Info />} />
      <InfoRow
        label="Exchange"
        value={stockData.exchange}
        icon={<Building2 />}
      />
      <InfoRow
        label="DCF"
        value={stockData.dcf.toFixed(2)}
        icon={<DollarSign />}
      />
      <InfoRow
        label="DCF Diff"
        value={stockData.dcfDiff.toFixed(2)}
        icon={<TrendingUp />}
      />
    </CardContent>
  </Card>
);

const DescriptionTab = ({ stockData }: { stockData: StockData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Company Description</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground leading-relaxed">
        {stockData.description}
      </p>
    </CardContent>
  </Card>
);

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="flex justify-between items-center py-2">
    <span className="flex items-center space-x-2 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </span>
    <span className="font-medium">{value}</span>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center space-x-6">
      <Skeleton className="w-16 h-16 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
);

export default Fundamentals;

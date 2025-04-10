"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Building2,
  DollarSign,
  FileText,
  Globe,
  Info,
  Layers,
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  ChevronUp,
  ChevronDown,
  CreditCard,
  Landmark,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface BalanceSheetItem {
  date: string;
  symbol: string;
  reportedCurrency: string;
  fiscalYear: string;
  period: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  netReceivables: number;
  inventory: number;
  propertyPlantEquipmentNet: number;
  longTermInvestments: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalDebt: number;
  [key: string]: any;
}

export const Fundamentals = ({ symbol }: FundamentalsProps) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch company profile data
        const profileResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`
        );
        const profileData = await profileResponse.json();

        // Fetch balance sheet data
        const balanceSheetResponse = await fetch(
          `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`
        );
        const balanceSheetData = await balanceSheetResponse.json();

        if (profileData && profileData.length > 0) {
          setStockData(profileData[0]);
          setBalanceSheetData(balanceSheetData);
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
      <div className="flex justify-center items-center h-64 text-destructive">
        <Info className="mr-2 h-5 w-5" />
        {error}
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No data available.
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 py-6">
        <HeaderSection stockData={stockData} />
        <KeyMetrics stockData={stockData} />
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="financials" className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              <span>Financials</span>
            </TabsTrigger>
            <TabsTrigger
              value="description"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Description</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <OverviewTab stockData={stockData} />
          </TabsContent>
          <TabsContent value="details">
            <DetailsTab stockData={stockData} />
          </TabsContent>
          <TabsContent value="financials">
            <FinancialsTab balanceSheetData={balanceSheetData} />
          </TabsContent>
          <TabsContent value="description">
            <DescriptionTab stockData={stockData} />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

const HeaderSection = ({ stockData }: { stockData: StockData }) => {
  const changeIsPositive = stockData.changes > 0;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card p-6 rounded-xl shadow-sm border border-border/40">
      <div className="flex items-center gap-4">
        <div className="bg-background p-3 rounded-xl shadow-sm border border-border/40">
          <img
            src={stockData.image || "/placeholder.svg?height=48&width=48"}
            alt={stockData.companyName}
            className="w-12 h-12 object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {stockData.companyName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="font-mono text-sm">
              {stockData.symbol}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {stockData.exchangeShortName}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-3xl font-bold">${stockData.price.toFixed(2)}</div>
        <div
          className={`flex items-center gap-1 ${changeIsPositive ? "text-emerald-500" : "text-rose-500"}`}
        >
          {changeIsPositive ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="font-medium">{stockData.changes.toFixed(2)}</span>
          <span className="text-sm">
            (
            {(
              (stockData.changes / (stockData.price - stockData.changes)) *
              100
            ).toFixed(2)}
            %)
          </span>
        </div>
      </div>
    </div>
  );
};

const formatNumber = (num: number, decimals = 2) => {
  if (num === null || num === undefined) return "N/A";

  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(decimals)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(decimals)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(decimals)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(decimals)}K`;
  } else {
    return `$${num.toFixed(decimals)}`;
  }
};

const KeyMetrics = ({ stockData }: { stockData: StockData }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {[
      {
        label: "Market Cap",
        value: formatNumber(stockData.mktCap, 2),
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
        value: `$${stockData.lastDiv.toFixed(2)}`,
        icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
        tooltip: "The amount paid to shareholders as a portion of profits.",
      },
      {
        label: "52W Range",
        value: stockData.range,
        icon: <CreditCard className="h-5 w-5 text-emerald-600" />,
        tooltip: "The price range over the last 52 weeks.",
      },
    ].map((metric, index) => (
      <Tooltip key={index}>
        <TooltipTrigger asChild>
          <Card className="hover:shadow-md transition-shadow duration-300 border border-border/40">
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
          <p className="text-xs">{metric.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    ))}
  </div>
);

const OverviewTab = ({ stockData }: { stockData: StockData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="border border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-emerald-600" />
          Company Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow
          label="CEO"
          value={stockData.ceo}
          icon={<Users className="text-emerald-600" />}
        />
        <InfoRow
          label="Sector"
          value={stockData.sector}
          icon={<Layers className="text-emerald-600" />}
        />
        <InfoRow
          label="Industry"
          value={stockData.industry}
          icon={<Building2 className="text-emerald-600" />}
        />
        <InfoRow
          label="Employees"
          value={stockData.fullTimeEmployees}
          icon={<Users className="text-emerald-600" />}
        />
        <InfoRow
          label="Founded"
          value={stockData.ipoDate}
          icon={<Calendar className="text-emerald-600" />}
        />
      </CardContent>
    </Card>
    <Card className="border border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-emerald-600" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow
          label="Country"
          value={stockData.country}
          icon={<Globe className="text-emerald-600" />}
        />
        <InfoRow
          label="Address"
          value={stockData.address}
          icon={<Building2 className="text-emerald-600" />}
        />
        <InfoRow
          label="City"
          value={stockData.city}
          icon={<Building2 className="text-emerald-600" />}
        />
        <InfoRow
          label="State"
          value={stockData.state}
          icon={<Building2 className="text-emerald-600" />}
        />
        <InfoRow
          label="Zip"
          value={stockData.zip}
          icon={<Info className="text-emerald-600" />}
        />
      </CardContent>
    </Card>
  </div>
);

const DetailsTab = ({ stockData }: { stockData: StockData }) => (
  <Card className="border border-border/40 shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-emerald-600" />
        Additional Details
      </CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <InfoRow
          label="CIK"
          value={stockData.cik}
          icon={<Info className="text-emerald-600" />}
        />
        <InfoRow
          label="ISIN"
          value={stockData.isin}
          icon={<Info className="text-emerald-600" />}
        />
        <InfoRow
          label="CUSIP"
          value={stockData.cusip}
          icon={<Info className="text-emerald-600" />}
        />
      </div>
      <div className="space-y-4">
        <InfoRow
          label="Exchange"
          value={stockData.exchange}
          icon={<Building2 className="text-emerald-600" />}
        />
        <InfoRow
          label="DCF"
          value={`$${stockData.dcf.toFixed(2)}`}
          icon={<DollarSign className="text-emerald-600" />}
        />
        <InfoRow
          label="DCF Diff"
          value={stockData.dcfDiff.toFixed(2)}
          icon={<TrendingUp className="text-emerald-600" />}
        />
      </div>
    </CardContent>
  </Card>
);

const FinancialsTab = ({
  balanceSheetData,
}: {
  balanceSheetData: BalanceSheetItem[];
}) => {
  if (!balanceSheetData || balanceSheetData.length === 0) {
    return (
      <Card className="border border-border/40 shadow-sm">
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="h-10 w-10 mb-2" />
            <p>No balance sheet data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by date (newest first)
  const sortedData = [...balanceSheetData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-emerald-600" />
            Balance Sheet
          </CardTitle>
          <CardDescription>
            Annual balance sheet statements for {sortedData[0].symbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Item</TableHead>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableHead
                      key={item.date}
                      className="text-right font-medium"
                    >
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: "numeric",
                      })}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-medium">Assets</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`assets-${item.date}`}
                      className="text-right"
                    ></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Cash & Equivalents</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell key={`cash-${item.date}`} className="text-right">
                      {formatNumber(item.cashAndCashEquivalents)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Short-Term Investments</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`short-inv-${item.date}`}
                      className="text-right"
                    >
                      {formatNumber(item.shortTermInvestments)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Receivables</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`receivables-${item.date}`}
                      className="text-right"
                    >
                      {formatNumber(item.netReceivables)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Inventory</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`inventory-${item.date}`}
                      className="text-right"
                    >
                      {formatNumber(item.inventory)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Property & Equipment</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell key={`ppe-${item.date}`} className="text-right">
                      {formatNumber(item.propertyPlantEquipmentNet)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Long-Term Investments</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`long-inv-${item.date}`}
                      className="text-right"
                    >
                      {formatNumber(item.longTermInvestments)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell>Total Assets</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`total-assets-${item.date}`}
                      className="text-right font-medium"
                    >
                      {formatNumber(item.totalAssets)}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow className="bg-muted/50">
                  <TableCell className="font-medium">Liabilities</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`liabilities-${item.date}`}
                      className="text-right"
                    ></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Short-Term Debt</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`short-debt-${item.date}`}
                      className="text-right"
                    >
                      {formatNumber(item.shortTermDebt)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Long-Term Debt</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`long-debt-${item.date}`}
                      className="text-right"
                    >
                      {formatNumber(item.longTermDebt)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell>Total Liabilities</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`total-liab-${item.date}`}
                      className="text-right font-medium"
                    >
                      {formatNumber(item.totalLiabilities)}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow className="font-medium">
                  <TableCell>Total Equity</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`total-equity-${item.date}`}
                      className="text-right font-medium"
                    >
                      {formatNumber(item.totalEquity)}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow className="font-medium bg-muted/50">
                  <TableCell>Total Liabilities & Equity</TableCell>
                  {sortedData.slice(0, 3).map((item) => (
                    <TableCell
                      key={`total-liab-equity-${item.date}`}
                      className="text-right font-medium"
                    >
                      {formatNumber(item.totalLiabilitiesAndTotalEquity)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Key Financial Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedData.length > 0 && (
              <>
                <MetricCard
                  title="Debt to Equity"
                  value={(
                    sortedData[0].totalDebt / sortedData[0].totalEquity
                  ).toFixed(2)}
                  description="Measures financial leverage"
                />
                <MetricCard
                  title="Current Ratio"
                  value={(
                    sortedData[0].totalCurrentAssets /
                    sortedData[0].totalCurrentLiabilities
                  ).toFixed(2)}
                  description="Measures short-term liquidity"
                />
                <MetricCard
                  title="Cash Ratio"
                  value={(
                    sortedData[0].cashAndCashEquivalents /
                    sortedData[0].totalCurrentLiabilities
                  ).toFixed(2)}
                  description="Measures immediate liquidity"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) => (
  <div className="bg-muted/30 p-4 rounded-lg border border-border/40">
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
);

const DescriptionTab = ({ stockData }: { stockData: StockData }) => (
  <Card className="border border-border/40 shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-emerald-600" />
        Company Description
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {stockData.description}
      </p>

      <Separator className="my-6" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
        <a
          href={stockData.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-emerald-600 hover:underline"
        >
          <Globe className="h-4 w-4" />
          Visit Website
        </a>

        {stockData.phone && (
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            {stockData.phone}
          </span>
        )}
      </div>
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
  <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
    <span className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </span>
    <span className="font-medium">{value || "N/A"}</span>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-8 p-6">
    <div className="flex items-center justify-between bg-card p-6 rounded-xl shadow-sm border border-border/40">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="border border-border/40">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
    </div>

    <Skeleton className="h-[500px] w-full rounded-xl" />
  </div>
);

export default Fundamentals;

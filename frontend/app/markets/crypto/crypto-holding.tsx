import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface CompanyHolding {
  name: string;
  symbol: string;
  country: string;
  total_holdings: number;
  total_entry_value_usd: number;
  total_current_value_usd: number;
  percentage_of_total_supply: number;
}

interface HoldingsData {
  total_holdings: number;
  total_value_usd: number;
  market_cap_dominance: number;
  companies: CompanyHolding[];
}

const formatValue = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
};

const CompanyCard = ({ company }: { company: CompanyHolding }) => (
  <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black text-lg truncate pr-2">
            {company.name}
          </h3>
          <span className="text-sm text-gray-400">{company.country}</span>
        </div>
        <p className="text-sm text-gray-400">{company.symbol}</p>
        <div className="space-y-2">
          <div>
            <p className="text-lg font-semibold text-emerald-600">
              {company.total_holdings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Coins Held</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-black">
              {formatValue(company.total_current_value_usd)}
            </p>
            <p className="text-sm text-gray-400">Current Value</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-purple-600">
              {(company.percentage_of_total_supply * 100).toFixed(3)}%
            </p>
            <p className="text-sm text-gray-400">Of Total Supply</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CryptoHoldings = () => {
  const [holdings, setHoldings] = useState<HoldingsData | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "ethereum">(
    "bitcoin"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHoldings = async (crypto: "bitcoin" | "ethereum") => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://api.coingecko.com/api/v3/companies/public_treasury/${crypto}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-4hbrwf6vweSPgqkPFxoUxx7u",
        },
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch holdings data");
      }
      const data = await response.json();
      setHoldings(data);
    } catch (error) {
      setError(`Error fetching ${crypto} holdings: ${error}`);
      console.error(`Error fetching ${crypto} holdings:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings(selectedCrypto);
  }, [selectedCrypto]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-500" />
            Company Holdings
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedCrypto === "bitcoin" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("bitcoin")}
              disabled={isLoading}
              className={
                selectedCrypto === "bitcoin" ? "bg-[#F79622] text-white" : ""
              }
            >
              Bitcoin
            </Button>
            <Button
              variant={selectedCrypto === "ethereum" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("ethereum")}
              disabled={isLoading}
              className={
                selectedCrypto === "ethereum" ? "bg-[#6170C2] text-white" : ""
              }
            >
              Ethereum
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading holdings data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              onClick={() => fetchHoldings(selectedCrypto)}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !error && holdings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {holdings.companies.map((company) => (
              <CompanyCard key={company.symbol} company={company} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoHoldings;

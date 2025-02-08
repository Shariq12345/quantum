import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

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
import { Line } from "react-chartjs-2";

interface RationaleProps {
  currentPrice: number;
  predictedPrice: number;
  technicalIndicators: {
    rsi: number;
    macd: number;
    macd_signal: number;
    bollinger_bands: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
}

type RationaleType = "positive" | "warning" | "neutral";

interface RationalePoint {
  key: string;
  text: string;
  type: RationaleType;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Add this new component for RSI visualization
const RSIGauge = ({ value }: { value: number }) => {
  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between text-xs text-gray-600">
        <span>Oversold</span>
        <span>Neutral</span>
        <span>Overbought</span>
      </div>
      <div className="relative h-2">
        <Progress value={value} className="h-2" />
        <div
          className="absolute top-0 w-2 h-4 bg-blue-600 transform -translate-y-1"
          style={{ left: `${value}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
};

// Add this new component for MACD visualization
const MACDChart = ({ macd, signal }: { macd: number; signal: number }) => {
  const data = {
    labels: ["Previous", "Current"],
    datasets: [
      {
        label: "MACD Line",
        data: [macd - 0.5, macd],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
      {
        label: "Signal Line",
        data: [signal - 0.5, signal],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="h-40 mt-2">
      <Line data={data} options={options} />
    </div>
  );
};

// Add this new component for Bollinger Bands visualization
const BollingerBandsChart = ({
  upper,
  middle,
  lower,
  currentPrice,
}: {
  upper: number;
  middle: number;
  lower: number;
  currentPrice: number;
}) => {
  const data = {
    labels: ["Previous", "Current"],
    datasets: [
      {
        label: "Upper Band",
        data: [upper - 1, upper],
        borderColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
      },
      {
        label: "Middle Band",
        data: [middle - 1, middle],
        borderColor: "rgba(54, 162, 235, 0.5)",
        fill: false,
      },
      {
        label: "Lower Band",
        data: [lower - 1, lower],
        borderColor: "rgba(75, 192, 192, 0.5)",
        fill: false,
      },
      {
        label: "Price",
        data: [currentPrice - 1, currentPrice],
        borderColor: "rgba(255, 206, 86, 1)",
        pointBackgroundColor: "rgba(255, 206, 86, 1)",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="h-40 mt-2">
      <Line data={data} options={options} />
    </div>
  );
};

const PredictionRationale = ({
  currentPrice,
  predictedPrice,
  technicalIndicators,
}: RationaleProps) => {
  const percentageChange =
    ((predictedPrice - currentPrice) / currentPrice) * 100;
  const isUptrend = predictedPrice > currentPrice;

  const getRationales = (): RationalePoint[] => {
    const points: RationalePoint[] = [];

    // RSI Check
    if (technicalIndicators.rsi > 70) {
      points.push({
        key: "RSI_OVERBOUGHT",
        text: "RSI is above 70, indicating the stock might be overbought and due for a correction.",
        type: "warning",
      });
    } else if (technicalIndicators.rsi < 30) {
      points.push({
        key: "RSI_OVERSOLD",
        text: "RSI is below 30, indicating the stock might be oversold and due for a recovery.",
        type: "positive",
      });
    } else {
      points.push({
        key: "RSI_NEUTRAL",
        text: "RSI is within the neutral range (30-70), suggesting no strong overbought or oversold signals.",
        type: "neutral",
      });
    }

    // MACD Check
    if (technicalIndicators.macd > technicalIndicators.macd_signal) {
      points.push({
        key: "MACD_BULLISH",
        text: "MACD line is above the signal line, indicating bullish momentum.",
        type: "positive",
      });
    } else {
      points.push({
        key: "MACD_BEARISH",
        text: "MACD line is below the signal line, indicating bearish momentum.",
        type: "warning",
      });
    }

    // Bollinger Bands Check
    if (currentPrice > technicalIndicators.bollinger_bands.upper) {
      points.push({
        key: "BB_ABOVE",
        text: "Price is above the upper Bollinger Band, suggesting the stock might be overbought.",
        type: "warning",
      });
    } else if (currentPrice < technicalIndicators.bollinger_bands.lower) {
      points.push({
        key: "BB_BELOW",
        text: "Price is below the lower Bollinger Band, suggesting the stock might be oversold.",
        type: "positive",
      });
    } else {
      points.push({
        key: "BB_WITHIN",
        text: "Price is within the Bollinger Bands, indicating stable market conditions.",
        type: "neutral",
      });
    }

    // Predicted Price Change
    points.push({
      key: "PRICE_CHANGE",
      text: `Predicted price represents a ${Math.abs(percentageChange).toFixed(2)}% ${
        isUptrend ? "increase" : "decrease"
      } compared to the current price.`,
      type: isUptrend ? "positive" : "warning",
    });

    return points;
  };

  const getExplanation = (key: string): string => {
    const explanations: Record<string, string> = {
      RSI_OVERBOUGHT:
        "The Relative Strength Index (RSI) suggests that buyers have been aggressively pushing the price up, which historically indicates a potential reversal. Consider this a warning sign for possible price correction.",
      RSI_OVERSOLD:
        "The RSI indicates that selling pressure has been excessive, which often precedes a price bounce. This oversold condition frequently attracts bargain hunters and can lead to a price recovery.",
      RSI_NEUTRAL:
        "The RSI is showing balanced buying and selling pressure. This typically suggests that the current price movement is sustainable and not driven by extreme market sentiment.",
      MACD_BULLISH:
        "The Moving Average Convergence Divergence (MACD) shows strengthening upward momentum. This positive crossover often precedes continued price increases and confirms the current uptrend.",
      MACD_BEARISH:
        "The MACD indicates weakening price momentum and potential downward pressure. This bearish signal suggests that sellers are gaining control and prices might continue to decline.",
      BB_ABOVE:
        "Price exceeding the upper Bollinger Band suggests unusual strength in the upward movement. Historically, this often leads to a reversion to the mean price level, though timing can vary.",
      BB_BELOW:
        "Price falling below the lower Bollinger Band indicates unusual weakness. While this suggests a potential bounce back to normal levels, timing the reversal requires additional confirmation signals.",
      BB_WITHIN:
        "Price movement within the Bollinger Bands suggests normal market volatility. This typically indicates a more predictable trading environment with lower risk of sudden price swings.",
      PRICE_CHANGE: `Based on the analysis of multiple technical indicators and historical patterns, the model predicts a significant price movement. This prediction takes into account current market conditions and momentum.`,
    };

    return (
      explanations[key] ||
      "Additional analysis information is currently unavailable."
    );
  };

  const getIconForType = (type: RationaleType) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "neutral":
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm shadow-md rounded-lg p-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUptrend ? (
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600" />
            )}
            <CardTitle className="text-2xl text-gray-800">
              Prediction Rationale
            </CardTitle>
          </div>
          <Badge
            variant={isUptrend ? "default" : "destructive"}
            className="text-sm font-semibold"
          >
            {isUptrend ? "Bullish" : "Bearish"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {getRationales().map((rationale, index) => (
            <AccordionItem
              key={rationale.key}
              value={rationale.key}
              className={`
                  border rounded-lg p-2
                  ${rationale.type === "positive" ? "bg-emerald-50" : ""}
                  ${rationale.type === "warning" ? "bg-amber-50" : ""}
                  ${rationale.type === "neutral" ? "bg-blue-50" : ""}
                `}
            >
              <AccordionTrigger className="flex items-center justify-between w-full py-2 text-left text-gray-700 hover:no-underline">
                <div className="flex items-center gap-2">
                  {getIconForType(rationale.type)}
                  <span className="text-sm font-medium">{rationale.text}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-1">
                <p className="text-sm text-gray-600 pl-6">
                  {getExplanation(rationale.key)}
                </p>

                {/* Add visual components based on rationale type */}
                {rationale.key.startsWith("RSI") && (
                  <div className="mt-4 px-6">
                    <RSIGauge value={technicalIndicators.rsi} />
                  </div>
                )}

                {rationale.key.startsWith("MACD") && (
                  <div className="mt-4 px-6">
                    <MACDChart
                      macd={technicalIndicators.macd}
                      signal={technicalIndicators.macd_signal}
                    />
                  </div>
                )}

                {rationale.key.startsWith("BB") && (
                  <div className="mt-4 px-6">
                    <BollingerBandsChart
                      upper={technicalIndicators.bollinger_bands.upper}
                      middle={technicalIndicators.bollinger_bands.middle}
                      lower={technicalIndicators.bollinger_bands.lower}
                      currentPrice={currentPrice}
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-6 flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <span className="text-sm font-medium">Prediction Confidence</span>
          <Badge
            variant={Math.abs(percentageChange) > 10 ? "default" : "outline"}
            className="text-xs"
          >
            {Math.abs(percentageChange) > 10 ? "High" : "Moderate"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionRationale;

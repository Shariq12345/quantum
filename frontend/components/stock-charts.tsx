import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickData,
  LineStyle,
  Time,
  ColorType,
} from "lightweight-charts";

interface StockChartProps {
  data: CandlestickData[];
  volumeData?: { time: Time; value: number }[];
  indicators?: {
    sma?: { time: Time; value: number }[];
    rsi?: { time: Time; value: number }[];
    macd?: { time: Time; value: number }[];
  };
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  volumeData,
  indicators,
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(0);
  const theme = {
    background: "#131722",
    textColor: "#d1d4dc",
    fontSize: 12,
    fontFamily: "'Inter', sans-serif",
    gridColor: "rgba(42, 46, 57, 0.8)",
    crosshairColor: "rgba(255, 255, 255, 0.4)",
    upColor: "#26a69a",
    downColor: "#ef5350",
    borderColor: "#2a2e39",
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",
  };

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    const container = chartContainerRef.current;
    setChartHeight(container.clientHeight);

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: theme.background },
        textColor: theme.textColor,
        fontSize: theme.fontSize,
        fontFamily: theme.fontFamily,
      },
      grid: {
        vertLines: { color: theme.gridColor, style: LineStyle.Dotted },
        horzLines: { color: theme.gridColor, style: LineStyle.Dotted },
      },
      rightPriceScale: {
        borderColor: theme.borderColor,
        scaleMargins: { top: 0.2, bottom: 0.2 },
      },
      timeScale: {
        borderColor: theme.borderColor,
        timeVisible: true,
        secondsVisible: false,
        // tickMarkFormatter: (time: number) => {
        //   const date = new Date(time * 1000);
        //   return date.toLocaleString("en-US", {
        //     month: "short",
        //     day: "numeric",
        //     year: "numeric",
        //     hour: "2-digit",
        //     minute: "2-digit",
        //   });
        // },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: theme.crosshairColor,
          style: LineStyle.Dashed,
        },
        horzLine: {
          width: 1,
          color: theme.crosshairColor,
          style: LineStyle.Dashed,
        },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: theme.upColor,
      downColor: theme.downColor,
      borderVisible: false,
      wickUpColor: theme.wickUpColor,
      wickDownColor: theme.wickDownColor,
    });

    candlestickSeries.setData(data);

    // if (volumeData) {
    //   const volumeSeries = chart.addHistogramSeries({
    //     color: theme.upColor,
    //     priceFormat: { type: "volume" },
    //     priceScaleId: "volume",
    //     scaleMargins: { top: 0.8, bottom: 0 },
    //   });
    //   volumeSeries.setData(volumeData);
    // }

    // // Add indicators if present
    // if (indicators?.sma) {
    //   const smaSeries = chart.addLineSeries({
    //     color: "#2962FF",
    //     lineWidth: 1.5,
    //     title: "SMA",
    //   });
    //   smaSeries.setData(indicators.sma);
    // }

    // if (indicators?.rsi) {
    //   const rsiSeries = chart.addLineSeries({
    //     color: "#6b5b95",
    //     lineWidth: 1.5,
    //     title: "RSI",
    //   });
    //   rsiSeries.setData(indicators.rsi);
    // }

    // if (indicators?.macd) {
    //   const macdSeries = chart.addLineSeries({
    //     color: "#f4a261",
    //     lineWidth: 1.5,
    //     title: "MACD",
    //   });
    //   macdSeries.setData(indicators.macd);
    // }

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || param.point === undefined) return;

      const price = param.seriesData.get(candlestickSeries);
      if (price) {
        const { open, high, low, close } = price as CandlestickData;
        const legendElement = document.getElementById("legend");
        if (legendElement) {
          legendElement.innerHTML = `
            <div class="flex space-x-4 text-sm">
              <span class="text-black">O: <span class="text-black">${open.toFixed(
                2
              )}</span></span>
              <span class="text-black">H: <span class="text-black">${high.toFixed(
                2
              )}</span></span>
              <span class="text-black">L: <span class="text-black">${low.toFixed(
                2
              )}</span></span>
              <span class="text-black">C: <span class="text-black">${close.toFixed(
                2
              )}</span></span>
            </div>
          `;
        }
      }
    });

    const handleResize = () => {
      if (container) {
        chart.applyOptions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, volumeData, indicators, theme]);

  return (
    <div className="w-full h-full flex flex-col">
      <div id="legend" className="h-6 mb-2 text-white" />
      <div ref={chartContainerRef} className="flex-1" />
    </div>
  );
};

export default StockChart;

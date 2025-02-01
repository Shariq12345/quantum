import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Shield, AlertTriangle } from "lucide-react";

const DisclaimerSection = () => {
  return (
    <div className="mt-6 mb-8">
      <Card className="bg-gray-1s00 border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-blue-900">
                  Educational Purpose
                </h4>
                <p className="text-sm text-slate-600">
                  All predictions and analysis are for educational and
                  informational purposes only.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-50 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-amber-900">
                  Not Financial Advice
                </h4>
                <p className="text-sm text-slate-600">
                  Predictions may not reflect actual market conditions. Always
                  conduct your own research.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-emerald-900">
                  Risk Awareness
                </h4>
                <p className="text-sm text-slate-600">
                  Past performance and predictions do not guarantee future
                  results.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisclaimerSection;

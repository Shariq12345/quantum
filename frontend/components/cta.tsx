import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white ">
              Start Trading with AI Today 🚀
            </h2>
            <p className="text-emerald-500 max-w-2xl mx-auto mb-8">
              Experience the future of trading with our AI-driven platform. Get
              a competitive edge in stock market analysis and prediction.
            </p>
            <Button
              onClick={() => {}}
              variant="secondary"
              size="lg"
              className="min-w-[200px]"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTA;

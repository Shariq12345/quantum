"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const NFT_IDS = [
  "autoglyphs",
  "meebits",
  "spacepunksclub",
  "starkade-legion",
  "mooncats-acclimated",
  "beranames",
  "0n1force",
  "0rphans",
  "0xmons",
  "10ktf-combat-gear",
];

type NFTData = {
  id: string;
  image: { small: string };
  name: string;
  symbol: string;
  floor_price: { usd: number };
  floor_price_24h_percentage_change: { usd: number };
};

const fetchNFTData = async (id: string): Promise<NFTData | null> => {
  const url = `https://api.coingecko.com/api/v3/nfts/${id}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-4hbrwf6vweSPgqkPFxoUxx7u",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Fetch failed");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${id}:`, error);
    return null;
  }
};

export default function NFTTicker() {
  const [nftData, setNftData] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(NFT_IDS.map(fetchNFTData));
      setNftData(data.filter((nft): nft is NFTData => nft !== null));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-[120px]">
        {loading ? (
          <div className="flex justify-center items-center w-full h-32">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          nftData.map((nft) => (
            <Card key={nft.id} className="p-4 shadow-lg rounded-lg">
              <CardContent className="flex flex-col items-center text-center">
                <img
                  src={nft.image.small}
                  alt={nft.name}
                  className="w-16 h-16 rounded-full mb-2"
                />
                <h3 className="text-lg font-semibold">{nft.name}</h3>
                <p className="text-gray-500">{nft.symbol}</p>
                <p className="text-green-500 font-bold">
                  ${nft.floor_price.usd.toFixed(2)}
                </p>
                <p
                  className={`text-sm ${
                    nft.floor_price_24h_percentage_change.usd < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {nft.floor_price_24h_percentage_change.usd.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

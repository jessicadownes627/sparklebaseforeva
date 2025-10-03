import React, { useEffect, useState } from "react";
import { fetchDealsFromSheet } from "../utils/fetchDealsFromSheet";

export default function DealsFlipCard() {
  const [deals, setDeals] = useState([]);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetchDealsFromSheet().then(setDeals);
  }, []);

  const deal = deals.length ? deals[0] : null;

  return (
    <div
      className="w-[300px] h-[400px] mx-auto my-4"
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="relative h-full w-full [perspective:1000px]">
        <div
          className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1740] border-2 border-purple-400 text-white rounded-2xl shadow-[0_0_20px_4px_rgba(168,85,247,0.5)] [backface-visibility:hidden]">
            <h3 className="text-lg font-bold mb-2">💸 Deals</h3>
            <p className="text-sm italic text-purple-300">Tap to reveal sweet perks ✨</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#E6E1FF] via-[#DDF7F2] to-[#E6E1FF] text-[#0a2540] p-4 rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {deal ? (
              <>
                <p className="mb-3 text-sm">{deal.Description}</p>
                {deal.LinkURL && (
                  <a
                    href={deal.LinkURL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block rounded-full bg-[#0a1740] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Redeem
                  </a>
                )}
              </>
            ) : (
              <p className="text-sm italic text-gray-500">
                New deals coming soon ✨
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

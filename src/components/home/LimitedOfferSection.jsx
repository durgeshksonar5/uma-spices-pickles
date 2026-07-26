import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const LimitedOfferSection = () => {
  // Store target expiration date (7 days in future from current fixed benchmark)
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 28
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Fixed offer end date: 7 days from initial render or stored in localStorage
    const getTargetTime = () => {
      const stored = localStorage.getItem('gajanan_offer_expiry');
      if (stored) return parseInt(stored, 10);
      const newExpiry = Date.now() + (3 * 86400 + 12 * 3600 + 45 * 60 + 28) * 1000;
      localStorage.setItem('gajanan_offer_expiry', newExpiry.toString());
      return newExpiry;
    };

    const targetTime = getTargetTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUnit = (val) => String(val).padStart(2, '0');

  return (
    <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-6 sm:p-8 flex flex-col items-center text-center justify-center space-y-6 relative overflow-hidden shadow-xs">
      {/* Decorative Chili & Spice Powder Accents */}
      <div className="absolute -top-10 -right-10 w-32 h-32 opacity-15 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=300"
          alt="Spice background artwork"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div>
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718] mb-2">
          Limited-Time Offer!
        </h3>
        <p className="text-sm text-[#777166]">
          Save up to 25% on selected products.
        </p>
      </div>

      {/* Countdown Timer Grid */}
      {isExpired ? (
        <div className="py-4 text-base font-bold text-[#5E3718]">
          Offer Ended
        </div>
      ) : (
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl p-3 min-w-[64px] sm:min-w-[72px] shadow-2xs">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-[#171717] block">
              {formatUnit(timeLeft.days)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#777166] uppercase font-semibold">
              Days
            </span>
          </div>

          <div className="bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl p-3 min-w-[64px] sm:min-w-[72px] shadow-2xs">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-[#171717] block">
              {formatUnit(timeLeft.hours)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#777166] uppercase font-semibold">
              Hours
            </span>
          </div>

          <div className="bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl p-3 min-w-[64px] sm:min-w-[72px] shadow-2xs">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-[#171717] block">
              {formatUnit(timeLeft.minutes)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#777166] uppercase font-semibold">
              Minutes
            </span>
          </div>

          <div className="bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl p-3 min-w-[64px] sm:min-w-[72px] shadow-2xs">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-[#171717] block">
              {formatUnit(timeLeft.seconds)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#777166] uppercase font-semibold">
              Seconds
            </span>
          </div>
        </div>
      )}

      {/* Button */}
      <Link
        to="/shop"
        className="px-8 py-3.5 rounded-lg bg-[#9A6428] text-white font-bold text-sm hover:bg-[#80511D] transition-colors shadow-xs"
      >
        Shop the Offer
      </Link>
    </div>
  );
};

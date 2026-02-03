"use client";
import { useEffect, useState } from "react";
import { anniversaryDate } from "@/lib/data";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(anniversaryDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 justify-center font-serif text-[#FF85A1] my-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm min-w-[70px]">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-xs uppercase tracking-widest">{unit}</span>
        </div>
      ))}
    </div>
  );
}
// src/components/SplashScreen.jsx
import React, { useEffect, useState } from "react";

const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timeout);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#a78bfa] text-white">
      <h1 className="text-5xl font-script drop-shadow text-white mb-4">
        Talk More Tonight
      </h1>
      <p className="italic text-white/80">Loading something magical...</p>
    </div>
  );
};

export default SplashScreen;

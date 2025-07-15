import React from "react";

const PageHeader = ({ glow = false }) => {
  const headingClass = `text-4xl font-script ${
    glow ? 'neon-yellow-glow' : 'drop-shadow-glow'
  }`;

  return (
    <header className="text-center mb-6 text-[#0a2540]">
      <h1 className={headingClass}>Talk More Tonight</h1>
      <p className="text-sm text-[#0a2540] font-medium mt-1">
        Talk to Us...before you talk to <em>Them</em> ✨
      </p>
    </header>
  );
};

export default PageHeader;


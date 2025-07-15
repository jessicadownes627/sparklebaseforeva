// src/components/ButtonGroup.jsx
import React from "react";

const ButtonGroup = ({ field, label, options, selected, onSelect }) => {
  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={field} className="block font-semibold mb-2 text-[#0a2540]">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map(({ value, label }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              onClick={() => onSelect(field, value)}
              className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                isSelected
                  ? "bg-white text-[#0a2540] font-semibold shadow-md"
                  : "bg-white/30 text-[#0a2540] border-[#0a2540] hover:bg-white/50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonGroup;

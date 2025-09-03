// src/components/DateTeamToggle.jsx
import React from "react";

/**
 * Chips-only team picker (no typing, no Add button)
 *
 * props:
 * - enabled: boolean
 * - value: string[]          (selected team names)
 * - onEnabledChange: fn(bool)
 * - onTeamsChange: fn(string[])
 * - suggestions: string[]    (city + selected-sport filtered list)
 * - labelText?: string
 * - max?: number             (optional selection cap)
 */
export default function DateTeamToggle({
  enabled,
  value = [],
  onEnabledChange = () => {},
  onTeamsChange = () => {},
  suggestions = [],
  labelText = "Date likes a specific team",
  max = 8,
}) {
  const norm = (s) => String(s || "").trim().toLowerCase();
  const isSelected = (t) => value.map(norm).includes(norm(t));

  const toggleTeam = (team) => {
    if (isSelected(team)) {
      onTeamsChange(value.filter((v) => norm(v) !== norm(team)));
    } else {
      if (value.length >= max) return;
      onTeamsChange([...value, team]);
    }
  };

  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#0b1220]/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="h-4 w-4 accent-indigo-500"
          />
          <span className="text-sm text-white">
            {labelText}
            <span className="ml-2 text-xs text-white/60">(boost their team’s news)</span>
          </span>
        </label>

        {enabled && (
          <span className="text-[11px] text-white/60">
            {value.length}/{max} selected
          </span>
        )}
      </div>

      {enabled && (
        <div className="mt-3">
          {suggestions.length === 0 ? (
            <p className="text-sm text-white/60 italic">
              No teams found for this city/sport selection.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 24).map((t) => {
                const selected = isSelected(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTeam(t)}
                    aria-pressed={selected}
                    className={[
                      "text-xs px-3 py-1 rounded-full border transition-all",
                      selected
                        ? "bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-300 shadow-[0_0_14px_rgba(99,102,241,0.45)]"
                        : "bg-white/5 text-white/80 border-white/15 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {selected ? "✓ " : ""}{t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

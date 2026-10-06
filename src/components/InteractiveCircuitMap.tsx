import React, { useState } from 'react';
import { SLIDES } from '../data/slidesData';
import { sound } from '../utils/audio';

interface InteractiveCircuitMapProps {
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  className?: string;
}

interface CircuitCheckpoint {
  id: number;
  label: string;
  short: string;
  cx: number;
  cy: number;
}

// 10 Stand / Sector Checkpoints positioned strategically along the karting track loop
const CHECKPOINTS: CircuitCheckpoint[] = [
  { id: 0, label: "01 Départ / Go Beyond", short: "S1", cx: 40, cy: 92 },
  { id: 1, label: "02 Rêver · Oser", short: "S2", cx: 80, cy: 92 },
  { id: 2, label: "03 Jouer · Rencontrer", short: "S3", cx: 135, cy: 88 },
  { id: 3, label: "04 Imaginer · Dessiner", short: "S4", cx: 180, cy: 68 },
  { id: 4, label: "05 Concevoir · Bâtir", short: "S5", cx: 185, cy: 26 },
  { id: 5, label: "06 S'équiper · Frémir", short: "S6", cx: 140, cy: 15 },
  { id: 6, label: "07 S'engager · Se Dépasser", short: "S7", cx: 95, cy: 38 },
  { id: 7, label: "08 Rassembler · Vibrer", short: "S8", cx: 46, cy: 22 },
  { id: 8, label: "09 Transmettre · S'élever", short: "S9", cx: 18, cy: 46 },
  { id: 9, label: "10 Paddock · Budget 🏁", short: "🏁", cx: 24, cy: 76 },
];

export const InteractiveCircuitMap: React.FC<InteractiveCircuitMapProps> = ({
  currentSlideIndex,
  onSelectSlide,
  className = "",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeCheckpoint = CHECKPOINTS[currentSlideIndex] || CHECKPOINTS[0];
  const displayedHover = hoveredIndex !== null ? CHECKPOINTS[hoveredIndex] : activeCheckpoint;

  const handleCheckpointClick = (idx: number) => {
    sound.playUiClick();
    onSelectSlide(idx);
  };

  return (
    <div className={`relative p-2.5 sm:p-3 rounded-2xl bg-black/80 border border-white/15 shadow-2xl backdrop-blur-md flex flex-col justify-between ${className}`}>
      
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
        <span className="flex items-center gap-1.5 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e00] animate-ping" />
          <span className="text-white font-bold tracking-wider">CIRCUIT INTERACTIF</span>
        </span>
        <span className="text-[#ff1e00] font-bold">
          STAND {String(currentSlideIndex + 1).padStart(2, '0')}/{String(CHECKPOINTS.length).padStart(2, '0')}
        </span>
      </div>

      {/* SVG Track with 9 Stand Checkpoints */}
      <div className="relative w-full aspect-[220/110] overflow-hidden">
        <svg 
          viewBox="0 0 220 110" 
          className="w-full h-full"
        >
          {/* Track Underlay Outer Border */}
          <path
            d="M 25,75 C 10,55 20,25 50,22 C 75,20 85,38 95,38 C 115,38 120,15 140,15 C 170,15 190,18 185,45 C 180,72 155,88 135,88 C 100,88 70,92 40,92 C 28,92 20,85 25,75 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Red Kerb Racing Line */}
          <path
            d="M 25,75 C 10,55 20,25 50,22 C 75,20 85,38 95,38 C 115,38 120,15 140,15 C 170,15 190,18 185,45 C 180,72 155,88 135,88 C 100,88 70,92 40,92 C 28,92 20,85 25,75 Z"
            fill="none"
            stroke="#ff1e00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
            opacity="0.75"
          />

          {/* Start / Finish Checkered Gate mark */}
          <line 
            x1="38" y1="87" x2="38" y2="97" 
            stroke="#ffffff" 
            strokeWidth="3" 
            strokeDasharray="1.5 1.5"
          />

          {/* 9 Clickable Stand / Sector Points */}
          {CHECKPOINTS.map((cp, idx) => {
            const isActive = idx === currentSlideIndex;
            const isHovered = idx === hoveredIndex;

            return (
              <g 
                key={cp.id} 
                className="cursor-pointer transition-transform group"
                onClick={() => handleCheckpointClick(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow ring for active stand */}
                {isActive && (
                  <circle
                    cx={cp.cx}
                    cy={cp.cy}
                    r="8.5"
                    fill="none"
                    stroke="#ff1e00"
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Special Checkered Damier Finish on Stand 10 vs Standard Sector Circles */}
                {idx === 9 ? (
                  <g>
                    {/* Damier outer ring */}
                    <circle
                      cx={cp.cx}
                      cy={cp.cy}
                      r={isActive ? "7.5" : isHovered ? "7" : "5.5"}
                      fill="#000000"
                      stroke={isActive ? "#ff1e00" : isHovered ? "#ffffff" : "#ff1e00"}
                      strokeWidth={isActive ? "2" : "1.5"}
                      className="transition-all duration-200"
                    />
                    {/* Checkered 4-square grid icon */}
                    <g transform={`translate(${cp.cx - 3}, ${cp.cy - 3})`} pointerEvents="none">
                      <rect x="0" y="0" width="3" height="3" fill="#ffffff" />
                      <rect x="3" y="0" width="3" height="3" fill="#000000" />
                      <rect x="0" y="3" width="3" height="3" fill="#000000" />
                      <rect x="3" y="3" width="3" height="3" fill="#ffffff" />
                    </g>
                  </g>
                ) : (
                  <>
                    {/* Base node circle */}
                    <circle
                      cx={cp.cx}
                      cy={cp.cy}
                      r={isActive ? "6" : isHovered ? "5.5" : "4.5"}
                      fill={isActive ? "#ff1e00" : isHovered ? "#ffffff" : "#1a1c23"}
                      stroke={isActive ? "#ffffff" : isHovered ? "#ff1e00" : "rgba(255,255,255,0.4)"}
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />

                    {/* Stand number label inside or near point */}
                    <text
                      x={cp.cx}
                      y={cp.cy + 2.8}
                      textAnchor="middle"
                      fontSize="5.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill={isActive ? "#ffffff" : isHovered ? "#000000" : "#a1a1aa"}
                      pointerEvents="none"
                    >
                      {idx + 1}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Racing Kart Position Icon on active checkpoint */}
          <g transform={`translate(${activeCheckpoint.cx - 5.5}, ${activeCheckpoint.cy - 12})`}>
            <rect x="0" y="0" width="11" height="6" rx="2" fill="#ff1e00" />
            <polygon points="5.5,6 3.5,8 7.5,8" fill="#ff1e00" />
            <text x="5.5" y="4.5" textAnchor="middle" fontSize="4" fontWeight="black" fill="#ffffff" fontFamily="monospace">
              #{String(currentSlideIndex + 1).padStart(2, '0')}
            </text>
          </g>
        </svg>
      </div>

      {/* Stand Info Bar on Hover / Active */}
      <div className="mt-1 flex items-center justify-between text-[10px] font-mono pt-1 border-t border-white/10">
        <span className="text-neutral-400 truncate max-w-[170px]">
          {displayedHover.label}
        </span>
        <span className="text-[#ff1e00] font-bold shrink-0">
          CHOISIR UN STAND
        </span>
      </div>

    </div>
  );
};

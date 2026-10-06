import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Compass } from 'lucide-react';

interface CircuitNarrativeNavigatorProps {
  onSelectSlide: (index: number) => void;
  currentSlideIndex?: number;
}

interface SectorData {
  slideIndex: number;
  standNumber: string;
  verbs: string;
  cx: number;
  cy: number;
  isDamier?: boolean;
}

const SECTORS: SectorData[] = [
  { slideIndex: 1, standNumber: "01", verbs: "RÊVER · OSER", cx: 40, cy: 92 },
  { slideIndex: 2, standNumber: "02", verbs: "JOUER · RENCONTRER", cx: 80, cy: 92 },
  { slideIndex: 3, standNumber: "03", verbs: "IMAGINER · DESSINER", cx: 135, cy: 88 },
  { slideIndex: 4, standNumber: "04", verbs: "CONCEVOIR · BÂTIR", cx: 185, cy: 26 },
  { slideIndex: 5, standNumber: "05", verbs: "S'ÉQUIPER · FRÉMIR", cx: 140, cy: 15 },
  { slideIndex: 6, standNumber: "06", verbs: "S'ENGAGER · SE DÉPASSER", cx: 95, cy: 38 },
  { slideIndex: 7, standNumber: "07", verbs: "RASSEMBLER · VIBRER", cx: 46, cy: 22 },
  { slideIndex: 8, standNumber: "08", verbs: "TRANSMETTRE · S'ÉLEVER", cx: 18, cy: 46 },
  { slideIndex: 9, standNumber: "10", verbs: "PADDOCK · BUDGET", cx: 24, cy: 76, isDamier: true },
];

export const CircuitNarrativeNavigator: React.FC<CircuitNarrativeNavigatorProps> = ({
  onSelectSlide,
  currentSlideIndex = 0
}) => {
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);

  const handleSectorClick = (slideIdx: number) => {
    sound.playUiClick();
    onSelectSlide(slideIdx);
  };

  const activeSector = hoveredSector !== null ? SECTORS[hoveredSector] : null;

  return (
    <div className="w-full rounded-2xl bg-[#08090d] border border-white/15 p-5 sm:p-7 shadow-2xl text-white relative overflow-hidden space-y-5">
      
      {/* Background Racing Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff1e00]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header of Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-[#ff1e00] text-white font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <span>🏁</span>
              <span>CARTE INTERACTIVE</span>
            </span>
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
              LE TRACÉ DE LA COURSE
            </span>
          </div>
          <h3 className="font-display italic font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
            LES PAIRES DE VERBES D'ACTION &amp; LE PADDOCK
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-neutral-400 bg-white/4 px-3 py-1.5 rounded-lg border border-white/10">
          <Compass className="w-3.5 h-3.5 text-[#ff1e00]" />
          <span>CHOISIR UN STAND</span>
        </div>
      </div>

      {/* Main Track & Interactive Stations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* SVG Track Interactive Canvas (Col 5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-black/60 border border-white/10 shadow-inner flex flex-col justify-between relative group">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff1e00] animate-ping" />
              <span className="text-white font-bold tracking-wider">CIRCUIT DU BÉNIN</span>
            </span>
            <span className="text-[#ff1e00] font-bold">
              {activeSector ? `STAND ${activeSector.standNumber}` : "CHOISIR UN STAND"}
            </span>
          </div>

          <div className="relative w-full aspect-[220/120]">
            <svg viewBox="0 0 220 120" className="w-full h-full">
              {/* Outer Track Bed */}
              <path
                d="M 25,75 C 10,55 20,25 50,22 C 75,20 85,38 95,38 C 115,38 120,15 140,15 C 170,15 190,18 185,45 C 180,72 155,88 135,88 C 100,88 70,92 40,92 C 28,92 20,85 25,75 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Red racing kerb */}
              <path
                d="M 25,75 C 10,55 20,25 50,22 C 75,20 85,38 95,38 C 115,38 120,15 140,15 C 170,15 190,18 185,45 C 180,72 155,88 135,88 C 100,88 70,92 40,92 C 28,92 20,85 25,75 Z"
                fill="none"
                stroke="#ff1e00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5 3"
                opacity="0.8"
              />

              {/* Checkered Start Gate mark */}
              <line 
                x1="38" y1="86" x2="38" y2="98" 
                stroke="#ffffff" 
                strokeWidth="3.5" 
                strokeDasharray="2 2"
              />

              {/* 9 Sectors / Checkpoints */}
              {SECTORS.map((sec, idx) => {
                const isHovered = hoveredSector === idx;
                const isCurrent = currentSlideIndex === sec.slideIndex;

                return (
                  <g 
                    key={sec.standNumber}
                    className="cursor-pointer transition-transform"
                    onClick={() => handleSectorClick(sec.slideIndex)}
                    onMouseEnter={() => setHoveredSector(idx)}
                    onMouseLeave={() => setHoveredSector(null)}
                  >
                    {/* Pulsing ring on hover/current */}
                    {(isHovered || isCurrent) && (
                      <circle
                        cx={sec.cx}
                        cy={sec.cy}
                        r="10"
                        fill="none"
                        stroke="#ff1e00"
                        strokeWidth="1.5"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {sec.isDamier ? (
                      /* Stand 10 Damier (Checkered Flag) */
                      <g>
                        <circle
                          cx={sec.cx}
                          cy={sec.cy}
                          r={isHovered ? "8.5" : "7"}
                          fill="#000000"
                          stroke={isHovered ? "#ffffff" : "#ff1e00"}
                          strokeWidth={isHovered ? "2.5" : "2"}
                          className="transition-all duration-200"
                        />
                        <g transform={`translate(${sec.cx - 3.5}, ${sec.cy - 3.5})`} pointerEvents="none">
                          <rect x="0" y="0" width="3.5" height="3.5" fill="#ffffff" />
                          <rect x="3.5" y="0" width="3.5" height="3.5" fill="#000000" />
                          <rect x="0" y="3.5" width="3.5" height="3.5" fill="#000000" />
                          <rect x="3.5" y="3.5" width="3.5" height="3.5" fill="#ffffff" />
                        </g>
                      </g>
                    ) : (
                      /* Standard Sector Circle */
                      <>
                        <circle
                          cx={sec.cx}
                          cy={sec.cy}
                          r={isHovered ? "7" : isCurrent ? "6.5" : "5"}
                          fill={isHovered || isCurrent ? "#ff1e00" : "#14161f"}
                          stroke={isHovered ? "#ffffff" : isCurrent ? "#ff1e00" : "rgba(255,255,255,0.4)"}
                          strokeWidth="1.5"
                          className="transition-all duration-200"
                        />
                        <text
                          x={sec.cx}
                          y={sec.cy + 3}
                          textAnchor="middle"
                          fontSize="6"
                          fontWeight="bold"
                          fontFamily="monospace"
                          fill={isHovered || isCurrent ? "#ffffff" : "#a1a1aa"}
                          pointerEvents="none"
                        >
                          {sec.standNumber}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-white/4 border border-white/8 text-xs font-sans flex items-center justify-between">
            <span className="text-neutral-300">
              {activeSector ? (
                <>STAND {activeSector.standNumber} : <strong className="text-white">{activeSector.verbs}</strong></>
              ) : (
                "Choisir un stand pour y accéder directement."
              )}
            </span>
            <span className="font-mono text-[#ff1e00] font-bold shrink-0 ml-2">
              CHOISIR ➔
            </span>
          </div>
        </div>

        {/* Sector Interactive Cards Grid (Col 7) — Clean, Verbs only, no description, no open button, no timecodes */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SECTORS.map((sec, idx) => {
            const isHovered = hoveredSector === idx;
            const isCurrent = currentSlideIndex === sec.slideIndex;

            return (
              <div
                key={sec.standNumber}
                onClick={() => handleSectorClick(sec.slideIndex)}
                onMouseEnter={() => setHoveredSector(idx)}
                onMouseLeave={() => setHoveredSector(null)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  sec.isDamier
                    ? isHovered
                      ? 'bg-[#ff1e00] border-[#ff1e00] text-white shadow-[0_0_20px_rgba(255,30,0,0.5)] scale-[1.02]'
                      : 'bg-black border-[#ff1e00]/60 text-white hover:border-[#ff1e00]'
                    : isHovered
                    ? 'bg-white/10 border-[#ff1e00] shadow-[0_0_15px_rgba(255,30,0,0.25)] scale-[1.02]'
                    : 'bg-white/3 border-white/8 hover:border-white/20 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    sec.isDamier 
                      ? 'bg-[#ff1e00] text-white' 
                      : 'bg-white/10 text-[#ff1e00]'
                  }`}>
                    {sec.isDamier ? "🏁 STAND 10" : `STAND ${sec.standNumber}`}
                  </span>
                </div>

                <h4 className="font-display font-black text-xs sm:text-[13px] text-white uppercase tracking-tight group-hover:text-[#ff1e00] transition-colors leading-snug">
                  {sec.verbs}
                </h4>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

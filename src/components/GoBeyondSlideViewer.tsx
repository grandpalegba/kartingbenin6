import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, 
  Activity, Film, Mic, Music, CheckCircle2, ArrowRight, X, ZoomIn
} from 'lucide-react';
import { SLIDES, SlideData, resolveImage } from '../data/slidesData';
import { SIXTEEN_VERBS } from '../data/dossier16PagesData';
import { InteractiveCircuitMap } from './InteractiveCircuitMap';
import { CircuitNarrativeNavigator } from './CircuitNarrativeNavigator';
import { PlanningBudgetSection } from './PlanningBudgetSection';
import { audioSystem } from '../utils/audioSystem';
import { sound } from '../utils/audio';
import { scrollToSlideTop } from '../utils/scrollHelper';

/**
 * Custom Silhouette Kart Icon for "LA SIGNATURE KART"
 */
const KartIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-[#ff1e00]" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Kart rear & front wheels */}
    <circle cx="5" cy="18" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    {/* Chassis & floor */}
    <path d="M7.5 18h9" />
    {/* Side pod & cockpit frame */}
    <path d="M5 15.5L7.5 11h6.5l3 4.5" />
    {/* Steering column */}
    <path d="M11 8.5l-2 2.5" />
    {/* Driver helmet */}
    <circle cx="11.5" cy="6" r="1.8" />
    {/* Front spoiler & nosecone */}
    <path d="M14 11l2-2h3" />
  </svg>
);

export const GoBeyondSlideViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [audioState, setAudioState] = useState(audioSystem.getState());
  const [isPlayingFx, setIsPlayingFx] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string; caption?: string } | null>(null);

  const currentSlide: SlideData = SLIDES[currentSlideIndex];

  // Subscribe to audio state
  useEffect(() => {
    return audioSystem.subscribe((st) => setAudioState(st));
  }, []);

  // Always scroll to top when slide changes (essential on mobile)
  useLayoutEffect(() => {
    scrollToSlideTop();
  }, [currentSlideIndex]);

  useEffect(() => {
    scrollToSlideTop();
  }, [currentSlideIndex]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  const goToNextSlide = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      sound.playUiClick();
      setCurrentSlideIndex((prev) => prev + 1);
      setIsPlayingFx(false);
      scrollToSlideTop();
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      sound.playUiClick();
      setCurrentSlideIndex((prev) => prev - 1);
      setIsPlayingFx(false);
      scrollToSlideTop();
    }
  };

  const handleSelectSlide = (idx: number) => {
    sound.playUiClick();
    setCurrentSlideIndex(idx);
    setIsPlayingFx(false);
    scrollToSlideTop();
  };

  const handleToggleMute = () => {
    audioSystem.toggleSound();
  };

  const handleTriggerFilRougeSound = () => {
    setIsPlayingFx(true);
    audioSystem.playSlideSoundDesign(currentSlide.id);
    setTimeout(() => {
      setIsPlayingFx(false);
    }, 6500);
  };

  return (
    <div className="relative min-h-screen bg-[#07080a] text-white flex flex-col justify-between selection:bg-[#ff1e00] selection:text-white">
      {/* Invisible anchor target at very top for rock-solid mobile scroll-to-top */}
      <div id="slide-top-anchor" className="absolute top-0 left-0 w-0 h-0 pointer-events-none opacity-0" aria-hidden="true" />
      
      {/* =========================================================================
          1. TOP MINIMALIST & LIGHT NAVIGATION
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#07080a]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-8 py-2 sm:py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="flex w-4 h-3 sm:w-5 sm:h-3.5 overflow-hidden rounded-[2px] shadow-sm">
              <div className="w-1.5 sm:w-2 bg-[#008751]" />
              <div className="flex flex-col w-2.5 sm:w-3">
                <div className="h-1 sm:h-1.5 bg-[#fcd116]" />
                <div className="h-2 bg-[#e8112d]" />
              </div>
            </div>
            <span className="font-display font-black text-xs sm:text-sm tracking-wider uppercase text-white">
              BÉNIN
            </span>
            <span className="text-white/20 hidden md:inline">|</span>
            <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest hidden md:inline">
              KARTING INTERNATIONAL
            </span>
          </div>

          {/* Karting-Themed Navigation (Chevrons + Current Page on mobile, full pages on desktop) */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 p-1 rounded-xl bg-black/60 border border-white/15 shadow-inner shrink-0">
            {/* Left Kart Paddle / Chevron */}
            <button
              type="button"
              onClick={goToPrevSlide}
              disabled={currentSlideIndex === 0}
              className="p-1 sm:px-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition-all flex items-center justify-center -skew-x-6"
              title="Page précédente (Flèche gauche)"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Page Avant (Desktop only to guarantee mobile space for sound) */}
            {currentSlideIndex > 0 ? (
              <button
                type="button"
                onClick={goToPrevSlide}
                className="hidden md:flex w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/10 transition-colors items-center justify-center"
                title={`Aller à la page ${SLIDES[currentSlideIndex - 1].slideNumber}`}
              >
                {SLIDES[currentSlideIndex - 1].slideNumber}
              </button>
            ) : (
              <div className="hidden md:flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center opacity-20 font-mono text-xs text-neutral-500">
                —
              </div>
            )}

            {/* Page En Cours (Kart Racing Number Plate) */}
            <div className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg bg-[#ff1e00] text-white font-mono font-black text-xs sm:text-sm flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(255,30,0,0.45)] -skew-x-6">
              <span className="text-[9px] sm:text-[10px] text-white/70 tracking-tighter">N°</span>
              <span>{currentSlide.slideNumber}</span>
            </div>

            {/* Page Suivante (Desktop only) */}
            {currentSlideIndex < SLIDES.length - 1 ? (
              <button
                type="button"
                onClick={goToNextSlide}
                className="hidden md:flex w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/10 transition-colors items-center justify-center"
                title={`Aller à la page ${SLIDES[currentSlideIndex + 1].slideNumber}`}
              >
                {SLIDES[currentSlideIndex + 1].slideNumber}
              </button>
            ) : (
              <div className="hidden md:flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center opacity-20 font-mono text-xs text-neutral-500">
                —
              </div>
            )}

            {/* Right Kart Paddle / Chevron */}
            <button
              type="button"
              onClick={goToNextSlide}
              disabled={currentSlideIndex === SLIDES.length - 1}
              className="p-1 sm:px-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition-all flex items-center justify-center -skew-x-6"
              title="Page suivante (Flèche droite)"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick Jump to Paddock / Budget (Slide 10) */}
          <button
            type="button"
            onClick={() => handleSelectSlide(SLIDES.length - 1)}
            className={`hidden min-[480px]:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all -skew-x-6 border cursor-pointer shrink-0 ${
              currentSlideIndex === SLIDES.length - 1
                ? 'bg-[#ff1e00] text-white border-[#ff1e00] shadow-[0_0_15px_rgba(255,30,0,0.5)]'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/15 hover:border-[#ff1e00]/50'
            }`}
            title="Accéder directement au Budget & Paddock (Page 10)"
          >
            <span className="text-[11px]">🏁</span>
            <span>BUDGET</span>
          </button>

          {/* Sound Controls - Always 100% visible on mobile */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Écouter button in header */}
            <button
              type="button"
              onClick={handleTriggerFilRougeSound}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold transition-all ${
                isPlayingFx
                  ? 'border-[#ff1e00] bg-[#ff1e00] text-white shadow-[0_0_12px_rgba(255,30,0,0.5)] animate-pulse'
                  : 'border-[#ff1e00]/50 bg-[#ff1e00]/10 hover:bg-[#ff1e00] hover:text-white text-[#ff1e00]'
              }`}
              title="Écouter le son narratif de cette page"
            >
              {isPlayingFx ? (
                <Activity className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span className="font-bold">Écouter</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg border transition-colors ${
                audioState.isMuted
                  ? 'border-white/15 bg-white/5 text-neutral-400'
                  : 'border-[#ff1e00]/40 bg-[#ff1e00]/20 text-[#ff1e00]'
              }`}
              title={audioState.isMuted ? "Activer le son global" : "Couper le son"}
            >
              {audioState.isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. SLIDE CONTENT CANVAS
          ========================================================================= */}
      <main className="flex-1 max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-8 py-4 sm:py-6 flex flex-col space-y-6">
        
        {/* Sequence Title Bar & Interactive Circuit Map */}
        <div>
          {currentSlide.type === 'cover' ? (
            /* SLIDE 01: MASTER COVER TITLE WITH CIRCUIT MAP ON THE RIGHT */
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-5">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="font-display italic font-black text-2xl min-[360px]:text-[28px] min-[420px]:text-[32px] sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-none">
                    GO
                  </span>
                  <span className="font-display italic font-black text-2xl min-[360px]:text-[28px] min-[420px]:text-[32px] sm:text-5xl md:text-6xl lg:text-7xl text-[#ff1e00] tracking-tight uppercase leading-none drop-shadow-[0_0_20px_rgba(255,30,0,0.4)] pr-2">
                    BEYOND
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                  <span className="font-display font-black text-[11px] min-[360px]:text-xs sm:text-lg md:text-xl text-white uppercase tracking-wider whitespace-nowrap">
                    DU RÊVE À LA RÉALITÉ
                  </span>
                  <div className="flex gap-0.5 opacity-80 shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black border border-white/30" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black border border-white/30" />
                  </div>
                </div>
              </div>

              {/* Interactive Circuit Map on the right */}
              <div className="w-full sm:w-80 lg:w-72 shrink-0">
                <InteractiveCircuitMap
                  currentSlideIndex={currentSlideIndex}
                  onSelectSlide={handleSelectSlide}
                />
              </div>
            </div>
          ) : (
            /* SLIDES 02-10: SEQUENCE/STAND NAME, QUOTE & CIRCUIT ON THE RIGHT */
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-5">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#ff1e00] font-bold uppercase tracking-wider">
                    {currentSlide.subtitle}
                  </span>
                </div>
                <h1 className="font-display font-black text-2xl min-[360px]:text-3xl sm:text-5xl text-white tracking-tight uppercase break-words">
                  {currentSlide.title}
                </h1>

                {currentSlide.quote && (
                  <div className="text-sm sm:text-base italic text-neutral-300 font-sans border-l-2 border-[#ff1e00] pl-3 py-0.5">
                    {currentSlide.quote}
                  </div>
                )}
              </div>

              {/* Interactive Circuit Map on the right */}
              <div className="w-full sm:w-80 lg:w-72 shrink-0">
                <InteractiveCircuitMap
                  currentSlideIndex={currentSlideIndex}
                  onSelectSlide={handleSelectSlide}
                />
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            3. VISUEL PRINCIPAL DE LA PAGE
            - SLIDE 01: L'affiche / composition maîtresse complète (remplace les 4 images)
            - SLIDES 02-10: Les trois images fondamentales du chapitre
            ========================================================================= */}
        <div>
          {currentSlide.type === 'cover' ? (
            /* SLIDE 01: GRAND VISUEL MAÎTRE DE COUVERTURE */
            <div className="space-y-5">
              {/* Grand Visuel Maître Unique (Visuel pur sans texte superposé) */}
              <div 
                onClick={() => {
                  const masterSrc = resolveImage(currentSlide.masterCoverImage || currentSlide.panels[0].image);
                  setPreviewImage({
                    src: masterSrc,
                    title: "GO BEYOND — MASTER POSTER",
                    caption: currentSlide.panels[0]?.caption || "De l'enfant bâtissant son rêve à la piste internationale sur le littoral béninois"
                  });
                }}
                className="relative rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl group cursor-pointer"
                title="Cliquer pour agrandir en plein écran"
              >
                <div className="aspect-[16/9] w-full relative">
                  <img
                    src={resolveImage(currentSlide.masterCoverImage || currentSlide.panels[0].image)}
                    alt="Go Beyond — Master Poster"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const img = e.currentTarget;
                      const rawSrc = currentSlide.masterCoverImage || currentSlide.panels[0].image;
                      const filename = rawSrc.split('/').pop();
                      if (filename && !img.src.includes(`/images/${filename}`)) {
                        img.src = `/images/${filename}`;
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
                  />
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* SLIDES 02-10: LES TROIS IMAGES FONDAMENTALES DU CHAPITRE (16/9 NATIF SANS MASQUAGE) */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentSlide.panels.map((panel) => {
                const resolvedSrc = resolveImage(panel.image);
                return (
                  <div 
                    key={panel.id} 
                    onClick={() => setPreviewImage({ src: resolvedSrc, title: panel.title, caption: panel.caption })}
                    className="group flex flex-col rounded-xl overflow-hidden border border-white/15 bg-[#0b0d12] shadow-xl transition-all hover:border-[#ff1e00]/50 cursor-pointer"
                    title="Cliquer pour afficher la photo en grand"
                  >
                    {/* Cadre photo en 16/9 natif : 100% de la photo est visible sans rognage */}
                    <div className="aspect-[16/9] w-full relative bg-black overflow-hidden">
                      <img 
                        src={resolvedSrc} 
                        alt={panel.title}
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          const img = e.currentTarget;
                          const filename = panel.image.split('/').pop();
                          if (filename && !img.src.includes(`/images/${filename}`)) {
                            img.src = `/images/${filename}`;
                          }
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Légende nette positionnée sous la photo : zéro masquage sur l'image */}
                    <div className="p-3 bg-[#0d0f14] border-t border-white/10 text-left flex-1 flex flex-col justify-between">
                      <div>
                        <div className="font-display font-bold text-xs uppercase text-white tracking-tight leading-tight group-hover:text-[#ff1e00] transition-colors">
                          {panel.title}
                        </div>
                        {panel.caption && (
                          <p className="text-[11px] text-neutral-300 font-sans leading-relaxed mt-1">
                            {panel.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =========================================================================
            4. CONTENU ÉDITORIAL & SCÉNARISTIQUE
            - SLIDE 10 : CADRE CONTRACTUEL & BUDGET OFFICIEL (PLANNING & BUDGET)
            - SLIDE 01 (ACCUEIL) : MANIFESTE « GO BEYOND » + 4 PILIERS EN THÈME SOMBRE RACING (ZÉRO PANNEAU BLANC)
            - SLIDES 02-09 : FICHE SCRIPT DE TOURNAGE BLANCHE POUR LES 3 COLONNES
            ========================================================================= */}
        {currentSlide.type === 'budget' ? (
          <PlanningBudgetSection />
        ) : currentSlide.pillars ? (
          <>
            {/* SLIDE 01 (PAGE D'ACCUEIL) : SECTION A : MANIFESTE « GO BEYOND » (DARK RACING THEME) */}
            <div className="w-full rounded-2xl bg-[#090b0e] text-white p-4 sm:p-7 shadow-2xl border border-white/10 space-y-4">
              <div className="w-full border-b border-white/10 pb-4">
                <h3 className="font-display italic font-black text-xl sm:text-2xl text-white tracking-tight uppercase text-left">
                  {currentSlide.manifesto?.headline || "Go Beyond : le manifeste"}
                </h3>

                {currentSlide.manifesto?.quote && (
                  <p className="mt-2.5 text-xs sm:text-sm text-neutral-300 border-l-2 border-[#ff1e00] pl-3.5 font-sans leading-relaxed text-left">
                    {currentSlide.manifesto.quote}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs font-sans">
                {currentSlide.manifesto?.points.map((pt, idx) => (
                  <div 
                    key={pt.title}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 hover:border-[#ff1e00]/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[#ff1e00] font-bold uppercase text-[11px] tracking-wider">
                          {pt.num || `0${idx + 1}`}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e00]/60" />
                      </div>
                      <h4 className="font-display font-bold text-white uppercase text-sm mb-1.5 tracking-tight">
                        {pt.title}
                      </h4>
                      <p className="text-neutral-300 leading-relaxed font-light text-[12px]">
                        {pt.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLIDE 01 (PAGE D'ACCUEIL) : SECTION INTERMÉDIAIRE : LE TRACÉ DU CIRCUIT & NAVIGATION PAR LES VERBES D'ACTION AVEC DAMIER */}
            <CircuitNarrativeNavigator
              onSelectSlide={handleSelectSlide}
              currentSlideIndex={currentSlideIndex}
            />

            {/* SLIDE 01 (PAGE D'ACCUEIL) : SECTION B : LES QUATRE PILIERS DU RÉCIT (FOND BLANC ÉLÉGANT & RESPIRATION ÉDITORIALE) */}
            <div className="w-full rounded-2xl bg-white text-neutral-900 p-5 sm:p-8 shadow-2xl border border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-200 pb-3 mb-5">
                <span className="font-mono text-xs text-[#ff1e00] font-bold uppercase tracking-widest">
                  LES QUATRE PILIERS DU RÉCIT CINÉMATOGRAPHIQUE
                </span>
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                  STRUCTURE SCÉNARISTIQUE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {currentSlide.pillars.map((pil) => (
                  <div 
                    key={pil.num} 
                    className="p-4 sm:p-5 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-[#ff1e00]/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-full bg-[#ff1e00]/10 text-[#ff1e00] flex items-center justify-center font-mono font-bold text-xs">
                          0{pil.num}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                          PILIER {pil.num}
                        </span>
                      </div>

                      <h4 className="font-sans font-bold text-xs sm:text-[13px] text-neutral-900 leading-snug">
                        {pil.title}
                      </h4>

                      <div className="text-[10px] font-mono text-[#ff1e00] font-semibold leading-relaxed">
                        {pil.verbs}
                      </div>

                      <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">
                        {pil.desc}
                      </p>
                    </div>

                    <div className="h-0.5 w-8 bg-[#ff1e00] pt-1" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* SLIDES 02-09: STORY SCRIPT ANALYSIS ON CRISP WHITE */
          <div className="rounded-2xl bg-white text-neutral-900 p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff1e00]/10 text-[#ff1e00] flex items-center justify-center">
                    <Film className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-[11px] text-[#ff1e00] font-bold uppercase tracking-wider block">
                    À L'ÉCRAN
                  </span>
                </div>
                <p className="text-neutral-700 leading-relaxed font-light">
                  {currentSlide.ecranText}
                </p>
                <div className="h-0.5 w-8 bg-[#ff1e00] mt-2" />
              </div>

              <div className="space-y-2 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff1e00]/10 text-[#ff1e00] flex items-center justify-center">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-[11px] text-[#ff1e00] font-bold uppercase tracking-wider block">
                    CE QUE ÇA RACONTE
                  </span>
                </div>
                <p className="text-neutral-700 leading-relaxed font-light">
                  {currentSlide.raconteText}
                </p>
                <div className="h-0.5 w-8 bg-[#ff1e00] mt-2" />
              </div>

              <div className="space-y-2 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#ff1e00]/10 text-[#ff1e00] flex items-center justify-center">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-[11px] text-[#ff1e00] font-bold uppercase tracking-wider block">
                    RYTHME &amp; SON
                  </span>
                </div>
                <p className="text-neutral-700 leading-relaxed font-light">
                  {currentSlide.rythmeSonText}
                </p>
                <div className="h-0.5 w-8 bg-[#ff1e00] mt-2" />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. DUAL MOTORSPORT BLOCKS (SIGNATURE KART & FIL ROUGE SONORE QUI DONNE ENVIE)
            - Masqué sur la Slide 10 (Budget) pour laisser toute la place au cadre financier
            ========================================================================= */}
        {currentSlide.type !== 'budget' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Card 1: LA SIGNATURE KART (WITH KART ICON) */}
            <div className="md:col-span-5 p-5 rounded-xl bg-white/3 border border-white/10 space-y-2 relative">
              <div className="flex items-center gap-2 text-white font-display font-black text-sm uppercase">
                <KartIcon className="w-4 h-4 text-[#ff1e00]" />
                <span>LA SIGNATURE KART</span>
              </div>
              <div className="h-0.5 w-8 bg-[#ff1e00]" />
              <p className="text-xs text-neutral-300 leading-relaxed font-sans font-light">
                {currentSlide.signatureKartText}
              </p>
            </div>

            {/* Card 2: FIL ROUGE SONORE (EXPÉRIENCE AUDIO IMMERSIVE) */}
            <div className="md:col-span-7 p-5 rounded-xl bg-black border border-white/20 space-y-3 relative shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#ff1e00] font-display font-black text-sm uppercase">
                  <Activity className={`w-4 h-4 text-[#ff1e00] ${isPlayingFx ? 'animate-bounce' : 'animate-pulse'}`} />
                  <span>FIL ROUGE SONORE</span>
                </div>

                {/* Interactive Sound Trigger Button (No white background) */}
                <button
                  type="button"
                  onClick={handleTriggerFilRougeSound}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2 border ${
                    isPlayingFx 
                      ? 'bg-[#ff1e00] text-white border-[#ff1e00] shadow-[#ff1e00]/50 animate-pulse' 
                      : 'bg-white/10 hover:bg-[#ff1e00] text-neutral-200 hover:text-white border-white/20 hover:border-[#ff1e00]'
                  }`}
                  title="Lancer l'immersion sonore de ce chapitre"
                >
                  {isPlayingFx ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      <span>IMMERSION...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#ff1e00]" />
                      <span>ÉCOUTER</span>
                    </>
                  )}
                </button>
              </div>

              <div className="h-0.5 w-8 bg-[#ff1e00]" />

              {/* Pulsing Audio Waveform when active */}
              {isPlayingFx && (
                <div className="flex items-center gap-1 h-6 py-1 bg-white/5 rounded-lg px-3 border border-[#ff1e00]/30">
                  {[35, 75, 25, 95, 55, 100, 70, 45, 90, 65, 40, 80, 60, 85, 30, 95, 50, 70, 40, 85].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-[#ff1e00] rounded-full animate-pulse" 
                      style={{ height: `${h}%`, animationDelay: `${i * 45}ms` }} 
                    />
                  ))}
                </div>
              )}

              <p className="text-xs text-neutral-300 leading-relaxed font-sans font-light">
                {currentSlide.filRougeSonoreText}
              </p>
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
          6. BOTTOM FIA RACING CURB
          ========================================================================= */}
      <div className="w-full relative z-30 pointer-events-none">
        <div className="h-2.5 w-full flex overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 -skew-x-12 ${i % 2 === 0 ? 'bg-[#ff1e00]' : 'bg-white'}`} 
            />
          ))}
        </div>
      </div>

      {/* MODAL ZOOM PLEIN ÉCRAN POUR TOUTES LES IMAGES */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-[#ff1e00] text-white transition-colors"
            title="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="max-w-5xl max-h-[88vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={previewImage.src} 
              alt={previewImage.title}
              className="max-h-[75vh] max-w-full w-auto object-contain rounded-xl border border-white/20 shadow-2xl"
            />
            <div className="mt-3 text-center max-w-xl px-4">
              <h4 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-tight">
                {previewImage.title}
              </h4>
              {previewImage.caption && (
                <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-0.5">
                  {previewImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

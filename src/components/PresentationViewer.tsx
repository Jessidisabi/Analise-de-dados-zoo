import React, { useState, useEffect } from "react";
import { AIPresentationSlide } from "../types";
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, LayoutGrid, Layers, Calendar } from "lucide-react";

interface PresentationViewerProps {
  slides: AIPresentationSlide[];
}

export default function PresentationViewer({ slides }: PresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center text-slate-400">
        Nenhum slide disponível para os slides da apresentação executiva.
      </div>
    );
  }

  const slide = slides[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col gap-6">
      {/* Controls & Metas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Apresentação de Desempenho Executivo
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Slides corporativos de alto impacto gerados dinamicamente via Google AI Studio.
          </p>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              isPlaying 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
                : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Auto-Slideshow
              </>
            )}
          </button>
          <span className="text-xs text-slate-500 font-mono">
            {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Actual Slide Frame */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800/80 aspect-[16/9] w-full max-w-4xl mx-auto flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Slide Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 rounded-full bg-indigo-500"></span>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-semibold leading-none">
              Apresentação IA • Slide {slide.id || currentSlideIndex + 1}
            </span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-white hover:text-indigo-200 transition-colors tracking-tight leading-tight">
            {slide.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
            {slide.subtitle}
          </p>
        </div>

        {/* Slide Body / Layouts */}
        <div className="my-6 relative z-10 flex-grow flex flex-col justify-center">
          {slide.layout === "hero" ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 flex flex-col gap-2">
                {slide.bulletPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 text-xs sm:text-sm text-slate-300">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <div className="md:col-span-5 flex flex-col gap-3">
                {slide.metrics?.map((m, index) => (
                  <div key={index} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">{m.label}</span>
                    <span className="text-lg sm:text-xl font-extrabold text-indigo-300">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : slide.layout === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/45 p-5 rounded-xl border border-slate-800/50">
                <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-2">Resultados Chave</span>
                <div className="flex flex-col gap-2.5">
                  {slide.bulletPoints.map((point, index) => (
                    <p key={index} className="text-xs text-slate-300 leading-relaxed">
                      ➔ {point}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {slide.metrics?.map((m, index) => (
                  <div key={index} className="bg-slate-950/45 p-4 rounded-xl border border-slate-800/50 flex flex-col justify-center">
                    <span className="text-[9px] text-slate-500 block uppercase font-mono">{m.label}</span>
                    <span className="text-lg font-black text-emerald-400">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* default / two-column layout */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 flex flex-col gap-3 justify-center">
                {slide.bulletPoints.map((point, index) => (
                  <div key={index} className="bg-slate-950/30 px-4 py-2.5 rounded-lg border border-slate-800/40 text-xs sm:text-sm text-slate-300">
                    {point}
                  </div>
                ))}
              </div>
              <div className="md:col-span-4 flex flex-col justify-center gap-3">
                {slide.metrics?.map((m, index) => (
                  <div key={index} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-[9px] text-zinc-500 block uppercase font-semibold font-mono tracking-wide mb-1">
                      {m.label}
                    </span>
                    <span className="text-lg sm:text-2xl font-black text-rose-400 font-mono tracking-tight">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Slide Footer */}
        <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono relative z-10 mt-auto">
          <span>Relatório de Governança Corporativa - Abril 2024</span>
          <span className="bg-slate-950 px-2 py-1 rounded text-slate-400">
            Slide {currentSlideIndex + 1} de {slides.length}
          </span>
        </div>
      </div>

      {/* Indicator Pills & Navigation buttons */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto mt-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
          id="btn-slide-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="flex gap-1.5" id="slide-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlideIndex === idx ? "w-8 bg-indigo-500" : "w-2 bg-slate-800 hover:bg-slate-700"
              }`}
              title={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
          id="btn-slide-next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

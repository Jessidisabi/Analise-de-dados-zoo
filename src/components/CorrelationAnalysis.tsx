import React, { useState } from "react";
import { AICorrelation } from "../types";
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell
} from "recharts";
import { Award, ShieldAlert, LineChart, MessageSquare, TrendingDown, HelpCircle } from "lucide-react";

interface CorrelationAnalysisProps {
  correlations: AICorrelation[];
}

export default function CorrelationAnalysis({ correlations }: CorrelationAnalysisProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!correlations || correlations.length === 0) {
    return (
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center text-slate-400">
        Nenhuma correlação disponível para visualização. Clique em "Analisar com IA".
      </div>
    );
  }

  const activeCorr = correlations[selectedIndex];

  // Helper colors for impact tags
  const getImpactStyle = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case "alto":
      case "high":
        return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
      case "médio":
      case "medio":
      case "medium":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      default:
        return "bg-slate-800 text-slate-400 border border-slate-700";
    }
  };

  // Custom tool tip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-lg shadow-xl font-sans text-xs">
          <p className="font-bold text-white mb-1.5">{data.label}</p>
          <p className="text-slate-400">
            <span className="text-slate-500 font-mono">{activeCorr.metricX}:</span> {data.x}
          </p>
          <p className="text-slate-400">
            <span className="text-slate-500 font-mono">{activeCorr.metricY}:</span> {data.y}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* List of correlations */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1">
          Correlações Identificadas
        </h3>
        {correlations.map((corr, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.01] ${
              selectedIndex === idx
                ? "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/5"
                : "bg-slate-950 border-slate-900 hover:border-slate-800"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getImpactStyle(corr.impact)}`}>
                Impacto {corr.impact}
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-medium">
                {corr.coefficient.split("(")[0].trim()}
              </span>
            </div>
            <h4 className="font-bold text-white text-sm mt-3.5 leading-snug line-clamp-2">
              {corr.title}
            </h4>
          </button>
        ))}
      </div>

      {/* Interactive Graph Details */}
      <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold font-mono">
              Visão Detalhada & Coeficiente de Pearson
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1 leading-snug">
              {activeCorr.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs text-slate-500 font-mono">Índice Correlação</span>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-sm text-cyan-400 font-mono font-bold">
              {activeCorr.coefficient}
            </span>
          </div>
        </div>

        {/* The plot */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} />
                <XAxis 
                  dataKey="x" 
                  name={activeCorr.metricX} 
                  stroke="#64748b" 
                  fontSize={11}
                  type="number" 
                  domain={['auto', 'auto']}
                  label={{ value: activeCorr.metricX, position: 'bottom', offset: 0, fill: '#64748b', fontSize: 11 }} 
                />
                <YAxis 
                  dataKey="y" 
                  name={activeCorr.metricY} 
                  stroke="#64748b" 
                  fontSize={11}
                  type="number" 
                  domain={['auto', 'auto']}
                  label={{ value: activeCorr.metricY, angle: -90, position: 'left', fill: '#64748b', fontSize: 11 }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#3b82f6' }} />
                <Scatter name={activeCorr.title} data={activeCorr.dataPoints} fill="#3b82f6">
                  {activeCorr.dataPoints.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={selectedIndex % 2 === 0 ? "#3b82f6" : "#10b981"} 
                      fillOpacity={0.8}
                      stroke="#ffffff"
                      strokeWidth={1}
                      r={7}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analysis description */}
        <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-900 text-slate-300 leading-relaxed text-sm flex gap-4">
          <div className="shrink-0">
            <LineChart className="w-5 h-5 text-emerald-400 mt-1" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">
              Conclusão e Lógica Estatística
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm">
              {activeCorr.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { AIMindmapNode } from "../types";
import { Network, HelpCircle, GitFork, Info } from "lucide-react";

interface MindMapGraphicProps {
  nodes: AIMindmapNode[];
}

export default function MindMapGraphic({ nodes }: MindMapGraphicProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("root");

  if (!nodes || nodes.length === 0) {
    return (
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center text-slate-400">
        Nenhum nó do mapa mental disponível. Por favor, re-analise com a API.
      </div>
    );
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Group nodes by parent
  const rootNode = nodes.find(n => n.parent === "");
  const childrenOf = (parentId: string) => nodes.filter(n => n.parent === parentId);

  // Path from selected node back to central root
  const getSelectedPath = (nodeId: string): string[] => {
    const path: string[] = [];
    let current = nodes.find(n => n.id === nodeId);
    while (current) {
      path.push(current.id);
      current = nodes.find(n => n.id === current?.parent);
    }
    return path;
  };

  const activePath = getSelectedPath(selectedNodeId);

  return (
    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="border-b border-slate-800 pb-5 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          Mapa Mental de Correlações Corporativas
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Explore o mapa mental gerado pela IA. Clique nos nós para rastrear causas-raiz, desdobramentos operacionais e insights conectados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Web Interactive Tree Branch Canvas */}
        <div className="lg:col-span-8 bg-slate-900/30 rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-center min-h-[420px] relative overflow-hidden">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

          {rootNode && (
            <div className="flex flex-col items-center gap-8 relative z-10">
              {/* Root Node */}
              <button
                onClick={() => setSelectedNodeId(rootNode.id)}
                style={{ borderColor: rootNode.color || "#3b82f6" }}
                className={`px-5 py-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  selectedNodeId === rootNode.id
                    ? "bg-blue-500/10 text-white font-black scale-105 shadow-xl shadow-blue-500/10"
                    : "bg-slate-950 text-slate-300 font-bold hover:bg-slate-900"
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-0.5">Foco Central</div>
                <div>{rootNode.label}</div>
              </button>

              {/* Connector lines (rendered via SVG dynamically behind components or flex spacing) */}
              <div className="w-full h-0 border-t border-dashed border-slate-800 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-3 text-xs text-slate-500 italic font-mono uppercase">
                  Desdobramentos
                </div>
              </div>

              {/* First Level Branches */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                {childrenOf(rootNode.id).map(firstLevelNode => {
                  const subChildren = childrenOf(firstLevelNode.id);
                  const isNodeInPath = activePath.includes(firstLevelNode.id);

                  return (
                    <div key={firstLevelNode.id} className="flex flex-col items-center gap-4 border border-slate-800/20 bg-slate-950/20 p-4 rounded-xl">
                      {/* First level node */}
                      <button
                        onClick={() => setSelectedNodeId(firstLevelNode.id)}
                        style={{ 
                          borderColor: firstLevelNode.color || "#10b981",
                          boxShadow: selectedNodeId === firstLevelNode.id ? `0 0 15px ${firstLevelNode.color || "#10b981"}33` : "none"
                        }}
                        className={`px-4 py-2.5 rounded-lg border-2 text-xs font-bold text-center transition-all w-full ${
                          selectedNodeId === firstLevelNode.id
                            ? "bg-slate-900 text-white scale-102"
                            : isNodeInPath
                            ? "bg-slate-950 text-slate-200 border-dashed"
                            : "bg-slate-950/50 text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        {firstLevelNode.label}
                      </button>

                      {/* Second Level Nodes (Leaf nodes etc.) */}
                      {subChildren.length > 0 && (
                        <div className="flex flex-col gap-2 w-full mt-2 border-t border-slate-800/60 pt-3">
                          {subChildren.map(leafNode => {
                            const isLeafInPath = activePath.includes(leafNode.id);
                            return (
                              <button
                                key={leafNode.id}
                                onClick={() => setSelectedNodeId(leafNode.id)}
                                style={{ 
                                  borderLeftColor: leafNode.color || "#ef4444" 
                                }}
                                className={`text-left p-2 rounded text-[11px] border-l-4 transition-all w-full flex items-center gap-1.5 ${
                                  selectedNodeId === leafNode.id
                                    ? "bg-slate-900 border-slate-800 text-white font-bold"
                                    : isLeafInPath
                                    ? "bg-slate-950 border-slate-900 text-slate-300"
                                    : "bg-transparent text-slate-500 hover:text-slate-400 hover:bg-slate-900/10"
                                }`}
                              >
                                <GitFork className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="truncate">{leafNode.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Selected Node Details Sidepanel */}
        <div className="lg:col-span-4 flex flex-col gap-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider text-purple-400 uppercase">
            <Info className="w-4 h-4" />
            Nó Selecionado
          </div>

          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white">
              {selectedNode.label}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase mt-2 inline-block bg-slate-800 text-slate-400">
              ID: {selectedNode.id}
            </span>
          </div>

          <div>
            <h4 className="text-slate-400 text-xs font-mono mb-1.5 font-bold uppercase uppercase tracking-wide">
              Análise e Desdobramento
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedNode.description || "Este nó unifica métricas corporativas importantes descobertas e cruzadas pela inteligência artificial a partir de múltiplos registros de faturamento."}
            </p>
          </div>

          {selectedNode.parent && (
            <div className="mt-auto pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500 block">Nó pai associado:</span>
              <button 
                onClick={() => setSelectedNodeId(selectedNode.parent)}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 mt-1 underline"
              >
                ← {nodes.find(n => n.id === selectedNode.parent)?.label || selectedNode.parent}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

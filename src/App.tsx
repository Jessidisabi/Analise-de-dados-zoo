import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { 
  BarChart2, 
  FileText, 
  Network, 
  Presentation, 
  Sparkles, 
  Database,
  ChevronLeft, 
  ChevronRight, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  User, 
  Info, 
  Cpu, 
  Gauge, 
  CheckCircle2, 
  PieChart, 
  TrendingUp, 
  Clock, 
  Sliders,
  DollarSign,
  Utensils,
  Lightbulb
} from "lucide-react";
import { AIAnalysisResult, AICorrelation, AIMindmapNode, AIPresentationSlide, AIPdfReport } from "./types";
import DatasetViewer from "./components/DatasetViewer";
import CorrelationAnalysis from "./components/CorrelationAnalysis";
import MindMapGraphic from "./components/MindMapGraphic";

// Import raw data for displaying some simple metadata counts
import { orcamentos, refeicoes, chamados, funcionarios, comprasFeedback } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState<"correlations" | "pdf" | "mindmap" | "presentation" | "lab" | "datasets">("correlations");
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Initialize data on load
  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async (userPrompt?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customInstruction: userPrompt || "",
        }),
      });
      const data = await response.json();
      setAnalysis(data);
      setIsDemoMode(!!data.isFallback);
      setActiveSlide(0); // reset presentation slide to first slide
    } catch (err: any) {
      console.error("Error fetching analysis:", err);
      setErrorMsg("Falha ao comunicar com o servidor de análise. Utilizando dados locais fallback.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalysis(customPrompt);
  };

  const handleReset = () => {
    setCustomPrompt("");
    fetchAnalysis();
  };

  // Safe PDF generator with line-wrap algorithms and pagination
  const handleGeneratePdf = () => {
    if (!analysis || !analysis.pdfReport) return;
    const report = analysis.pdfReport;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const leftMargin = 20;
    const rightMargin = 20;
    const contentWidth = 170; // 210 - 40
    let currentY = 25;

    // Helper to check page boundaries and append new page
    const checkPageBreak = (heightNeeded: number) => {
      if (currentY + heightNeeded > 275) {
        doc.addPage();
        currentY = 25;
        // Draw page background border and header
        drawPageBorder();
        drawPageHeaderFooter();
      }
    };

    // Draw aesthetic outline frames on pages
    const drawPageBorder = () => {
      doc.setDrawColor(241, 245, 249); // slate-100 placeholder tone
      doc.setLineWidth(0.3);
      doc.rect(10, 10, 190, 277);
    };

    // Draw running headers and footers
    const drawPageHeaderFooter = () => {
      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("NexusAI // Dashboard de Correlações Corporativas", leftMargin, 16);
      doc.line(10, 18, 200, 18);

      doc.text("Criado com Inteligência Artificial Google Gemini", leftMargin, 281);
      doc.text("Faturamento, Recursos e Humores", 150, 281);
    };

    // Initialize Page 1
    drawPageBorder();
    drawPageHeaderFooter();

    // 1. Cover Title & Subtitle
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // slate-800
    const titleLines = doc.splitTextToSize(report.title || "Relatório de Correlações Corporativas", contentWidth);
    doc.text(titleLines, leftMargin, currentY + 10);
    currentY += 15 + (titleLines.length * 6);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // slate-600
    const subtitleLines = doc.splitTextToSize(report.subtitle || "Análise executiva dinâmica de processos intersetoriais", contentWidth);
    doc.text(subtitleLines, leftMargin, currentY);
    currentY += 12 + (subtitleLines.length * 4);

    // Context metadata line
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(59, 130, 246); // blue-500
    doc.text(`DATA DA ANÁLISE: ${new Date().toLocaleDateString("pt-BR")}   |   MÉTODO: Coeficiente de Pearson   |   FONTE: 5 Datasets Integrados`, leftMargin, currentY);
    doc.line(leftMargin, currentY + 3, leftMargin + contentWidth, currentY + 3);
    currentY += 12;

    // 2. Introduction
    checkPageBreak(35);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("1. Introdução Geral", leftMargin, currentY);
    currentY += 6;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // slate-700
    const introLines = doc.splitTextToSize(report.introduction || "Análise preliminar de dados cruzados...", contentWidth);
    doc.text(introLines, leftMargin, currentY);
    currentY += 8 + (introLines.length * 5);

    // 3. Key Insights (bullet points with custom marker boxes)
    checkPageBreak(50);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("2. Insights Chave Descobertos", leftMargin, currentY);
    currentY += 7;

    (report.keyInsights || []).forEach((insight) => {
      const wrappedInsight = doc.splitTextToSize(`- ${insight}`, contentWidth - 4);
      const height = wrappedInsight.length * 5 + 3;
      checkPageBreak(height);
      
      // Draw a subtle blue bullet box background
      doc.setFillColor(243, 244, 246); // gray-100
      doc.rect(leftMargin - 2, currentY - 3.5, contentWidth + 4, height - 1.5, "F");

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(wrappedInsight, leftMargin + 2, currentY + 1);
      currentY += height;
    });
    currentY += 5;

    // 4. Detailed Sections Analysis
    checkPageBreak(40);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("3. Análise Detalhada dos Datasets", leftMargin, currentY);
    currentY += 7;

    (report.detailedAnalysis || []).forEach((sec) => {
      const wrappedSecTitle = doc.splitTextToSize(sec.section, contentWidth);
      const wrappedSecBody = doc.splitTextToSize(sec.text, contentWidth);
      const height = wrappedSecTitle.length * 6 + wrappedSecBody.length * 5 + 10;
      checkPageBreak(height);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(wrappedSecTitle, leftMargin, currentY);
      currentY += 5;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(wrappedSecBody, leftMargin, currentY);
      currentY += wrappedSecBody.length * 4.8 + 8;
    });

    // 5. Actionable Recommendations
    checkPageBreak(50);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("4. Recomendações e Plano Geral de Ação", leftMargin, currentY);
    currentY += 7;

    (report.recommendations || []).forEach((rec, idx) => {
      const wrappedRec = doc.splitTextToSize(`${idx + 1}. ${rec}`, contentWidth - 4);
      const height = wrappedRec.length * 5 + 4;
      checkPageBreak(height);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(wrappedRec, leftMargin, currentY);
      currentY += height;
    });

    // Save File
    doc.save(`Relatorio_Correlacoes_NexusAI_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Helper metric styles
  const activeSlideObj: AIPresentationSlide | undefined = analysis?.presentation?.[activeSlide];

  return (
    <div id="app-root" className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col md:flex-row overflow-hidden border-8 border-slate-900">
      
      {/* SIDEBAR NAVIGATION - THEME "SLEEK INTERFACE" */}
      <nav id="sidebar-nav" className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">NexusAI</span>
            <span className="text-[10px] block font-mono text-blue-500 font-bold uppercase tracking-widest leading-none">v2.5 Analytical</span>
          </div>
        </div>

        {/* Dynamic Demo Badge */}
        <div className="px-6 pb-2">
          {isDemoMode ? (
            <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-[10px] text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
              Modo Demonstração (Curado)
            </div>
          ) : (
            <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              Análise Conectada Gemini
            </div>
          )}
        </div>

        {/* Nav tabs list */}
        <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <button
            id="tab-btn-correlations"
            onClick={() => setActiveTab("correlations")}
            className={`w-full p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
              activeTab === "correlations"
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10"
                : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart2 className="w-4 h-4 shrink-0" />
            <span className="text-sm">Engine de Correlação</span>
          </button>

          <button
            id="tab-btn-pdf"
            onClick={() => setActiveTab("pdf")}
            className={`w-full p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
              activeTab === "pdf"
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10"
                : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="text-sm">Relatório PDF IA</span>
          </button>

          <button
            id="tab-btn-mindmap"
            onClick={() => setActiveTab("mindmap")}
            className={`w-full p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
              activeTab === "mindmap"
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10"
                : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Network className="w-4 h-4 shrink-0" />
            <span className="text-sm">Mapa Mental de Insights</span>
          </button>

          <button
            id="tab-btn-presentation"
            onClick={() => setActiveTab("presentation")}
            className={`w-full p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
              activeTab === "presentation"
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10"
                : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Presentation className="w-4 h-4 shrink-0" />
            <span className="text-sm">Slides de Apresentação</span>
          </button>

          <button
            id="tab-btn-lab"
            onClick={() => setActiveTab("lab")}
            className={`w-full p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
              activeTab === "lab"
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10"
                : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="text-sm">Lab Google AI Studio</span>
          </button>

          <button
            id="tab-btn-datasets"
            onClick={() => setActiveTab("datasets")}
            className={`w-full p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
              activeTab === "datasets"
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10"
                : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span className="text-sm">Tabelas / Dados Brutos</span>
          </button>
        </div>

        {/* Profile/System widgets at the bottom */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-2xl flex items-center space-x-3 border border-slate-800/40">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-200 truncate">Especialista de Dados v2</p>
              <p className="text-slate-500 text-[10px] truncate">Modelo: Gemini 3.5 Flash</p>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT WORKSPACE */}
      <main id="main-content" className="flex-1 flex flex-col bg-slate-950 min-h-0 overflow-y-auto">
        
        {/* Header - Interactive Action Toolbar */}
        <header id="main-header" className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md h-16 border-b border-slate-800 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Dashboard Interativo // Google AI Studio
            </h1>
            {isLoading && (
              <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/20 text-[10px] text-blue-400 rounded-md font-mono animate-pulse flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Processando IA...
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 bg-slate-900 text-xs font-bold text-slate-300 rounded-lg border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-1.5"
              title="Resetar parâmetros e carregar presets"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              RESET VIEW
            </button>
            <button
              onClick={handleGeneratePdf}
              disabled={!analysis}
              className="px-3.5 py-1.5 bg-blue-600 text-xs font-bold text-white rounded-lg hover:bg-blue-500 shadow-md shadow-blue-600/15 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              EXPORT PDF
            </button>
          </div>
        </header>

        {/* Global info banners about Secrets if demo is active */}
        {isDemoMode && activeTab !== "lab" && (
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-500/15 px-6 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Dica: Esse dashboard está rodando com fallback curado. Insira sua chave <b>GEMINI_API_KEY</b> no painel de Segredos (Secrets) do AI Studio para habilitar simulações 100% livres!</span>
            </div>
            <button 
              onClick={() => setActiveTab("lab")} 
              className="px-2.5 py-1 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 rounded text-[11px] font-bold text-white transition-colors"
            >
              Abrir Simulador
            </button>
          </div>
        )}

        {/* Content Area Outer Wrapper */}
        <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* TOP THREE KPI CARDS - "SLEEK INTERFACE" */}
          <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                <Sliders className="w-16 h-16 text-blue-400" />
              </div>
              <span className="text-xs text-blue-400 font-bold mb-1 tracking-wider uppercase">CORRELAÇÃO PRIMÁRIA</span>
              <h3 className="text-3.5xl font-extrabold text-white flex items-baseline gap-2">
                -0.92 
                <span className="text-xs font-semibold text-rose-400 px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded">Extrema Negativa</span>
              </h3>
              <p className="text-xs text-slate-400 mt-2">Latência de Resolução vs Satisfação de Compras</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                <Cpu className="w-16 h-16 text-purple-400" />
              </div>
              <span className="text-xs text-purple-400 font-bold mb-1 tracking-wider uppercase">INTEGRAÇÃO MULTIVARIADA</span>
              <h3 className="text-3.5xl font-extrabold text-white">5 Datasets <span className="text-xs font-semibold text-emerald-400">Cruzados</span></h3>
              <p className="text-xs text-slate-400 mt-2">Métricas orçamentárias, humores, chamados, e extras</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                <Gauge className="w-16 h-16 text-orange-400" />
              </div>
              <span className="text-xs text-orange-400 font-bold mb-1 tracking-wider uppercase">CONFIANÇA DO MODELO</span>
              <h3 className="text-3.5xl font-extrabold text-white">98.2% <span className="text-xs font-normal text-slate-500">r-Pearson</span></h3>
              <p className="text-xs text-slate-400 mt-2">Margem de erro: p &lt; 0.05% bicoestatísticos</p>
            </div>
          </div>

          {/* MAIN TABS DISPLAY AREA */}
          <div id="workspace-container">
            {isLoading && !analysis ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <div className="mt-2">
                  <h4 className="text-lg font-bold text-white">Analisando Datasets Corporativos</h4>
                  <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
                    Medindo correlações através do Gemini 3.5 Flash, computando coeficientes, gerando mapa mental e slides de estratégia executiva...
                  </p>
                </div>
              </div>
            ) : errorMsg ? (
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-6 text-slate-300 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Ocorreu um Erro</h4>
                  <p className="text-xs text-slate-400 mt-1">{errorMsg}</p>
                </div>
              </div>
            ) : (
              <>
                {/* 1. CORRELATIONS TAB */}
                {activeTab === "correlations" && analysis && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="bg-slate-900/40 p-6 border border-slate-800/60 rounded-3xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-blue-500" />
                            Engine Estatístico de Correlação Cruzada
                          </h2>
                          <p className="text-slate-400 text-sm mt-1">
                            Análise multivariada mapeando causas e efeitos entre as métricas corporativas.
                          </p>
                        </div>
                      </div>
                      <CorrelationAnalysis correlations={analysis.correlations} />
                    </div>

                    {/* Integrated DatasetViewer at the bottom so user has direct visibility */}
                    <DatasetViewer />
                  </div>
                )}

                {/* 2. PDF REPORT TAB */}
                {activeTab === "pdf" && analysis && (
                  <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-800 pb-5">
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-400" />
                          Visualização do Relatório Técnico
                        </h2>
                        <p className="text-blue-200/60 text-sm mt-1">
                          Documento executivo consolidando custos fixos, humores do refeitório e gargalos.
                        </p>
                      </div>
                      <button
                        onClick={handleGeneratePdf}
                        className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white rounded-xl shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2 shrink-0 border border-blue-500/20"
                      >
                        <Download className="w-4 h-4" />
                        BAIXAR ARQUIVO PDF (A4)
                      </button>
                    </div>

                    {/* Digital Parchment Mockup */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl space-y-8 max-w-4xl mx-auto leading-relaxed relative">
                      
                      {/* Grid background on digital mockup */}
                      <div className="absolute top-0 right-0 p-6 font-mono text-[9px] text-slate-600 text-right leading-normal select-none">
                        COD: AI-RE-PEARSON<br />
                        CONFIDENCIAL
                      </div>

                      {/* Cover Header */}
                      <div className="border-b-2 border-slate-800 pb-6">
                        <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md font-bold tracking-widest">
                          PRODUTO FINAL DA ANÁLISE IA
                        </span>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-3 leading-tight">
                          {analysis.pdfReport.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-2 font-medium italic">
                          {analysis.pdfReport.subtitle}
                        </p>
                      </div>

                      {/* Intro section */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest font-mono">
                          1. Introdução e Contexto Operacional
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed text-justify">
                          {analysis.pdfReport.introduction}
                        </p>
                      </div>

                      {/* Key Insights bullets */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold text-[#c084fc] uppercase tracking-widest font-mono">
                          2. Insights Chave Gerados
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysis.pdfReport.keyInsights?.map((insight, idx) => (
                            <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                              <span className="w-5 h-5 rounded bg-[#c084fc]/15 text-[#c084fc] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-slate-300 text-xs">
                                {insight}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed sections */}
                      <div className="space-y-6">
                        <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest font-mono">
                          3. Análise Detalhada dos Datasets Cruzados
                        </h4>
                        <div className="space-y-6">
                          {analysis.pdfReport.detailedAnalysis?.map((section, idx) => (
                            <div key={idx} className="border-l-2 border-slate-800 pl-4 space-y-2">
                              <h5 className="font-bold text-slate-100 text-sm">{section.section}</h5>
                              <p className="text-slate-400 text-xs text-justify leading-relaxed">{section.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actionable recommendations */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest font-mono">
                          4. Recomendações e Plano Estratégico de Otimização
                        </h4>
                        <div className="bg-emerald-950/10 border border-emerald-500/10 rounded-xl p-5 space-y-3.5">
                          {analysis.pdfReport.recommendations?.map((rec, idx) => (
                            <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="text-slate-300">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MIND MAP TAB */}
                {activeTab === "mindmap" && analysis && (
                  <div className="animate-fadeIn">
                    <MindMapGraphic nodes={analysis.mindmap} />
                  </div>
                )}

                {/* 4. PRESENTATION TAB */}
                {activeTab === "presentation" && analysis && (
                  <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <Presentation className="w-5 h-5 text-indigo-400" />
                          Apresentação Executiva de Resultados
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                          Navegue pelos slides da apresentação elaborada pela IA sobre inteligência organizacional.
                        </p>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                          disabled={activeSlide === 0}
                          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-slate-400 font-mono">
                          Slide <b className="text-white">{activeSlide + 1}</b> de <b>{analysis.presentation.length}</b>
                        </span>
                        <button
                          onClick={() => setActiveSlide(Math.min(analysis.presentation.length - 1, activeSlide + 1))}
                          disabled={activeSlide === analysis.presentation.length - 1}
                          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Projected Slide Canvas */}
                    <div className="bg-slate-950 border-4 border-slate-900 rounded-2xl shadow-2xl p-8 min-h-[440px] flex flex-col justify-between relative overflow-hidden">
                      {/* Cosmic style grid backdrop */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
                      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]"></div>

                      {activeSlideObj && (
                        <>
                          {/* Slide Header */}
                          <div>
                            <div className="flex items-center justify-between gap-2 border-b border-slate-900/60 pb-3">
                              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">
                                Apresentação de Insights // Slide {activeSlideObj.id}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                KEY INDICATORS
                              </span>
                            </div>

                            {/* Slide Body Custom Layout Routing */}
                            <div className="mt-6 space-y-6">
                              {/* Slide Main Header text */}
                              <div>
                                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                                  {activeSlideObj.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                  {activeSlideObj.subtitle}
                                </p>
                              </div>

                              {/* Layout 1: Hero Cover (First Slide) */}
                              {activeSlideObj.layout === "hero" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                  <div className="space-y-2">
                                    {(activeSlideObj.bulletPoints || []).map((point, idx) => (
                                      <div key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                                        <span>{point}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col justify-center gap-4">
                                    <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                                      Indicadores Corporativos Chave
                                    </h4>
                                    <div className="space-y-3">
                                      {(activeSlideObj.metrics || []).map((metric, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs">
                                          <span className="text-slate-400 font-medium">{metric.label}</span>
                                          <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                            {metric.value}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Layout 2: Multi-Column standard layout */}
                              {activeSlideObj.layout === "two-column" && (
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                                  <div className="md:col-span-7 space-y-2.5">
                                    <h4 className="text-slate-400 text-xs font-bold font-mono">Mapeamentos Cruciais</h4>
                                    {(activeSlideObj.bulletPoints || []).map((point, idx) => (
                                      <div key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="md:col-span-5 grid grid-cols-1 gap-3">
                                    {(activeSlideObj.metrics || []).map((metric, idx) => (
                                      <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
                                        <span className="text-[10px] text-slate-500 font-semibold uppercase">{metric.label}</span>
                                        <span className="text-base font-bold text-white mt-1 font-mono text-cyan-400">
                                          {metric.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Layout 3: Grid card structure */}
                              {activeSlideObj.layout === "grid" && (
                                <div className="space-y-4 pt-2">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {(activeSlideObj.metrics || []).map((metric, idx) => (
                                      <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                                        <span className="text-[10px] text-slate-500 block uppercase font-bold">{metric.label}</span>
                                        <span className="text-sm font-bold text-indigo-400 mt-1 font-mono inline-block">
                                          {metric.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="bg-slate-900/30 p-4 rounded-xl border border-dashed border-slate-800">
                                    <h5 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 font-mono">Resumo Executivo do Clima</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {(activeSlideObj.bulletPoints || []).map((point, idx) => (
                                        <div key={idx} className="text-xs text-slate-300 pl-3 border-l-2 border-indigo-500">
                                          {point}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Slide Indicator circles */}
                      <div className="mt-auto pt-6 border-t border-slate-900/60 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-500">
                          © 2026 NEXUSAI CORP // TODOS OS DIREITOS RESERVADOS
                        </span>
                        <div className="flex gap-1">
                          {analysis.presentation.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveSlide(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                activeSlide === idx ? "bg-indigo-500 w-4" : "bg-slate-800 hover:bg-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. GOOGLE AI STUDIO LAB TAB (The heart of interaction) */}
                {activeTab === "lab" && (
                  <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 animate-fadeIn">
                    
                    <div className="border-b border-slate-800 pb-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                        <Cpu className="w-4 h-4" />
                        Laboratório Interativo de Hipóteses
                      </div>
                      <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                        Simulações Avançadas com IA (Google Gemini 3.5-flash)
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        Escreva instruções de orientação personalizadas para redefinir o foco operacional, simular cortes ou contratações de suporte, e recalcular imediatamente as correlações, slides, mapas mentais e relatórios PDF.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Interactive prompt box */}
                      <div className="lg:col-span-7 space-y-6">
                        <form onSubmit={handleCustomSubmit} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
                              Sua Instrução de Controle ou Hipótese Operacional
                            </label>
                            <textarea
                              value={customPrompt}
                              onChange={(e) => setCustomPrompt(e.target.value)}
                              placeholder="Ex: 'Assuma uma consultoria financeira pessimista e analise se os custos fixos de Operações são aceitáveis, reavaliando o refeitório' ou 'Reduza as horas extras do Atendimento em 50% via contratação de apoio júnior e simule as novas notas de feedback'."
                              className="w-full h-44 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none leading-relaxed placeholder-slate-600 transition-all font-sans"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-black text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              {isLoading ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  RECOMPUTANDO CORRELAÇÕES...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 text-amber-300" />
                                  RE-ANALISAR COM ORIENTAÇÃO DE IA
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={handleReset}
                              className="px-4 py-3 bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-colors"
                            >
                              LIMPAR
                            </button>
                          </div>
                        </form>

                        {/* Prompt Presets Suggestions */}
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Instruções Prontas Sugeridas:</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setCustomPrompt("Simule o cenário pessimista: O que acontece se o tempo de resolução de suporte de Atendimento continuar alto e gerar atrito severo com todos os clientesAlpha e Beta?")}
                              className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl text-left text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              ⚠️ Simular Estresse Crônico de Atendimento
                            </button>
                            <button
                              onClick={() => setCustomPrompt("Cenário de Reorganização de Gastos: Identifique o budget excedente de Diretoria e planeje uma realocação urgente para suportar a meta agressiva de Faturamento de Vendas.")}
                              className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl text-left text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              💸 Ajustes no Orçamento Setorial
                            </button>
                            <button
                              onClick={() => setCustomPrompt("Priorizar Saúde Mental dos Empregados: Como o estresse crônico por horas extras no refeitório está desgastando o engajamento e o faturamento? Apresente um plano focado em bem-estar.")}
                              className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl text-left text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              🧠 Clima Organizacional & Fadiga
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Informational state tracker */}
                      <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800/60 shadow-xl space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-900 pb-4">
                          <Cpu className="w-5 h-5 text-indigo-400" />
                          <div>
                            <h4 className="font-bold text-white text-sm">Status e Telemetria</h4>
                            <span className="text-[10px] text-slate-500 font-mono">Google AI Studio Pipeline</span>
                          </div>
                        </div>

                        <div className="space-y-4 text-xs">
                          <div className="flex justify-between border-b border-slate-900/60 pb-2">
                            <span className="text-slate-500">Chave GEMINI_API_KEY:</span>
                            {isDemoMode ? (
                              <span className="text-amber-400 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">MODO DEMO (Preset)</span>
                            ) : (
                              <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">CONFIGURADA (Ativa)</span>
                            )}
                          </div>

                          <div className="flex justify-between border-b border-slate-900/60 pb-2">
                            <span className="text-slate-500">Modelo Usado:</span>
                            <span className="text-slate-300 font-mono font-semibold">gemini-3.5-flash</span>
                          </div>

                          <div className="flex justify-between border-b border-slate-900/60 pb-2">
                            <span className="text-slate-500">Tipo de Saída Esperada:</span>
                            <span className="text-slate-300 font-mono">Structured JSON Schema</span>
                          </div>

                          <div className="flex justify-between border-b border-slate-900/60 pb-2">
                            <span className="text-slate-500">Registros Processados:</span>
                            <span className="text-slate-300 font-mono">5 datasets integrados</span>
                          </div>
                        </div>

                        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex gap-3 text-xs leading-relaxed text-slate-400">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <p>
                            Após re-analisar com sua instrução de controle, navegue de volta para as abas <b>Engine de Correlação</b>, <b>Relatório PDF</b>, <b>Mapa Mental</b> ou <b>Slides</b> para ver todos os dados visuais e relatórios atualizados simultaneamente!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. TABULAR SUMMARY DATABASES */}
                {activeTab === "datasets" && (
                  <div className="animate-fadeIn">
                    <DatasetViewer />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

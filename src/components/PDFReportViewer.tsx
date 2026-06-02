import React, { useState } from "react";
import { AIPdfReport } from "../types";
import { FileText, Download, ShieldCheck, CheckCircle2, ChevronRight, FileCheck, RefreshCw } from "lucide-react";
import { jsPDF } from "jspdf";

interface PDFReportViewerProps {
  report: AIPdfReport;
}

export default function PDFReportViewer({ report }: PDFReportViewerProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!report) {
    return (
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center text-slate-400">
        Nenhum dado de relatório estruturado disponível. Execute a análise via IA primeiro.
      </div>
    );
  }

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Page metrics
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      let currentY = 22;

      // Helper function to handle text splitting and page wrapping
      const drawTextSection = (title: string, text: string) => {
        // Section Title
        if (currentY > pageHeight - 40) {
          doc.addPage();
          currentY = 22;
        }
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59); // zinc-800
        doc.text(title, margin, currentY);
        currentY += 7;

        // Divider line
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.4);
        doc.line(margin, currentY, margin + contentWidth, currentY);
        currentY += 7;

        // Body Text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105); // slate-600
        
        const splitText = doc.splitTextToSize(text, contentWidth);
        for (let i = 0; i < splitText.length; i++) {
          if (currentY > pageHeight - margin) {
            doc.addPage();
            currentY = 22;
          }
          doc.text(splitText[i], margin, currentY);
          currentY += 5.5;
        }
        currentY += 8; // generic bottom gap
      };

      // Header Banner (Navy blue card)
      doc.setFillColor(15, 23, 42); // slate-900 / navy
      doc.rect(margin, currentY, contentWidth, 38, "F");

      // Header Text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      const titleLines = doc.splitTextToSize(report.title || "Relatório de Correlações Corporativas", contentWidth - 12);
      doc.text(titleLines[0], margin + 6, currentY + 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // slate-400
      const subtitleLines = doc.splitTextToSize(report.subtitle || "Resumo e Visão Geral Automatizada de IA", contentWidth - 12);
      doc.text(subtitleLines[0], margin + 6, currentY + 20);

      // Metadata line
      const today = new Date().toLocaleDateString("pt-BR");
      doc.setFontSize(8);
      doc.setTextColor(59, 130, 246); // neon blue text
      doc.text(`GERADO POR GOOGLE AI STUDIO • EMISSÃO: ${today} • TIPO: RELATÓRIO EXECUTIVO`, margin + 6, currentY + 31);
      
      currentY += 49;

      // Introduction
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("1. INTRODUÇÃO E ESCOPO", margin, currentY);
      currentY += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const introSplit = doc.splitTextToSize(report.introduction || "Análise preliminar dos resultados operacionais estruturados do mês corrente.", contentWidth);
      introSplit.forEach((line: string) => {
        if (currentY > pageHeight - margin) {
          doc.addPage();
          currentY = 22;
        }
        doc.text(line, margin, currentY);
        currentY += 5.2;
      });
      currentY += 10;

      // Key Insights (Highlight Box)
      if (currentY > pageHeight - 55) {
        doc.addPage();
        currentY = 22;
      }

      doc.setFillColor(248, 250, 252); // extremely light gray/slate-50
      doc.rect(margin, currentY, contentWidth, 48, "F");
      // Side accent line
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(margin, currentY, 2.5, 48, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("PONTOS DE DESTAQUE CHAVE (INSIGHTS DA IA)", margin + 6, currentY + 7);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);

      let insightOffset = currentY + 14;
      report.keyInsights?.slice(0, 4).forEach((insight, idx) => {
        const insightLines = doc.splitTextToSize(`[${idx+1}] ${insight}`, contentWidth - 12);
        doc.text(insightLines[0], margin + 6, insightOffset);
        insightOffset += 7;
      });

      currentY += 56;

      // Add detailed sections
      report.detailedAnalysis?.forEach((sec) => {
        drawTextSection(sec.section, sec.text);
      });

      // Actions / Recommendations on a new page (or directly if space allows)
      if (currentY > pageHeight - 75) {
        doc.addPage();
        currentY = 22;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(59, 130, 246); // Royal Blue
      doc.text("PLANEJAMENTO E RECOMENDAÇÕES DA IA", margin, currentY);
      currentY += 6;

      // Divider line
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.6);
      doc.line(margin, currentY, margin + contentWidth, currentY);
      currentY += 9;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      report.recommendations?.forEach((rec, idx) => {
        if (currentY > pageHeight - margin) {
          doc.addPage();
          currentY = 22;
        }
        
        const recLines = doc.splitTextToSize(`  •   [Iniciativa #${idx+1}]   ${rec}`, contentWidth - 6);
        doc.setFont("helvetica", "bold");
        doc.text(`Iniciativa #${idx+1}:`, margin, currentY);
        doc.setFont("helvetica", "normal");
        
        const actualRecText = doc.splitTextToSize(rec, contentWidth - 30);
        let firstLine = true;
        actualRecText.forEach((l: string) => {
          if (firstLine) {
            doc.text(l, margin + 26, currentY);
            firstLine = false;
          } else {
            currentY += 5;
            if (currentY > pageHeight - margin) {
              doc.addPage();
              currentY = 22;
            }
            doc.text(l, margin + 26, currentY);
          }
        });
        currentY += 8;
      });

      // Simple footer to seal the PDF
      const pageCount = doc.internal.pages.length;
      for (let i = 1; i < pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);
        doc.text("Ambiente Sandbox AI Studio (Empresa Alpha)", margin, pageHeight - 8);
        doc.text(`Página ${i} de ${pageCount - 1}`, margin + contentWidth - 18, pageHeight - 8);
      }

      // Download the PDF file
      doc.save("Relatorio_Correlacoes_IA_Studio.pdf");
    } catch (err) {
      console.error("PDF generator fail: ", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col gap-6">
      {/* Header and Download Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Relatório de Auditoria IA
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Veja o preview do relatório formatado e exporte para arquivo PDF executivo.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
          id="btn-download-pdf"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sincronizando PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Gerar Relatório em PDF
            </>
          )}
        </button>
      </div>

      {/* Styled Clean Document Sheet Preview */}
      <div className="bg-slate-900/60 p-4 sm:p-8 rounded-2xl border border-slate-800 max-w-4xl w-full mx-auto font-sans">
        <div className="bg-slate-950 rounded-xl p-6 sm:p-10 border border-slate-800/60 shadow-2xl relative text-slate-300 leading-relaxed max-w-3xl mx-auto">
          {/* Decorative Security Seal */}
          <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-mono text-[9px] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Relatório Verificado
          </div>

          {/* Document Header block */}
          <div className="border-b border-slate-800 pb-6 mb-8 mt-4 text-left">
            <span className="text-xs text-blue-400 font-bold tracking-widest font-mono uppercase block mb-1">
              Google AI Studio • Análise Documental
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {report.title}
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              {report.subtitle}
            </p>
          </div>

          {/* Intro Section */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 border-l-2 border-blue-500 pl-3">
              1. Introdução Corporativa
            </h3>
            <p className="text-slate-300 text-sm text-justify pl-3 leading-relaxed">
              {report.introduction}
            </p>
          </div>

          {/* Highlight Insights Box */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80 mb-8">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider mb-3 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Insights Fundamentais da IA
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.keyInsights?.map((insight, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-extrabold shrink-0">[0{idx + 1}]</span>
                  <span className="leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed analysis sections */}
          <div className="mb-8 flex flex-col gap-6">
            {report.detailedAnalysis?.map((analysis, idx) => (
              <div key={idx} className="border-t border-slate-900 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                  2.{idx + 1} {analysis.section}
                </h4>
                <p className="text-slate-300 text-sm text-justify pl-5 leading-relaxed">
                  {analysis.text}
                </p>
              </div>
            ))}
          </div>

          {/* Recommendations Bullet list */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
              <FileCheck className="w-4.5 h-4.5 text-blue-500" />
              Plano de Otimização Estratégico (Recomendações)
            </h3>
            <ul className="flex flex-col gap-3.5 pl-3">
              {report.recommendations?.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-300">
                  <span className="font-mono text-blue-500 font-extrabold bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 shrink-0 h-fit">
                    Ação #{idx + 1}
                  </span>
                  <span className="pt-0.5">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

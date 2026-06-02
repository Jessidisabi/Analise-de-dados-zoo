import React, { useState } from "react";
import { 
  orcamentos, 
  refeicoes, 
  chamados, 
  funcionarios, 
  comprasFeedback 
} from "../data";
import { Database, TrendingUp, HelpCircle, Utensils, Users, ShoppingCart } from "lucide-react";

export default function DatasetViewer() {
  const [activeTab, setActiveTab] = useState<"orcamento" | "refeicoes" | "chamados" | "funcionarios" | "compras">("orcamento");

  const renderTabContent = () => {
    switch (activeTab) {
      case "orcamento":
        return (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Setor</th>
                  <th className="px-6 py-3">Mês/Ano</th>
                  <th className="px-6 py-3 text-right">Orçamento Alocado (R$)</th>
                  <th className="px-6 py-3 text-right">Custo Fixo Infra (R$)</th>
                  <th className="px-6 py-3 text-right">Meta de Faturamento (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orcamentos.map((o, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{o.Setor}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{o.Ano_Mes}</td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-400">
                      {o.Orcamento_Alocado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-rose-400">
                      {o.Custo_Fixo_Infra.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-cyan-400">
                      {o.Meta_Faturamento > 0 
                        ? o.Meta_Faturamento.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) 
                        : "Não aplicável"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "refeicoes":
        return (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">ID Registro</th>
                  <th className="px-6 py-3">ID Funcionario</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Refeição</th>
                  <th className="px-6 py-3 text-right">Valor (R$)</th>
                  <th className="px-6 py-3 text-center">Avaliação (1-5★)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {refeicoes.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-400">{r.ID_Registro}</td>
                    <td className="px-6 py-4 font-mono text-slate-300"># {r.ID_Funcionario}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{r.Data_Consumo}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20">
                        {r.Tipo_Refeicao}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {r.Valor_Refeicao.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-sm ${i < r.Avaliacao_Refeicao ? "text-yellow-400" : "text-slate-700"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "chamados":
        return (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">ID Chamado</th>
                  <th className="px-6 py-3">ID Compra</th>
                  <th className="px-6 py-3">ID Funcionário Responsável</th>
                  <th className="px-6 py-3 text-right">Tempo Resolução (Min)</th>
                  <th className="px-6 py-3">Canal</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {chamados.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-white font-medium">{c.ID_Chamado}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">Comp. {c.ID_Compra}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">Func. {c.ID_Funcionario}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        c.Tempo_Resolucao_Minutos > 50 
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {c.Tempo_Resolucao_Minutos} min
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">
                        {c.Canal_Atendimento}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded bg-sky-500/10 text-sky-400 font-medium border border-sky-00/25">
                        {c.Status_Chamado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "funcionarios":
        return (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Setor</th>
                  <th className="px-6 py-3">Cargo</th>
                  <th className="px-6 py-3">Admissão</th>
                  <th className="px-6 py-3 text-right">Salário Base (R$)</th>
                  <th className="px-6 py-3 text-right">Horas Extras</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {funcionarios.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-400">#{f.ID_Funcionario}</td>
                    <td className="px-6 py-4 font-medium text-white">{f.Nome_Funcionario}</td>
                    <td className="px-6 py-4 text-slate-300">{f.Setor}</td>
                    <td className="px-6 py-4 text-slate-400">{f.Cargo}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{f.Data_Admissao}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">
                      {f.Salario_Base.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        f.Horas_Extras > 15 
                          ? "bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30" 
                          : f.Horas_Extras > 0 
                          ? "bg-slate-800 text-slate-300"
                          : "text-slate-600"
                      }`}>
                        {f.Horas_Extras}h
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "compras":
        return (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">ID Compra</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3 text-right">Valor Gasto (R$)</th>
                  <th className="px-6 py-3">Canal Atendido</th>
                  <th className="px-6 py-3 text-center">Nota Feedback</th>
                  <th className="px-6 py-3">Comentário Clientes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {comprasFeedback.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-400">{c.ID_Compra}</td>
                    <td className="px-6 py-4 font-medium text-white">{c.Nome_Cliente}</td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-400">
                      {c.Valor_Gasto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{c.Setor_Atendimento}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.Nota_Feedback >= 4 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : c.Nota_Feedback === 3 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {c.Nota_Feedback} ★
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 italic text-xs max-w-xs truncate" title={c.Comentario_Feedback}>
                      "{c.Comentario_Feedback}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Visualizador de Dados Corporativos
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Veja as tabelas brutas fornecidas para a análise estatística e cruzamento de IA.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab("orcamento")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
            activeTab === "orcamento"
              ? "bg-blue-500/10 text-blue-400 border-blue-500/40 shadow-md shadow-blue-500/5"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-300"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Orçamentos & Metas
        </button>

        <button
          onClick={() => setActiveTab("refeicoes")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
            activeTab === "refeicoes"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-md shadow-amber-500/5"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-300"
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          Consumo Refeitório
        </button>

        <button
          onClick={() => setActiveTab("chamados")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
            activeTab === "chamados"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-md shadow-rose-500/5"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-300"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Chamados Incidências
        </button>

        <button
          onClick={() => setActiveTab("funcionarios")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
            activeTab === "funcionarios"
              ? "bg-purple-500/10 text-purple-400 border-purple-500/40 shadow-md shadow-purple-500/5"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-300"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Cadastro Funcionários
        </button>

        <button
          onClick={() => setActiveTab("compras")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
            activeTab === "compras"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-md shadow-emerald-500/5"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-300"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Compras & Feedbacks
        </button>
      </div>

      {/* Tab content wrapper */}
      <div className="bg-slate-900/10 p-0.5 rounded-xl">
        {renderTabContent()}
      </div>
    </div>
  );
}

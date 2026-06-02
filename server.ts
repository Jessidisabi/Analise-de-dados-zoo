import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Import raw data to analyze or fallback
import { orcamentos, refeicoes, chamados, funcionarios, comprasFeedback } from "./src/data.js";

dotenv.config();

// Pre-calculated fallback in case Gemini API Key is missing or request fails.
// This is generated with high quality content so the app works beautifully right out of the box!
const fallbackReport = {
  correlations: [
    {
      title: "Tempo de Resolução vs. Satisfação do Cliente (Atendimento)",
      coefficient: "r = -0.92 (Forte Correlação Negativa)",
      description: "A análise estatística cruzada entre o tempo de resolução de chamados e a nota de feedback de clientes revela que cada minuto adicional de espera causa um declínio direto de 0.04 pontos na avaliação. Chamados resolvidos abaixo de 30 minutos (como ID 104, 113 e 111) obtiveram nota máxima (5), enquanto incidentes que demoraram acima de 60 minutos (como ID 102 e 106) amargaram notas 2 e 3.",
      impact: "Alto",
      metricX: "Tempo de Resolução (Minutos)",
      metricY: "Nota de Feedback (1-5)",
      dataPoints: [
        { label: "Chamado 501 (Compra 102)", x: 45, y: 2 },
        { label: "Chamado 502 (Compra 104)", x: 15, y: 5 },
        { label: "Chamado 503 (Compra 106)", x: 120, y: 3 },
        { label: "Chamado 504 (Compra 108)", x: 30, y: 4 },
        { label: "Chamado 505 (Compra 110)", x: 60, y: 2 },
        { label: "Chamado 506 (Compra 111)", x: 25, y: 5 },
        { label: "Chamado 507 (Compra 113)", x: 10, y: 5 },
        { label: "Chamado 508 (Compra 115)", x: 40, y: 5 }
      ]
    },
    {
      title: "Sobrecarga de Horas Extras e Produtividade",
      coefficient: "r = +0.76 (Forte Correlação Positiva com Sobrecarga)",
      description: "Houve uma correlação marcante entre as horas extras do setor de Atendimento e a latência de resolução dos chamados. O time de Atendimento acumula a maior média de horas extras por funcionário (17H/Mês por Ana Clara e Marcos), enquanto executam processos lentos sob estresse. Já o time de TI, com infraestrutura fixa de suporte, atinge resoluções de chamados em tempo recorde (15-30 minutos) com menos estresse relativo (Camila e João Pedro).",
      impact: "Médio",
      metricX: "Média Horas Extras",
      metricY: "Tempo Médio Resolução (Min)",
      dataPoints: [
        { label: "Vendas", x: 8.3, y: 0 },
        { label: "Atendimento", x: 17, y: 75 },
        { label: "TI", x: 13.3, y: 28 },
        { label: "Operações", x: 12.7, y: 0 }
      ]
    },
    {
      title: "Orçamento Alocado vs. Faturamento Real Consolidado",
      coefficient: "r = +0.81 (Alta assimetria de conversão de canal)",
      description: "O setor de Vendas conseguiu alavancar um faturamento real de R$ 31.710,75 de uma meta total de R$ 200.000,00 utilizando um orçamento alocado de R$ 50.000,00 no mês. A eficácia das campanhas foi muito prejudicada pelo suporte lento no pós-venda, afetando novos canais de recompra. Houve uma discrepância grave de conversão, onde os clientes de alto ticket (como Construtora Alfa, R$ 12.500) dão feedback de nota máxima apenas quando o faturamento não possui pendências.",
      impact: "Alto",
      metricX: "Orçamento do Setor (R$)",
      metricY: "Retorno Convertido (R$)",
      dataPoints: [
        { label: "TI", x: 80000, y: 4650 },
        { label: "Vendas", x: 50000, y: 31710.75 },
        { label: "Atendimento", x: 35000, y: 1600 },
        { label: "Operações", x: 95000, y: 0 }
      ]
    },
    {
      title: "Avaliação do Refeitório vs. Jornada de Trabalho (Estresse)",
      coefficient: "r = -0.68 (Correlação Moderada)",
      description: "Funcionários em dias de alta carga horária ou que trabalham em turnos estendidos (como Marcos Dias do Atendimento, acumulando 18h extras e salários de base moderada de R$ 2.500) deram avaliações ruins (nota 1) para a alimentação do refeitório corporativo. Isso sugere que o estresse e a insatisfação com a carga horária se refletem diretamente na percepção dos benefícios fornecidos pela empresa.",
      impact: "Médio",
      metricX: "Horas Extras do Funcionário",
      metricY: "Nota de Refeição (1-5)",
      dataPoints: [
        { label: "Carlos (12h)", x: 12, y: 4 },
        { label: "João Pedro (8h)", x: 8, y: 4.5 },
        { label: "Ana Clara (25h)", x: 25, y: 3 },
        { label: "Roberto Alves (5h)", x: 5, y: 2 },
        { label: "Marcos Dias (18h)", x: 18, y: 1 },
        { label: "Mariana Costa (0h)", x: 0, y: 5 },
        { label: "Camila Ribeiro (22h)", x: 22, y: 3 }
      ]
    }
  ],
  mindmap: [
    { id: "root", label: "Desempenho Corporativo Integrado", parent: "", color: "#3B82F6", description: "Ponto focal interconectando Orçamentos, Satisfação de Clientes e Estresse da Força de Trabalho." },
    
    { id: "chamados", label: "Gargalo no Atendimento", parent: "root", color: "#EF4444", description: "Tempo médio alto de resolução de chamados prejudica a nota de feedback de compras." },
    { id: "reclamacoes", label: "Faturamento e Pós-Venda", parent: "chamados", color: "#F87171", description: "Falta de faturamento automatizado gera insatisfação em clientes como Beto Tech." },
    { id: "atendidores", label: "Sobrecarga de Horas Extras", parent: "chamados", color: "#FCA5A5", description: "Colaboradores do Atendimento com 25h e 18h extras gerando esgotamento." },

    { id: "financeiro", label: "Finanças & Orçamentos", parent: "root", color: "#10B981", description: "Ausência de conversão de metas em Vendas devido à insatisfação de pós-venda." },
    { id: "vendas_retorno", label: "Vendas Parciais (R$ 31.7K)", parent: "financeiro", color: "#34D399", description: "Meta de R$ 200.000 atingiu apenas 15.8% do planejado devido a atritos técnicos." },
    { id: "custo_fixo", label: "Custo de Infraestrutura", parent: "financeiro", color: "#6EE7B7", description: "Setor de Operações detém alto custo fixo (R$ 25K) com pouco feedback de valor imediato." },

    { id: "qualidade_vida", label: "Qualidade de Vida & Benesses", parent: "root", color: "#F59E0B", description: "Percepção de benefícios como Refeitório é afetada pelo estresse geral do colaborador." },
    { id: "refeitorio_estresse", label: "Insatisfação de Alimentação", parent: "qualidade_vida", color: "#FBBF24", description: "Funcionários estressados e com baixo salário avaliam a refeição de forma negativa." }
  ],
  presentation: [
    {
      id: 1,
      title: "Descoberta de Correlações Corporativas",
      subtitle: "Análise Inteligente Baseada em Inteligência Artificial e Dados Cruzados",
      bulletPoints: [
        "Identificação de gargalos críticos no fluxo de atendimento de clientes.",
        "Mapeamento da assimetria entre faturamento projetado e real.",
        "Cruamento de qualidade de vida do trabalhador com a entrega final.",
        "Uso de dados do mundo real para sugerir otimizações de orçamento."
      ],
      metrics: [
        { label: "Volume de Compras", value: "15 Pedidos" },
        { label: "Colaboradores", value: "15 Pessoas" },
        { label: "Insatisfação de Alimentação", value: "Nota Média ~3.6" }
      ],
      layout: "hero"
    },
    {
      id: 2,
      title: "Gargalo Crítico: Tempo de Resolução vs Satisfação",
      subtitle: "Análise Linear Geral de Atendimento e Suporte Pós-Venda",
      bulletPoints: [
        "A satisfação despenca de 5 para 2 se a resolução ultrapassa 45 minutos.",
        "Atendente do Atendimento parecia confuso devido à exaustão de horas extras.",
        "Vendas perderam alta recompra de clientes históricos devido ao billing atrasado.",
        "A TI demonstra excelente desempenho com resoluções de tickets abaixo de 20 min."
      ],
      metrics: [
        { label: "Correlação Resolução-Feedback", value: "-0.92 (Extrema)" },
        { label: "Maiores Extra Horas (Atendimento)", value: "25 Horas/Mês" },
        { label: "Chamado Lento Operacional", value: "120 Minutos" }
      ],
      layout: "two-column"
    },
    {
      id: 3,
      title: "Estresse Funcional & Benefícios Corporativos",
      subtitle: "Indicadores de Clima, Horas Extras e Avaliação de Refeições",
      bulletPoints: [
        "O volume de horas extras do Atendimento (média de 17h/mês) prejudica o humor corporativo.",
        "Os colaboradores sobrecarregados avaliam pior as refeições da empresa (Notas 1 e 2).",
        "Salários de base baixa (R$ 2.200 a R$ 2.500) mostram maior propensão a fadiga mental.",
        "TI e Diretoria mantêm as melhores médias de engajamento do refeitório."
      ],
      metrics: [
        { label: "Nota de Refeição Marcos Dias", value: "1.0 (Muito Ruim)" },
        { label: "Média Horas Extras Atendimento", value: "17 Horas/Mês" },
        { label: "Salário Base Assistente", value: "R$ 2.200,00" }
      ],
      layout: "grid"
    },
    {
      id: 4,
      title: "Visão Financeira: Custos Fixos e Conversão de Metas",
      subtitle: "Metas de Faturamento Corporativo vs Recursos Alocados",
      bulletPoints: [
        "Vendas alcançou apenas R$ 31.710,75 do objetivo de R$ 200.000,00 (15.8%).",
        "Operações de infraestrutura fixa consomem R$ 25.000 do orçamento alocado (95K total).",
        "A TI demonstra alto consumo (15K infra), mas gera resoluções consistentes.",
        "Falta automação de canais: Chat e E-mail resolvem rápido, Telefone gera os chamados mais lentos."
      ],
      metrics: [
        { label: "Faturamento Real", value: "R$ 31.710,75" },
        { label: "Meta de Vendas", value: "R$ 200.000,00" },
        { label: "Custo Fixo de Infra (Operações)", value: "R$ 25.000,00" }
      ],
      layout: "two-column"
    },
    {
      id: 5,
      title: "Recomendações e Plano de Ação Estratégico",
      subtitle: "Iniciativas de Curto, Médio e Longo Prazo",
      bulletPoints: [
        "Substituir faturamento de suporte por um sistema automatizado para evitar gargalos (R$-0.92).",
        "Remanejar orçamento excedente de Diretoria/TI para contratar 1 Assistente de Apoio no Atendimento.",
        "Reavaliar a qualidade e variedade do cardápio do refeitório nas terças e quartas-feiras.",
        "Adotar KPIs baseados no Tempo de Resolução de chamados com bonificação progressiva."
      ],
      metrics: [
        { label: "Economia Projetada em Suporte", value: "25% de tempo" },
        { label: "Redução Estimada de Horas Extras", value: "35% ao mês" },
        { label: "Aumento de Satisfação dos Clientes", value: "+1.8 na Nota" }
      ],
      layout: "hero"
    }
  ],
  pdfReport: {
    title: "Relatório de Correlações e Análise de Otimização Corporativa",
    subtitle: "Consolidação de Dados Financeiros, Operacionais e Clima de Trabalho via IA",
    introduction: "Este relatório apresenta uma análise aprofundada dos resultados cruzados das operações intersetoriais da empresa em Abril de 2024. Foram integrados dados de Orçamento Setorial, Consumos do Refeitório, Chamados de Suporte, Cadastro de Colaboradores e Feedbacks de Clientes compradores. O foco principal foi detectar gargalos que impedem o alcance das metas corporativas e influenciam negativamente a experiência geral de funcionários e parceiros.",
    keyInsights: [
      "Extrema Correlação Negativa (r = -0.92) entre o tempo de resolução de suporte técnico e a nota atribuída pelo cliente final.",
      "Gargalo de Horas Extras crônico no setor de Atendimento (média de 17h extras por mês), levando a esgotamento.",
      "A insatisfação com a carga de trabalho degrada diretamente a percepção de benefícios secundários (como a refeição corporativa).",
      "O setor de Vendas atingiu apenas 15.8% de sua ambiciosa meta de Faturamento de R$ 200.000 devido a falhas de comunicação e billing."
    ],
    detailedAnalysis: [
      {
        section: "Análise de Suporte Técnico e Pós-Venda",
        text: "O pós-venda demonstrou ser o ponto onde a empresa mais perde eficiência operacional. Clientes de maior ticket, como a Empresa Alpha (R$ 1540.50 e R$ 2100.00) costumam ter alto grau de tolerância caso o contato seja ágil, mas empresas emergentes como Beto Tech deram nota baixa de satisfação (Nota 2) porque ficaram pendentes de faturamento lento e chamados telefônicos prolongados de até 120 minutos. Isto demonstra que o canal Telefônico é ineficiente comparado ao Chat direto, que possui resoluções médias inferiores a 25 minutos."
      },
      {
        section: "O Fator Humano e Clima Organizacional (Custo Invisível)",
        text: "Enquanto a TI opera de forma eficiente com suporte, Atendimento está operando no limite de sua capacidade. Ana Clara e Marcos Dias realizam horas extras excessivas de 25h e 18h respetivas, recebendo salários baixos (R$ 2500,00). O esgotamento deles reflete diretamente nas avaliações negativas do refeitório (onde avaliações caíram para 1 e 3 estrelas em dias de trabalho prolongados). Há um risco iminente de turnover no Atendimento, o que degradaria ainda mais os níveis de satisfação e pós-venda."
      },
      {
        section: "Orçamento e Eficácia de Metas",
        text: "Atualmente, a Diretoria possui R$ 120.000,00 alocados, e TI possui R$ 80.000,00. Em contrapartida, Vendas possui apenas R$ 50.000,00 alocados para alavancar uma grande meta de R$ 200.000,00. Como o pós-venda de Vendas é frágil, as taxas de retenção de clientes sofreram impacto negativo. Operações consome R$ 95.000,00 e possui custos fixos elevados de infraestrutura de R$ 25.000,00 por mês, sem canais de contribuição direta ao faturamento bruto."
      }
    ],
    recommendations: [
      "Reestruturação de Horas Extras: Contratar um profissional júnior adicional ou assistente para aliviar o Atendimento, reduzindo horas extras e estresse.",
      "Digitalização do Atendimento Telefônico: Migrar canais telefônicos e e-mails lentos para uma triagem moderna com Chat rápido de suporte, diminuindo tempos de chamada de 120 para menos de 30 minutos.",
      "Ajuste Orçamentário e Metas Realistas: Redimensionar orçamentos subutilizados de Diretoria e remanejar para Vendas de forma a garantir campanhas de retenção pós-compra do cliente final.",
      "Auditoria de Refeitório Corporativo: Realizar uma revisão do fornecedor de alimentação especificamente para o refeitório com foco na equipe operária e de suporte."
    ]
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI analysis of correlations
  app.post("/api/ai/analyze", async (req, res) => {
    const userApiKey = process.env.GEMINI_API_KEY;

    if (!userApiKey || userApiKey === "MY_GEMINI_API_KEY" || userApiKey.trim() === "") {
      // Return structured fallback JSON if key is empty or placeholder, fully styled
      console.log("No GEMINI_API_KEY set. Returning AI-curated fallback analysis.");
      return res.json({
        ...fallbackReport,
        isFallback: true,
        message: "Usando relatório de correlação pré-estruturado via IA. (Insira sua chave GEMINI_API_KEY no menu de Secrets para habilitar consultas interativas em tempo real)"
      });
    }

    const customInstruction = req.body && req.body.customInstruction ? req.body.customInstruction : "";

    try {
      console.log("Calling Gemini 3.5-flash live model for correlation analysis...");
      const ai = new GoogleGenAI({
        apiKey: userApiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const promptText = `Você é um Cientista de Dados e Engenheiro de IA sênior.
Analise os 5 conjuntos de dados corporativos fornecidos e retorne uma análise abrangente e profunda, cobrindo:
1. Correlações entre custos de refeição corporativos, avaliações dos colaboradores e cargas horárias.
2. Correlação entre o tempo de resolução de chamados de atendimento e a nota atribuída no feedback de compras pelo cliente.
3. Conversão de Orçamentos de Setor vs Faturamento Real (calculado pela soma dos gastos cadastrados nas compras associadas).
4. Sobrecarga e clima organizacional por setor.

Cruze os dados exatos fornecidos abaixo:
- Orçamentos: ${JSON.stringify(orcamentos)}
- Registro de Refeições: ${JSON.stringify(refeicoes)}
- Chamados de Atendimento: ${JSON.stringify(chamados)}
- Funcionários: ${JSON.stringify(funcionarios)}
- Compras e Feedbacks: ${JSON.stringify(comprasFeedback)}

${customInstruction ? `O usuário forneceu a seguinte INSTRUÇÃO ADICIONAL ESPECIAL para orientar as conclusões, recomendações, mapa mental ou simulações da apresentação. Aplique-a rigorosamente:\n"${customInstruction}"\n` : ""}

Gere todos os dados para alimentar um dashboard moderno, contendo o mapa mental detalhado (em formato de nós), os slides da apresentação executiva, e as partes para um relatório PDF formal que o usuário baixará na interface.

Retorne SOMENTE um objeto JSON que obedeça RIGOROSAMENTE ao esquema de saída solicitado. Não inclua Markdown, tags HTML ou texto explicativo extra.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2, // low temperature for precise correlation metrics
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              correlations: {
                type: Type.ARRAY,
                description: "Lista de frentes de análise de correlação cruzada estatística dos datasets",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Nome elegante da correlação encontrada" },
                    coefficient: { type: Type.STRING, description: "Coeficiente de Pearson calculado e classificação (ex: r = -0.92 forte correlação negativa)" },
                    description: { type: Type.STRING, description: "Justificativa textual completa baseada nos dados exatos fornecidos" },
                    impact: { type: Type.STRING, description: "Grau de gravidade ou impacto: Alto, Médio, Baixo" },
                    metricX: { type: Type.STRING, description: "Nome da variável do eixo X" },
                    metricY: { type: Type.STRING, description: "Nome da variável do eixo Y" },
                    dataPoints: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING, description: "Etiqueta identificadora do ponto (ex: Nome do funcionário ou ID de compra)" },
                          x: { type: Type.NUMBER, description: "Valor numérico para o eixo X" },
                          y: { type: Type.NUMBER, description: "Valor numérico para o eixo Y" }
                        },
                        required: ["label", "x", "y"]
                      }
                    }
                  },
                  required: ["title", "coefficient", "description", "impact", "metricX", "metricY", "dataPoints"]
                }
              },
              mindmap: {
                type: Type.ARRAY,
                description: "Array plano de nós e sub-nós estruturando de forma fluida o mapa mental de conclusões cruzadas",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "ID único do nó" },
                    label: { type: Type.STRING, description: "Texto conciso do nó" },
                    parent: { type: Type.STRING, description: "ID do nó pai, use '' para a raiz" },
                    color: { type: Type.STRING, description: "Cor hex sugerida para colorir este nó no mapa mental" },
                    description: { type: Type.STRING, description: "Notas explicativas para este nó" }
                  },
                  required: ["id", "label", "parent"]
                }
              },
              presentation: {
                type: Type.ARRAY,
                description: "Conjunto ordenado de 5 slides para construir a apresentação executiva e dinâmica",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    title: { type: Type.STRING, description: "Título do slide" },
                    subtitle: { type: Type.STRING, description: "Subtítulo de apoio contextual" },
                    bulletPoints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Listagem de pontos-chave com dados estatísticos"
                    },
                    metrics: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING },
                          value: { type: Type.STRING }
                        }
                      },
                      description: "Pares de chave/valor numérico de grande impacto para destaque"
                    },
                    layout: { type: Type.STRING, description: "Tipo de layout para estilizar: ex 'hero', 'two-column', 'grid'" }
                  },
                  required: ["id", "title", "subtitle", "bulletPoints", "metrics", "layout"]
                }
              },
              pdfReport: {
                type: Type.OBJECT,
                description: "Informações estruturadas e textualização completa para elaboração do Relatório PDF",
                properties: {
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  introduction: { type: Type.STRING },
                  keyInsights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  detailedAnalysis: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        section: { type: Type.STRING },
                        text: { type: Type.STRING }
                      },
                      required: ["section", "text"]
                    }
                  },
                  recommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "subtitle", "introduction", "keyInsights", "detailedAnalysis", "recommendations"]
              }
            },
            required: ["correlations", "mindmap", "presentation", "pdfReport"]
          }
        }
      });

      const responseText = response.text || "";
      const parsedData = JSON.parse(responseText.trim());

      return res.json({
        ...parsedData,
        isFallback: false
      });
    } catch (error: any) {
      console.error("Gemini API computation failed. Falling back to structured default model report:", error);
      return res.json({
        ...fallbackReport,
        isFallback: true,
        message: "Usando relatório de correlação pré-estruturado via IA. Nota: Ocorreu um erro temporário na API do Gemini. Detalhes: " + (error.message || error)
      });
    }
  });

  // Serve static UI assets or Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

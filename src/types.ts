export interface Orcamento {
  Setor: string;
  Ano_Mes: string;
  Orcamento_Alocado: number;
  Custo_Fixo_Infra: number;
  Meta_Faturamento: number;
}

export interface RegistroRefeicao {
  ID_Registro: number;
  ID_Funcionario: number;
  Data_Consumo: string;
  Tipo_Refeicao: string;
  Valor_Refeicao: number;
  Avaliacao_Refeicao: number;
}

export interface Chamado {
  ID_Chamado: number;
  ID_Compra: number;
  ID_Funcionario: number;
  Tempo_Resolucao_Minutos: number;
  Status_Chamado: string;
  Canal_Atendimento: string;
}

export interface Funcionario {
  ID_Funcionario: number;
  Nome_Funcionario: string;
  Setor: string;
  Cargo: string;
  Data_Admissao: string;
  Salario_Base: number;
  Custo_Alimentacao_Mensal: number;
  Horas_Extras: number;
}

export interface CompraFeedback {
  ID_Compra: number;
  ID_Cliente: string;
  Nome_Cliente: string;
  Data_Compra: string;
  Valor_Gasto: number;
  Setor_Atendimento: string;
  Nota_Feedback: number;
  Comentario_Feedback: string;
}

// AI Analysis Types
export interface DataPoint {
  label: string;
  x: number;
  y: number;
}

export interface AICorrelation {
  title: string;
  coefficient: string;
  description: string;
  impact: string;
  metricX: string;
  metricY: string;
  dataPoints: DataPoint[];
}

export interface AIMindmapNode {
  id: string;
  label: string;
  parent: string;
  color?: string;
  description?: string;
}

export interface AIPresentationSlide {
  id: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  layout: string; // e.g. "hero" | "two-column" | "grid"
}

export interface AIPdfReportSection {
  section: string;
  text: string;
}

export interface AIPdfReport {
  title: string;
  subtitle: string;
  introduction: string;
  keyInsights: string[];
  detailedAnalysis: AIPdfReportSection[];
  recommendations: string[];
}

export interface AIAnalysisResult {
  correlations: AICorrelation[];
  mindmap: AIMindmapNode[];
  presentation: AIPresentationSlide[];
  pdfReport: AIPdfReport;
  isFallback?: boolean;
  message?: string;
}

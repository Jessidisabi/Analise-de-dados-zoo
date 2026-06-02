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

export const orcamentos: Orcamento[] = [
  { Setor: "TI", Ano_Mes: "2024-04", Orcamento_Alocado: 80000.00, Custo_Fixo_Infra: 15000.00, Meta_Faturamento: 0.00 },
  { Setor: "Vendas", Ano_Mes: "2024-04", Orcamento_Alocado: 50000.00, Custo_Fixo_Infra: 7000.00, Meta_Faturamento: 200000.00 },
  { Setor: "Operações", Ano_Mes: "2024-04", Orcamento_Alocado: 95000.00, Custo_Fixo_Infra: 25000.00, Meta_Faturamento: 0.00 },
  { Setor: "Atendimento", Ano_Mes: "2024-04", Orcamento_Alocado: 35000.00, Custo_Fixo_Infra: 4500.00, Meta_Faturamento: 0.00 },
  { Setor: "RH", Ano_Mes: "2024-04", Orcamento_Alocado: 25000.00, Custo_Fixo_Infra: 3000.00, Meta_Faturamento: 0.00 },
  { Setor: "Diretoria", Ano_Mes: "2024-04", Orcamento_Alocado: 120000.00, Custo_Fixo_Infra: 10000.00, Meta_Faturamento: 0.00 }
];

export const refeicoes: RegistroRefeicao[] = [
  { ID_Registro: 1, ID_Funcionario: 1, Data_Consumo: "2024-04-01", Tipo_Refeicao: "Almoço", Valor_Refeicao: 22.50, Avaliacao_Refeicao: 4 },
  { ID_Registro: 2, ID_Funcionario: 3, Data_Consumo: "2024-04-01", Tipo_Refeicao: "Almoço", Valor_Refeicao: 22.50, Avaliacao_Refeicao: 5 },
  { ID_Registro: 3, ID_Funcionario: 4, Data_Consumo: "2024-04-01", Tipo_Refeicao: "Almoço", Valor_Refeicao: 22.50, Avaliacao_Refeicao: 3 },
  { ID_Registro: 4, ID_Funcionario: 5, Data_Consumo: "2024-04-01", Tipo_Refeicao: "Almoço", Valor_Refeicao: 30.00, Avaliacao_Refeicao: 2 },
  { ID_Registro: 5, ID_Funcionario: 1, Data_Consumo: "2024-04-02", Tipo_Refeicao: "Almoço", Valor_Refeicao: 22.50, Avaliacao_Refeicao: 4 },
  { ID_Registro: 6, ID_Funcionario: 2, Data_Consumo: "2024-04-02", Tipo_Refeicao: "Almoço", Valor_Refeicao: 30.00, Avaliacao_Refeicao: 5 },
  { ID_Registro: 7, ID_Funcionario: 7, Data_Consumo: "2024-04-02", Tipo_Refeicao: "Almoço", Valor_Refeicao: 22.50, Avaliacao_Refeicao: 4 },
  { ID_Registro: 8, ID_Funcionario: 9, Data_Consumo: "2024-04-02", Tipo_Refeicao: "Almoço", Valor_Refeicao: 22.50, Avaliacao_Refeicao: 1 },
  { ID_Registro: 9, ID_Funcionario: 12, Data_Consumo: "2024-04-02", Tipo_Refeicao: "Almoço", Valor_Refeicao: 22.50, Avaliacao_Refeicao: 3 },
  { ID_Registro: 10, ID_Funcionario: 15, Data_Consumo: "2024-04-02", Tipo_Refeicao: "Almoço", Valor_Refeicao: 22.50, Avaliacao_Refeicao: 4 },
  { ID_Registro: 11, ID_Funcionario: 3, Data_Consumo: "2024-04-02", Tipo_Refeicao: "Jantar", Valor_Refeicao: 25.00, Avaliacao_Refeicao: 4 },
  { ID_Registro: 12, ID_Funcionario: 6, Data_Consumo: "2024-04-02", Tipo_Refeicao: "Almoço", Valor_Refeicao: 30.00, Avaliacao_Refeicao: 5 }
];

export const chamados: Chamado[] = [
  { ID_Chamado: 501, ID_Compra: 102, ID_Funcionario: 4, Tempo_Resolucao_Minutos: 45, Status_Chamado: "Resolvido", Canal_Atendimento: "Chat" },
  { ID_Chamado: 502, ID_Compra: 104, ID_Funcionario: 12, Tempo_Resolucao_Minutos: 15, Status_Chamado: "Resolvido", Canal_Atendimento: "E-mail" },
  { ID_Chamado: 503, ID_Compra: 106, ID_Funcionario: 9, Tempo_Resolucao_Minutos: 120, Status_Chamado: "Resolvido", Canal_Atendimento: "Telefone" },
  { ID_Chamado: 504, ID_Compra: 108, ID_Funcionario: 12, Tempo_Resolucao_Minutos: 30, Status_Chamado: "Resolvido", Canal_Atendimento: "Chat" },
  { ID_Chamado: 505, ID_Compra: 110, ID_Funcionario: 4, Tempo_Resolucao_Minutos: 60, Status_Chamado: "Resolvido", Canal_Atendimento: "Telefone" },
  { ID_Chamado: 506, ID_Compra: 111, ID_Funcionario: 12, Tempo_Resolucao_Minutos: 25, Status_Chamado: "Resolvido", Canal_Atendimento: "Chat" },
  { ID_Chamado: 507, ID_Compra: 113, ID_Funcionario: 9, Tempo_Resolucao_Minutos: 10, Status_Chamado: "Resolvido", Canal_Atendimento: "Chat" },
  { ID_Chamado: 508, ID_Compra: 115, ID_Funcionario: 12, Tempo_Resolucao_Minutos: 40, Status_Chamado: "Resolvido", Canal_Atendimento: "E-mail" }
];

export const funcionarios: Funcionario[] = [
  { ID_Funcionario: 1, Nome_Funcionario: "Carlos Silva", Setor: "Operações", Cargo: "Analista Jr", Data_Admissao: "2022-01-15", Salario_Base: 3500.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 12 },
  { ID_Funcionario: 2, Nome_Funcionario: "Mariana Costa", Setor: "Vendas", Cargo: "Gerente", Data_Admissao: "2020-11-03", Salario_Base: 8500.00, Custo_Alimentacao_Mensal: 600.00, Horas_Extras: 0 },
  { ID_Funcionario: 3, Nome_Funcionario: "João Pedro", Setor: "TI", Cargo: "Desenvolvedor", Data_Admissao: "2023-03-22", Salario_Base: 5500.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 8 },
  { ID_Funcionario: 4, Nome_Funcionario: "Ana Clara", Setor: "Atendimento", Cargo: "Assistente", Data_Admissao: "2023-08-10", Salario_Base: 2500.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 25 },
  { ID_Funcionario: 5, Nome_Funcionario: "Roberto Alves", Setor: "Operações", Cargo: "Supervisor", Data_Admissao: "2019-05-18", Salario_Base: 6200.00, Custo_Alimentacao_Mensal: 600.00, Horas_Extras: 5 },
  { ID_Funcionario: 6, Nome_Funcionario: "Fernanda Lima", Setor: "TI", Cargo: "Engenheira de Dados", Data_Admissao: "2021-09-01", Salario_Base: 9200.00, Custo_Alimentacao_Mensal: 600.00, Horas_Extras: 10 },
  { ID_Funcionario: 7, Nome_Funcionario: "Lucas Gomes", Setor: "Vendas", Cargo: "Vendedor", Data_Admissao: "2024-01-10", Salario_Base: 3000.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 15 },
  { ID_Funcionario: 8, Nome_Funcionario: "Beatriz Santos", Setor: "RH", Cargo: "Analista Pleno", Data_Admissao: "2022-07-14", Salario_Base: 4800.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 0 },
  { ID_Funcionario: 9, Nome_Funcionario: "Marcos Dias", Setor: "Atendimento", Cargo: "Assistente", Data_Admissao: "2023-11-20", Salario_Base: 2500.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 18 },
  { ID_Funcionario: 10, Nome_Funcionario: "Juliana Rocha", Setor: "Operações", Cargo: "Analista Pleno", Data_Admissao: "2021-02-28", Salario_Base: 4500.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 4 },
  { ID_Funcionario: 11, Nome_Funcionario: "Rafael Souza", Setor: "Diretoria", Cargo: "Diretor", Data_Admissao: "2018-10-15", Salario_Base: 15000.00, Custo_Alimentacao_Mensal: 800.00, Horas_Extras: 0 },
  { ID_Funcionario: 12, Nome_Funcionario: "Camila Ribeiro", Setor: "TI", Cargo: "Suporte", Data_Admissao: "2024-02-05", Salario_Base: 3200.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 22 },
  { ID_Funcionario: 13, Nome_Funcionario: "Diego Martins", Setor: "Vendas", Cargo: "Vendedor", Data_Admissao: "2023-05-12", Salario_Base: 3000.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 10 },
  { ID_Funcionario: 14, Nome_Funcionario: "Aline Mendes", Setor: "Atendimento", Cargo: "Supervisora", Data_Admissao: "2020-04-08", Salario_Base: 5500.00, Custo_Alimentacao_Mensal: 600.00, Horas_Extras: 8 },
  { ID_Funcionario: 15, Nome_Funcionario: "Bruno Nunes", Setor: "Operações", Cargo: "Assistente", Data_Admissao: "2024-03-01", Salario_Base: 2200.00, Custo_Alimentacao_Mensal: 450.00, Horas_Extras: 30 }
];

export const comprasFeedback: CompraFeedback[] = [
  { ID_Compra: 101, ID_Cliente: "C001", Nome_Cliente: "Empresa Alpha", Data_Compra: "2024-04-01", Valor_Gasto: 1540.50, Setor_Atendimento: "Vendas", Nota_Feedback: 5, Comentario_Feedback: "Atendimento excelente e rápido." },
  { ID_Compra: 102, ID_Cliente: "C002", Nome_Cliente: "Beto Tech", Data_Compra: "2024-04-02", Valor_Gasto: 320.00, Setor_Atendimento: "Atendimento", Nota_Feedback: 2, Comentario_Feedback: "Demora na resolução do problema de faturamento." },
  { ID_Compra: 103, ID_Cliente: "C003", Nome_Cliente: "Mercado XYZ", Data_Compra: "2024-04-02", Valor_Gasto: 8900.00, Setor_Atendimento: "Vendas", Nota_Feedback: 4, Comentario_Feedback: "Bom produto mas entrega atrasou um dia." },
  { ID_Compra: 104, ID_Cliente: "C004", Nome_Cliente: "Livraria Sol", Data_Compra: "2024-04-03", Valor_Gasto: 450.75, Setor_Atendimento: "Suporte", Nota_Feedback: 5, Comentario_Feedback: "Problema resolvido na hora pelo time de TI." },
  { ID_Compra: 105, ID_Cliente: "C001", Nome_Cliente: "Empresa Alpha", Data_Compra: "2024-04-05", Valor_Gasto: 2100.00, Setor_Atendimento: "Vendas", Nota_Feedback: 5, Comentario_Feedback: "Nova compra realizada com sucesso." },
  { ID_Compra: 106, ID_Cliente: "C005", Nome_Cliente: "Consultoria Beta", Data_Compra: "2024-04-06", Valor_Gasto: 650.00, Setor_Atendimento: "Atendimento", Nota_Feedback: 3, Comentario_Feedback: "Atendimento mediano atendente parecia confuso." },
  { ID_Compra: 107, ID_Cliente: "C006", Nome_Cliente: "Loja da Esquina", Data_Compra: "2024-04-07", Valor_Gasto: 120.00, Setor_Atendimento: "Vendas", Nota_Feedback: 1, Comentario_Feedback: "Produto veio com defeito e ninguém me retorna." },
  { ID_Compra: 108, ID_Cliente: "C002", Nome_Cliente: "Beto Tech", Data_Compra: "2024-04-08", Valor_Gasto: 800.00, Setor_Atendimento: "Suporte", Nota_Feedback: 4, Comentario_Feedback: "Melhorou bastante em relação ao último chamado." },
  { ID_Compra: 109, ID_Cliente: "C007", Nome_Cliente: "Construtora Alfa", Data_Compra: "2024-04-09", Valor_Gasto: 12500.00, Setor_Atendimento: "Vendas", Nota_Feedback: 5, Comentario_Feedback: "Parceria sólida." },
  { ID_Compra: 110, ID_Cliente: "C003", Nome_Cliente: "Mercado XYZ", Data_Compra: "2024-04-10", Valor_Gasto: 430.00, Setor_Atendimento: "Atendimento", Nota_Feedback: 2, Comentario_Feedback: "Fiquei 40 minutos na linha esperando." },
  { ID_Compra: 111, ID_Cliente: "C008", Nome_Cliente: "Startup Inova", Data_Compra: "2024-04-10", Valor_Gasto: 3400.00, Setor_Atendimento: "Suporte", Nota_Feedback: 5, Comentario_Feedback: "Integração de sistema perfeita." },
  { ID_Compra: 112, ID_Cliente: "C009", Nome_Cliente: "Clínica Saúde", Data_Compra: "2024-04-11", Valor_Gasto: 950.25, Setor_Atendimento: "Vendas", Nota_Feedback: 4, Comentario_Feedback: "Preço um pouco alto mas a qualidade compensa." },
  { ID_Compra: 113, ID_Cliente: "C004", Nome_Cliente: "Livraria Sol", Data_Compra: "2024-04-12", Valor_Gasto: 200.00, Setor_Atendimento: "Atendimento", Nota_Feedback: 5, Comentario_Feedback: "Sempre muito bem atendido." },
  { ID_Compra: 114, ID_Cliente: "C010", Nome_Cliente: "Escola Futuro", Data_Compra: "2024-04-13", Valor_Gasto: 5600.00, Setor_Atendimento: "Vendas", Nota_Feedback: 3, Comentario_Feedback: "Faltou clareza no contrato de implantação." },
  { ID_Compra: 115, ID_Cliente: "C001", Nome_Cliente: "Empresa Alpha", Data_Compra: "2024-04-15", Valor_Gasto: 800.00, Setor_Atendimento: "Suporte", Nota_Feedback: 5, Comentario_Feedback: "Sistema está rodando liso agora." }
];

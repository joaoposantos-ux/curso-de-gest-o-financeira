import React from 'react';
import QuizModulo from './QuizModulo';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaCheckCircle } from 'react-icons/fa';

const conteudos = [
  {
    id: 1,
    titulo: 'Introdução à Gestão Financeira e Conceitos Básicos',
    cronograma: '2-3 horas',
    texto: `
## O que é Gestão Financeira?

A gestão financeira é a administração estratégica dos recursos financeiros de uma organização ou pessoa, com o objetivo de otimizar o uso do dinheiro, maximizar lucros e garantir a sustentabilidade financeira. É uma disciplina essencial que envolve planejamento, análise, controle e tomada de decisão relacionadas ao capital.

### Importância da Gestão Financeira

A gestão financeira é fundamental para:
- **Sobrevivência da Organização**: Sem controle financeiro adequado, qualquer negócio, por melhor que seja seu produto, pode falhar.
- **Crescimento Sustentável**: Permite identificar oportunidades de crescimento e investimento de forma inteligente.
- **Redução de Riscos**: Auxilia na identificação e mitigação de riscos financeiros.
- **Tomada de Decisão**: Fornece dados precisos para decisões estratégicas baseadas em fatos.
- **Competitividade**: Empresas bem geridas financeiramente conseguem ser mais competitivas no mercado.

### Objetivos Principais da Gestão Financeira

1. **Maximizar o Valor da Empresa**: Aumentar o patrimônio e o valor para os acionistas
2. **Garantir Liquidez**: Manter dinheiro disponível para pagar obrigações
3. **Rentabilidade**: Gerar lucro sobre o capital investido
4. **Eficiência Operacional**: Usar recursos da melhor forma possível
5. **Minimizar Custos**: Reduzir despesas desnecessárias
6. **Planejamento Estratégico**: Preparar a organização para o futuro

### O Ciclo Financeiro

O ciclo financeiro envolve:
- **Receita**: Dinheiro que entra
- **Despesa**: Dinheiro que sai
- **Investimento**: Aplicação de recursos em ativos
- **Retorno**: Lucro ou ganho gerado

### Diferenças entre Gestão Financeira Organizacional e Pessoal

**Gestão Financeira Organizacional:**
- Envolve empresas e instituições
- Foco em lucro e sustentabilidade do negócio
- Análise de demonstrativos contábeis complexos
- Envolvimento de múltiplos stakeholders

**Gestão Financeira Pessoal:**
- Envolve indivíduos e famílias
- Foco em qualidade de vida e segurança financeira
- Controle de renda e despesas pessoais
- Planejamento para aposentadoria

### Conceitos Fundamentais

**Fluxo de Caixa**: Movimento de dinheiro que entra e sai
**Lucro**: Receita menos despesa
**Ativo**: Bens e direitos
**Passivo**: Obrigações e dívidas
**Patrimônio**: Ativo menos Passivo

Compreender estes conceitos básicos é essencial para dominar toda a gestão financeira.
    `
  },
  {
    id: 2,
    titulo: 'Planejamento e Controle Financeiro',
    cronograma: '3-4 horas',
    texto: `
## Planejamento Financeiro

O planejamento financeiro é o processo de estabelecer objetivos financeiros e definir estratégias para alcançá-los. É a base para uma gestão financeira eficiente.

### Fases do Planejamento Financeiro

1. **Diagnóstico Financeiro**: Análise da situação atual
   - Levantamento de receitas e despesas
   - Identificação de assets e liabilities
   - Análise de histórico financeiro

2. **Definição de Objetivos**: Estabelecer metas claras e mensuráveis
   - Curto prazo (até 1 ano)
   - Médio prazo (1 a 5 anos)
   - Longo prazo (acima de 5 anos)

3. **Definição de Estratégias**: Como alcançar os objetivos
   - Alocação de recursos
   - Definição de prioridades
   - Planejamento de investimentos

4. **Implementação**: Colocar o plano em ação
   - Execução das estratégias
   - Monitoramento de resultados
   - Ajustes necessários

### Orçamento: Ferramenta Essencial

Um orçamento é um plano quantificado de receitas e despesas para um período futuro. Tipos de orçamento:

**Orçamento Operacional**: Receitas e despesas do dia a dia
**Orçamento de Investimento**: Despesas com ativos fixos
**Orçamento de Caixa**: Fluxo de entradas e saídas de dinheiro

### Controle Financeiro

O controle financeiro envolve:

- **Monitoramento**: Acompanhar a execução do orçamento
- **Comparação**: Confrontar real com orçado
- **Análise de Variações**: Identificar desvios
- **Correções**: Implementar ações corretivas quando necessário

### Indicadores de Desempenho

**Margem de Lucro**: (Lucro / Receita) × 100
**Rentabilidade sobre Investimento (ROI)**: (Lucro / Investimento) × 100
**Período de Payback**: Tempo para recuperar investimento inicial
**Taxa de Retorno**: Ganho percentual sobre investimento

### Tecnologias e Ferramentas

Ferramentas modernas para gestão:
- Softwares de contabilidade
- Planilhas eletrônicas
- Sistemas ERP
- Aplicativos de gestão pessoal
- Dashboards em tempo real

### Estratégias de Controle

1. **Separação de Responsabilidades**: Pessoas diferentes para aprovar e executar
2. **Registros Detalhados**: Documentação completa de todas as transações
3. **Reconciliações**: Comparar registros com extratos bancários
4. **Auditorias**: Revisões periódicas independentes
5. **Políticas Claras**: Regras definidas para gastos e aprovações
    `
  },
  {
    id: 3,
    titulo: 'Análise de Demonstrativos Contábeis',
    cronograma: '3-4 horas',
    texto: `
## Demonstrativos Contábeis Fundamentais

Os demonstrativos contábeis são documentos que apresentam a situação financeira de uma organização. São ferramentas essenciais para análise e tomada de decisão.

### Balanço Patrimonial (BP)

O Balanço Patrimonial é uma fotografia da posição financeira em um momento específico, mostrando:

**Ativo (O que a empresa possui):**
- Ativo Circulante: Disponibilidades, contas a receber, estoque (até 1 ano)
- Ativo Não Circulante: Imóveis, máquinas, equipamentos (longo prazo)

**Passivo (O que a empresa deve):**
- Passivo Circulante: Contas a pagar, empréstimos de curto prazo
- Passivo Não Circulante: Empréstimos de longo prazo, financiamentos

**Patrimônio Líquido (Ativo - Passivo):**
- Capital Social: Investimento dos proprietários
- Lucros Retidos: Lucros não distribuídos
- Reservas: Valores separados para objetivos específicos

**Fórmula Fundamental: Ativo = Passivo + Patrimônio Líquido**

### Demonstração do Resultado do Exercício (DRE)

A DRE apresenta o desempenho financeiro durante um período (geralmente um ano), mostrando:

**Receita Bruta**: Total de vendas e serviços
- Menos: Devoluções e descontos
- **Receita Líquida**: Receita efetiva

**Custos e Despesas**:
- Custo de Mercadorias Vendidas (CMV): Custo dos produtos vendidos
- Despesas Operacionais: Salários, aluguel, marketing
- Despesas Financeiras: Juros de empréstimos

**Resultado Final**:
- EBIT (Lucro Operacional)
- Resultado Financeiro
- **Lucro Líquido**: Resultado final após impostos

### Fluxo de Caixa

Diferente da DRE, o Fluxo de Caixa mostra o movimento real de dinheiro:

**Atividades Operacionais**: Caixa gerado pelas operações
**Atividades de Investimento**: Compra/venda de ativos
**Atividades de Financiamento**: Empréstimos, pagamentos de dividendos

### Análise Horizontal e Vertical

**Análise Horizontal**: Compara dados do mesmo item ao longo de vários períodos
- Identifica tendências
- Mostra crescimento ou declínio

**Análise Vertical**: Compara cada item com o total de sua categoria
- Mostra proporções
- Facilita comparações entre empresas de tamanhos diferentes

### Razões Financeiras Importantes

**Liquidez Corrente**: Ativo Circulante / Passivo Circulante
- Mede capacidade de pagar obrigações de curto prazo

**Rentabilidade do Patrimônio**: Lucro Líquido / Patrimônio Líquido
- Mostra retorno sobre investimento dos proprietários

**Endividamento**: Passivo Total / Ativo Total
- Indica o percentual de financiamento externo

### Interpretação e Uso

Os demonstrativos contábeis são usados por:
- **Investidores**: Para decidir em quais empresas investir
- **Credores**: Para avaliar risco de empréstimos
- **Gestores**: Para tomar decisões operacionais
- **Órgãos Reguladores**: Para verificar conformidade
    `
  },
  {
    id: 4,
    titulo: 'Fluxo de Caixa e Capital de Giro',
    cronograma: '2-3 horas',
    texto: `
## Fluxo de Caixa: O Sangue do Negócio

"Fluxo de caixa é a circulação do dinheiro". É absolutamente essencial para a sobrevivência de qualquer negócio, independentemente de sua lucratividade contábil.

### Por que Fluxo de Caixa é Crítico?

Uma empresa pode ser lucrativa em termos contábeis mas falir por falta de caixa. Por exemplo:
- Você vende um produto por R$ 1.000 com 90 dias de prazo
- Seu fornecedor cobra à vista: R$ 600
- Você tem lucro de R$ 400, mas não tem o dinheiro hoje!

### Estrutura do Fluxo de Caixa

**Entradas de Caixa:**
- Vendas à vista
- Recebimento de contas a receber
- Empréstimos
- Investimentos de proprietários

**Saídas de Caixa:**
- Pagamento de fornecedores
- Salários e encargos
- Aluguel e contas
- Impostos
- Financiamentos e juros

**Saldo de Caixa**: Entradas - Saídas

### Métodos de Elaboração

**Método Direto**: Baseia-se em movimentações reais de caixa
- Mais simples
- Fácil de entender
- Apropriado para planejamento

**Método Indireto**: Parte do lucro líquido e faz ajustes
- Mais complexo
- Baseia-se na DRE
- Usado em demonstrativos formais

### Ciclo Operacional

O ciclo operacional é o tempo entre comprar materiais e receber o dinheiro da venda:

1. **Compra de Matéria-Prima**: 30 dias de prazo
2. **Produção**: 15 dias
3. **Venda**: 60 dias de prazo
4. **Ciclo Total**: 105 dias

Durante este período, a empresa não tem acesso ao dinheiro!

### Ciclo Financeiro

Ciclo Operacional menos o prazo de pagamento aos fornecedores:
- Ciclo Operacional: 105 dias
- Prazo de Fornecedor: 30 dias
- **Ciclo Financeiro: 75 dias**

A empresa precisa financiar 75 dias!

### Capital de Giro

Capital de giro é o montante de recursos necessários para financiar o ciclo operacional da empresa.

**Necessidade de Capital de Giro:**
- Aumenta quando: vendas crescem, ciclo se alonga, prazo de cliente aumenta
- Diminui quando: ciclo reduz, prazo de fornecedor aumenta

**Cálculo Simplificado:**
Capital de Giro = (Ativo Circulante) - (Passivo Circulante)

### Estratégias de Otimização

1. **Reduzir Ciclo de Venda**: Acelerar vendas e recebimentos
   - Descontos à vista
   - Cobrança ativa
   - Venda online

2. **Estender Prazo de Pagamento**: Negociar mais prazo com fornecedores
   - Aumentar relacionamento
   - Manter histórico positivo

3. **Reduzir Estoque**: Ter na mão apenas o necessário
   - Just-in-time
   - Previsão de demanda
   - Gestão de inventário

4. **Acelerar Recebimentos**: Cobrar mais rápido
   - Intermediários financeiros
   - Desconto para antecipação

### Gestão de Caixa Diária

- Manter saldo mínimo
- Aplicar excedentes em produtos de curto prazo
- Planejar despesas sazonais
- Manter linhas de crédito disponíveis
    `
  },
  {
    id: 5,
    titulo: 'Fontes de Financiamento e Investimentos',
    cronograma: '3-4 horas',
    texto: `
## Fontes de Financiamento

Toda organização precisa de recursos para operar e crescer. Existem diversas fontes de financiamento disponíveis:

### Financiamento com Recursos Próprios

**Capital Social**: 
- Investimento inicial dos proprietários
- Vantagem: Sem obrigação de pagamento
- Desvantagem: Dilui a propriedade

**Lucros Retidos**:
- Lucros que a empresa não distribui aos proprietários
- Vantagem: Sem custo explícito
- Desvantagem: Reduz retorno aos proprietários

**Reservas de Capital**:
- Valores separados para objetivos específicos
- Construídas ao longo do tempo

### Financiamento com Recursos de Terceiros

**Empréstimos Bancários**:
- Crédito concedido por bancos
- Prazos curto, médio ou longo
- Cobram juros e taxas
- Exigem garantias

**Financiamentos**:
- Especializados para compras de ativos
- Exemplo: Financiamento imobiliário, de máquinas
- Prazo mais longo
- Garantia é frequentemente o próprio ativo

**Debêntures**:
- Títulos de dívida emitidos pela empresa
- Investidores emprestam dinheiro
- Empresa paga juros periódicos
- Prazo determinado

**Leasing**:
- Aluguel de longo prazo com opção de compra
- Vantagem: Flexibilidade
- Desvantagem: Mais caro que financiamento

**Fornecedores**:
- Prazo de pagamento negociado
- Fonte importante de capital de giro
- Sem custo de juros

### Custo de Capital

O custo de cada fonte de financiamento varia:
- Recursos próprios: Retorno esperado pelos proprietários
- Empréstimos: Taxa de juros cobrada
- Média ponderada: Custo médio de todo o capital

A empresa deve usar capital mais barato quando possível!

## Investimentos

Um investimento é aplicação de recursos visando retorno futuro. Toda decisão de investimento deve responder:
- Quanto vou gastar?
- Quanto vou ganhar?
- Quanto tempo levará?
- Qual é o risco?

### Tipos de Investimentos Empresariais

**Investimentos em Ativos Fixos**:
- Máquinas, equipamentos, imóveis
- Aumentam capacidade produtiva
- Depreciação ao longo do tempo
- Análise: Payback, TIR, VPL

**Investimentos em Capital de Giro**:
- Aumento de estoque, contas a receber
- Necessários para crescimento
- Recuperáveis quando ciclo termina

**Investimentos em Pesquisa e Desenvolvimento**:
- Inovação de produtos
- Melhoria de processos
- Criação de vantagem competitiva

**Investimentos em Recursos Humanos**:
- Treinamento e desenvolvimento
- Impacta produtividade
- Retorno a longo prazo

**Investimentos Financeiros**:
- Aplicações em títulos, ações
- Retorno através de dividendos ou ganhos
- Importante para gerenciar caixa ocioso

### Critérios de Avaliação de Investimentos

**Payback**:
- Tempo necessário para recuperar investimento inicial
- Exemplo: Investimento de R$ 100.000 com lucro de R$ 25.000/ano
- Payback: 4 anos
- Simples, mas ignora fluxos após recuperação

**Taxa Interna de Retorno (TIR)**:
- Taxa de desconto que iguala entradas e saídas
- Compara com custo de capital
- Se TIR > custo capital, investimento é viável

**Valor Presente Líquido (VPL)**:
- Valor presente de todos os fluxos futuros
- Se VPL > 0, investimento agrega valor
- Considerado método mais robusto

**Taxa de Retorno Simples**:
- (Lucro Total / Investimento Inicial) × 100
- Rápido para comparações

### Investimentos Pessoais

Para indivíduos:
- **Renda Fixa**: Menos risco, retorno menor (CDB, Tesouro)
- **Renda Variável**: Mais risco, maior potencial (Ações, Fundos)
- **Imóveis**: Média prazo, retorno por aluguel
- **Educação**: Investimento em si mesmo, maior retorno longo prazo

### Gestão de Risco em Investimentos

- Diversificação: Não colocar tudo em um ativo
- Análise: Estudar antes de investir
- Acompanhamento: Monitorar desempenho
- Ajuste: Mudar estratégia conforme necessário
    `
  },
  {
    id: 6,
    titulo: 'Indicadores de Desempenho Financeiro e Tomada de Decisão',
    cronograma: '3-4 horas',
    texto: `
## Indicadores Financeiros: Medindo o Desempenho

Os indicadores financeiros são métricas que resumem a saúde financeira de uma organização. São ferramentas poderosas para gestão e decisão.

### Indicadores de Liquidez

Medem a capacidade de pagamento de obrigações de curto prazo.

**Liquidez Corrente**: Ativo Circulante / Passivo Circulante
- Ideal: Entre 1,0 e 1,5
- Exemplo: AC = 100, PC = 80, LC = 1,25
- Significa: R$ 1,25 para cada R$ 1 de obrigação

**Liquidez Seca**: (Ativo Circulante - Estoque) / Passivo Circulante
- Mais conservadora
- Exclui estoque (menos líquido)
- Ideal: > 1,0

**Liquidez Imediata**: (Caixa + Aplicações) / Passivo Circulante
- Mais restritiva
- Apenas disponibilidades imediatas

**Interpretação**:
- Alta liquidez: Segurança, mas pode indicar capital parado
- Baixa liquidez: Risco de inadimplência

### Indicadores de Rentabilidade

Medem a capacidade de gerar lucro.

**Margem de Lucro Líquida**: (Lucro Líquido / Receita) × 100
- Qual % da venda vira lucro
- Exemplo: LL = 20, Receita = 100, Margem = 20%

**Rentabilidade do Patrimônio (ROE)**: (Lucro Líquido / Patrimônio Líquido) × 100
- Retorno para proprietários
- Exemplo: LL = 100, PL = 1000, ROE = 10%
- Os proprietários ganharam 10% sobre seu investimento

**Rentabilidade do Ativo (ROA)**: (Lucro Líquido / Ativo Total) × 100
- Eficiência em usar ativos
- Exemplo: LL = 100, Ativo = 500, ROA = 20%

**Giro do Ativo**: Receita / Ativo Total
- Quantas vezes o ativo se "vira" em vendas
- Maior = melhor utilização

**Interpretação**:
- Comparar com concorrentes
- Tendência ao longo do tempo
- Indústria específica

### Indicadores de Endividamento

Medem o percentual de financiamento externo.

**Endividamento Geral**: (Passivo Total / Ativo Total) × 100
- % do ativo financiado com dívida
- Exemplo: Passivo = 600, Ativo = 1000, Endividamento = 60%

**Composição do Endividamento**: Passivo Circulante / Passivo Total
- % da dívida de curto prazo

**Índice de Cobertura**: Lucro Operacional / Despesa Financeira
- Quantas vezes o lucro cobre os juros
- Exemplo: LO = 1000, Juros = 100, Cobertura = 10x
- Segurança maior com cobertura > 5x

**Interpretação**:
- Endividamento alto: Risco, mas alavanca retorno
- Endividamento baixo: Segurança, mas subutiliza financiamento

### Indicadores de Atividade

Medem a eficiência operacional.

**Prazo Médio de Recebimento**: (Contas a Receber × Dias) / Vendas
- Quanto tempo leva para receber
- Exemplo: 30 dias = recebimento em um mês

**Prazo Médio de Pagamento**: (Contas a Pagar × Dias) / Compras
- Quanto tempo a empresa paga fornecedores
- Ideal: Maior que prazo de recebimento

**Giro de Estoque**: Custo de Vendas / Estoque Médio
- Quantas vezes o estoque se renova
- Maior = menos dinheiro parado

**Ciclo Operacional**: Prazo Recebimento + Dias em Estoque - Prazo Pagamento
- Quantos dias de financiamento precisa

### Indicadores de Mercado

Para empresas de capital aberto.

**Lucro por Ação (LPA)**: Lucro Líquido / Número de Ações
- Quanto lucro cada ação gerou

**Preço/Lucro (P/L)**: Preço da Ação / LPA
- Quantas vezes o lucro o mercado paga
- P/L 20 = mercado paga 20 vezes o lucro

**Dividend Yield**: (Dividendo / Preço da Ação) × 100
- Retorno em dividendos
- Mais comum em ações defensivas

### Tomada de Decisão com Indicadores

**1. Análise Histórica**:
- Como os indicadores evoluíram?
- Melhorando ou piorando?

**2. Análise Comparativa**:
- Como estamos vs. concorrentes?
- Como estamos vs. média do setor?

**3. Análise de Tendência**:
- Para onde estamos indo?
- Projetar próximos períodos

**4. Análise de Causas**:
- Por que o indicador mudou?
- Fatores internos ou externos?

**5. Plano de Ação**:
- O que fazer para melhorar?
- Priorizar ações

### Balanced Scorecard (BSC)

Framework que equilibra múltiplas perspectivas:

**Perspectiva Financeira**:
- Lucratividade, retorno, crescimento

**Perspectiva do Cliente**:
- Satisfação, retenção, market share

**Perspectiva Interna**:
- Eficiência, qualidade, inovação

**Perspectiva de Aprendizado**:
- Desenvolvimento de pessoas, tecnologia

### Erro Comum: Números Isolados

Um indicador isolado pode enganar:
- Lucro alto + Liquidez baixa = Risco
- Rentabilidade alta + Endividamento alto = Risco concentrado
- Sempre analisar o conjunto de indicadores!

### Conclusão

Indicadores financeiros são o "painel de controle" da gestão. Um gestor profissional:
- Acompanha regularmente
- Entende o que cada um significa
- Toma ações corretivas quando necessário
- Comunica resultados claramente
    `
  }
];

const imagensModulos = {
  1: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80", // Contabilidade/Calculadora
  2: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", // Planejamento/Gráficos
  3: "https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&w=800&q=80", // Análise de Documentos
  4: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80", // Dinheiro/Moedas
  5: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80", // Investimentos/Bolsa
  6: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"  // Indicadores/Laptop
};

export default function ModuloCurso() {
  const { id } = useParams();
  const modulo = conteudos.find(m => m.id === Number(id));

  if (!modulo) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Módulo não encontrado</h1>
        <Link to="/" className="text-blue-300 hover:text-blue-100">Voltar aos módulos</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center py-12 px-4">
      {/* Breadcrumb */}
      <div className="w-full max-w-4xl mb-6">
        <Link to="/" className="text-blue-300 hover:text-blue-100 flex items-center gap-2 font-semibold">
          <FaArrowLeft /> Voltar aos módulos
        </Link>
      </div>

      {/* Header do Módulo */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-10 mb-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 flex items-start gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-inner border border-white/20">
            <FaBook className="text-3xl text-cyan-300" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight text-white">{modulo.titulo}</h1>
            <div className="flex items-center gap-4 text-blue-100">
              <span className="flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full text-sm border border-blue-700/50">
                ⏱️ Tempo estimado: {modulo.cronograma}
              </span>
              <span className="flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full text-sm border border-blue-700/50">
                📚 Módulo {modulo.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Módulo */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-12 mb-8 border border-gray-100">
        <div className="prose prose-lg max-w-none text-gray-700">
          {modulo.texto.split('\n').map((linha, idx) => {
            // Função para processar negrito inline (**texto**)
            const processarTexto = (texto) => {
              const partes = texto.split(/(\*\*.*?\*\*)/);
              return partes.map((parte, i) => {
                if (parte.startsWith('**') && parte.endsWith('**')) {
                  return <strong key={i} className="text-blue-900 font-bold">{parte.slice(2, -2)}</strong>;
                }
                return parte;
              });
            };

            // Títulos H2 com estilo profissional e divisor
            if (linha.startsWith('## ')) {
              return (
                <div key={idx} className="mt-12 mb-6 pb-4 border-b-2 border-blue-100">
                  <h2 className="text-3xl font-bold text-blue-800 tracking-tight">
                    {linha.replace('## ', '')}
                  </h2>
                </div>
              );
            }

            // Títulos H3 com cor de destaque
            if (linha.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl font-bold text-blue-700 mt-8 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {linha.replace('### ', '')}
                </h3>
              );
            }

            // Itens de lista com bullet personalizado
            if (linha.startsWith('- ')) {
              return (
                <div key={idx} className="flex items-start mb-3 ml-4 group hover:bg-blue-50 p-2 rounded transition-colors">
                  <span className="text-blue-500 mr-3 mt-1.5 text-xs transform group-hover:scale-125 transition-transform">●</span>
                  <p className="text-gray-700 leading-relaxed text-lg">{processarTexto(linha.replace('- ', ''))}</p>
                </div>
              );
            }

            // Listas numeradas
            if (/^\d+\.\s/.test(linha)) {
               return (
                <div key={idx} className="flex items-start mb-3 ml-4 group hover:bg-blue-50 p-2 rounded transition-colors">
                  <span className="font-bold text-blue-600 mr-3 min-w-[1.5rem]">{linha.match(/^\d+\./)[0]}</span>
                  <p className="text-gray-700 leading-relaxed text-lg">{processarTexto(linha.replace(/^\d+\.\s/, ''))}</p>
                </div>
              );
            }
            
            // Linhas vazias como espaçamento
            if (linha.trim() === '') {
              return <div key={idx} className="h-2"></div>;
            }

            // Parágrafos padrão com tipografia melhorada
            return <p key={idx} className="mb-4 leading-relaxed text-gray-700 text-lg text-justify">{processarTexto(linha)}</p>;
          })}
        </div>

        {/* Imagem ilustrativa */}
        <img
          src={imagensModulos[modulo.id] || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"}
          alt="Ilustração do módulo"
          className="my-8 rounded-xl shadow-lg w-full object-cover"
          style={{ maxHeight: 300 }}
        />

        {/* Status */}
        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-gray-700">
            <FaCheckCircle className="inline mr-2 text-green-600" />
            Complete o quiz abaixo para registrar seu progresso neste módulo.
          </p>
        </div>
      </div>

      {/* Quiz Interativo */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaBook /> Teste Seu Conhecimento
        </h2>
        <QuizModulo moduloId={modulo.id} />
      </div>
    </div>
  );
}

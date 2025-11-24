import React, { useState, useMemo } from 'react';
import QuizModulo from './QuizModulo';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaCheckCircle } from 'react-icons/fa';

const conteudos = [
  {
    id: 1,
    titulo: 'Módulo I: Fundamentos da Administração Financeira',
    cronograma: '4-5 horas',
    texto: `
## Unidade 1: Introdução e Conceitos Fundamentais

### 1.1 O que é Administração Financeira?
A Administração Financeira é a arte e a ciência de gerir o dinheiro. Ela envolve a tomada de decisões sobre investimento, financiamento e gestão de ativos, com o objetivo de criar valor para a organização. Não se trata apenas de "contar dinheiro", mas de **planejar** como ele será utilizado para garantir o futuro da empresa.

### 1.2 O Objetivo da Firma
Diferente do que muitos pensam, o objetivo principal não é apenas "maximizar o lucro", pois o lucro é uma medida contábil que pode ser manipulada ou não refletir a geração de caixa. O verdadeiro objetivo é **maximizar a riqueza dos acionistas** (ou o valor da empresa), o que se reflete no preço das ações a longo prazo. Isso considera:
- O valor do dinheiro no tempo.
- O risco associado aos fluxos de caixa esperados.
- O retorno do capital investido.

### 1.3 Os Três Pilares da Decisão Financeira
1.  **Decisão de Investimento (Orçamento de Capital):** Onde a empresa deve alocar seus recursos? Em quais projetos, produtos ou ativos (máquinas, prédios, tecnologia) investir para obter o maior retorno?
2.  **Decisão de Financiamento (Estrutura de Capital):** De onde virá o dinheiro para esses investimentos? Devemos usar capital próprio (sócios) ou capital de terceiros (dívida)? Qual a proporção ideal?
3.  **Decisão de Capital de Giro (Curto Prazo):** Como gerenciar o dia a dia? Quanto manter em caixa? Qual o nível de estoque ideal? Como cobrar os clientes?

---

## Unidade 2: Função e Perfil do Gestor Financeiro

### 2.1 O Papel do Gestor Moderno
O gestor financeiro (CFO - Chief Financial Officer) deixou de ser apenas um "guardião dos livros" para se tornar um estrategista. Suas responsabilidades incluem:
- **Análise e Planejamento:** Transformar dados em informações para tomada de decisão.
- **Gestão de Riscos:** Proteger a empresa contra volatilidade de mercado, câmbio e juros.
- **Relação com Investidores:** Comunicar a estratégia e os resultados da empresa ao mercado.

### 2.2 Ética e Governança Corporativa
A **Teoria da Agência** explica os conflitos de interesse entre os proprietários (acionistas) e os gestores (agentes). Para mitigar esses conflitos, surge a **Governança Corporativa**, um conjunto de regras e processos que garantem transparência, equidade e prestação de contas (accountability).

---

## Unidade 3: O Ambiente Financeiro

### 3.1 Sistema Financeiro Nacional (SFN)
O SFN é o ecossistema onde ocorrem as transações financeiras. Ele conecta agentes superavitários (quem tem dinheiro sobrando) aos agentes deficitários (quem precisa de dinheiro).

### 3.2 Mercados Financeiros
- **Mercado Monetário:** Operações de curtíssimo prazo (liquidez).
- **Mercado de Crédito:** Empréstimos e financiamentos bancários.
- **Mercado de Capitais:** Negociação de títulos de longo prazo (Ações e Debêntures). É aqui que as empresas buscam sócios ou credores de longo prazo.
- **Mercado Cambial:** Troca de moedas estrangeiras.

### 3.3 Instituições Financeiras
- **Bancos Comerciais e de Investimento:** Intermediários clássicos.
- **Bolsa de Valores (B3 no Brasil):** Ambiente de negociação de ações.
- **Corretoras e Distribuidoras:** Acesso dos investidores ao mercado.
    `
  },
  {
    id: 2,
    titulo: 'Módulo II: Análise e Planejamento Financeiro',
    cronograma: '5-6 horas',
    texto: `
## Unidade 1: Fundamentos do Planejamento Financeiro

### 1.1 Conceito e Importância
- **Definição e objetivos:** O Planejamento Financeiro (Curto, Médio e Longo Prazo) é vital para a sustentabilidade.
- **Integração:** Deve estar alinhado com o planejamento estratégico da empresa.
- **Ciclo:** Planejamento, execução e controle.

### 1.2 Previsão de Vendas
- **Métodos quantitativos:** Análise de séries temporais, regressão.
- **Métodos qualitativos:** Opinião de executivos, pesquisa de mercado.
- **Base:** A previsão de vendas é o alicerce de todo o planejamento financeiro.

---

## Unidade 2: Orçamento Empresarial (Budget)

### 2.1 Estrutura do Orçamento
- **Operacional vs. Investimento:** Orçamento Mestre vs. Capex.
- **Vendas:** Elaboração e desdobramento.
- **Produção:** Materiais diretos, mão de obra direta e custos indiretos (CIF).
- **Despesas Operacionais:** Vendas, administrativas e gerais.

### 2.2 Orçamento Financeiro
- **Orçamento de Caixa (Cash Budget):** Previsão detalhada de entradas e saídas.
- **Orçamento de Capital:** Avaliação de projetos de longo prazo.

### 2.3 Demonstrações Projetadas
- **DRE Projetada:** Estimativa de lucro/prejuízo.
- **Balanço Patrimonial Projetado:** Posição patrimonial futura.
- **NFE:** Cálculo da Necessidade de Financiamento Externo.

---

## Unidade 3: Gestão do Capital de Giro e Tesouraria

### 3.1 Administração do Capital de Giro
- **Políticas:** Agressiva, moderada, conservadora.
- **Ciclo Financeiro:** Análise do Ciclo de Caixa e estratégias de redução.

### 3.2 Gestão de Contas a Receber e Pagar
- **Crédito:** Modelos de otimização da política de crédito.
- **Fornecedores:** Estratégias para gerenciamento de pagamentos.

### 3.3 Gestão de Caixa e Títulos
- **Otimização:** Modelos de Baumol e Miller-Orr para saldo de caixa.
- **Liquidez:** Administração de ativos de alta liquidez e títulos negociáveis.

---

## Unidade 4: Controle Financeiro e Análise de Desempenho

### 4.1 Controle Orçamentário
- **Follow-up:** Comparação entre Orçado e Realizado.
- **Relatórios:** Periodicidade e análise de desempenho.

### 4.2 Análise de Variâncias
- **Identificação:** Mensuração das diferenças entre previsto e realizado.
- **Tipos:** Variâncias de vendas (volume/preço) e custos (materiais/mão de obra).
- **Orçamento Flexível:** Ajuste ao nível de atividade real para análise justa.

### 4.3 Custos para Decisão
- **Análise CVL:** Custo-Volume-Lucro.
- **Break-even:** Cálculo do Ponto de Equilíbrio.

---

## Unidade 5: Projeção de Necessidades Financeiras e Estrutura de Capital

### 5.1 Métodos de Projeção
- **Percentual sobre Vendas:** Simples e ajustado.
- **Modelos:** Econométricos e simulações.

### 5.2 Avaliação e Estrutura de Capital
- **WACC:** Papel do Custo Médio Ponderado de Capital no longo prazo.
- **Fontes:** Dívida vs. Capital Próprio.
- **Alavancagem:** Financeira e Operacional para potencializar resultados.

---

## Unidade 6: Sistemas de Informação Gerencial (SIG) e Finanças

### 6.1 O Papel dos Sistemas
- **ERP:** Enterprise Resource Planning no controle financeiro.
- **BI:** Business Intelligence para dashboards e relatórios.

### 6.2 Controle de Desempenho (KPIs)
- **KPIs Financeiros:** Desenvolvimento e monitoramento.
- **BSC:** Balanced Scorecard na perspectiva financeira.
    `
  },
  {
    id: 3,
    titulo: 'Módulo III: Gestão do Capital de Giro',
    cronograma: '6-8 horas',
    texto: `
## Unidade 1: Conceitos e Estrutura do Capital de Giro

### 1.1 Definição e Importância
- **O que é:** Capital de Giro é o recurso financeiro necessário para manter a empresa operando no dia a dia.
- **Vitalidade:** Essencial para a saúde financeira, impactando diretamente o risco de insolvência e a lucratividade.

### 1.2 Componentes
- **Ativo Circulante (AC):** Caixa, Contas a Receber, Estoques.
- **Passivo Circulante (PC):** Fornecedores, Contas a Pagar, Dívidas de Curto Prazo.
- **Capital de Giro Líquido (CGL):** AC - PC.
    - *Positivo:* Folga financeira.
    - *Negativo:* Risco de liquidez.

### 1.3 A Abordagem dos Fundos
- **Capital de Giro Próprio:** CGL financiado por Longo Prazo.
- **NCG:** Necessidade de Capital de Giro.
- **Saldo de Tesouraria:** Saldo de Caixa disponível.

---

## Unidade 2: Análise dos Ciclos Operacionais e Financeiros

### 2.1 O Ciclo Operacional (CO)
- **Definição:** Tempo total desde a compra de matéria-prima até o recebimento da venda.
- **Cálculo:** Prazo Médio de Estocagem (PME) + Prazo Médio de Recebimento (PMR).

### 2.2 O Ciclo Financeiro (Ciclo de Caixa)
- **Definição:** Período em que o caixa fica "descoberto".
- **Cálculo:** Ciclo Operacional - Prazo Médio de Pagamento (PMP).
- **Gestão:** Estratégias para reduzir o Ciclo de Caixa diminuem a NCG.

### 2.3 Impacto no Planejamento
- **Crescimento:** Aumento de vendas gera aumento na NCG.
- **Sazonalidade:** Influência nas necessidades de capital ao longo do ano.

---

## Unidade 3: Políticas e Estratégias de Capital de Giro

### 3.1 Política de Investimento em Ativos Circulantes
- **Conservadora:** Alto nível de AC (muito caixa e estoque). Menor risco, menor rentabilidade.
- **Agressiva:** Baixo nível de AC. Maior risco, maior rentabilidade.
- **Moderada:** Equilíbrio entre risco e retorno.

### 3.2 Política de Financiamento (Passivos)
- **Agressiva:** Uso máximo de fontes de curto prazo.
- **Conservadora:** Uso máximo de fontes de longo prazo.

### 3.3 Trade-off Risco x Retorno
- Como as escolhas de política impactam a liquidez (capacidade de pagar) e a lucratividade da empresa.

---

## Unidade 4: Administração de Caixa e Títulos Negociáveis

### 4.1 Motivos para Manter Caixa
- **Transação:** Pagar contas do dia a dia.
- **Precaução:** Reservas para emergências.
- **Especulação:** Aproveitar oportunidades de negócio.

### 4.2 Gerenciamento do Fluxo de Caixa
- **Cash Budget:** Elaboração e projeção do Orçamento de Caixa.
- **Sincronização:** Alinhar entradas e saídas para minimizar saldos ociosos.

### 4.3 Otimização e Títulos
- **Modelos:** Baumol e Miller-Orr para definir saldo ótimo.
- **Cash Pooling:** Concentração de caixa.
- **Títulos Negociáveis:** Investimentos temporários com segurança, liquidez e rentabilidade.

---

## Unidade 5: Gestão de Contas a Receber (Crédito)

### 5.1 Política de Crédito
- **Dimensões:** Padrão de crédito (quem aprova) e Prazo de crédito.
- **Custos:** Perda por inadimplência vs. Custo de oportunidade das vendas perdidas.

### 5.2 Análise de Crédito
- **Os 5 C's:** Caráter, Capacidade, Capital, Colateral, Condições.
- **Scoring:** Uso de fontes de informação para pontuação de crédito.

### 5.3 Monitoramento e Cobrança
- **PMR:** Avaliação constante do Prazo Médio de Recebimento.
- **Antecipação:** Factoring, Forfaiting e Desconto de Duplicatas para gerar caixa imediato.

---

## Unidade 6: Administração de Estoques

### 6.1 Função e Custos
- **Tipos:** Matéria-prima, em processo, acabados.
- **Custos:** Pedido (compra), Armazenagem (manutenção) e Falta (escassez).

### 6.2 Modelos de Gestão
- **LEC (EOQ):** Lote Econômico de Compra para minimizar custos totais.
- **Ponto de Pedido:** Quando comprar novamente.
- **Estoque de Segurança:** Pulmão para incertezas.
- **Curva ABC:** Foco nos itens mais valiosos (Princípio de Pareto).

---

## Unidade 7: Administração de Passivos Circulantes

### 7.1 Gestão de Contas a Pagar
- **Fornecedores:** Papel estratégico (trade credit).
- **Descontos:** Custo implícito de não aproveitar descontos por pagamento antecipado.

### 7.2 Fontes de Financiamento
- **Bancárias:** Empréstimos, cheque especial, capital de giro.
- **Recebíveis:** Desconto de duplicatas, factoring.

### 7.3 Estrutura Ótima
- **Decisão:** Comparar custo explícito (juros) vs. custo efetivo.
- **Trade-off:** Dívida bancária vs. Crédito de fornecedores.
    `
  },
  {
    id: 4,
    titulo: 'Módulo IV: Matemática Financeira Aplicada',
    cronograma: '6-8 horas',
    texto: `
## Unidade 1: Fundamentos e Juros Simples

### 1.1 Conceitos Fundamentais
- **Valor do Dinheiro no Tempo (VDT):** Um real hoje vale mais que um real amanhã.
- **Variáveis:** Capital (P), Taxa (i), Tempo (n) e Montante (M).
- **Taxas:** Nominal, efetiva e equivalente.

### 1.2 Juros Simples
- **Fórmulas:**
    - Juros: $J = P \\cdot i \\cdot n$
    - Montante: $M = P \\cdot (1 + i \\cdot n)$
- **Aplicações:** Desconto Simples Racional (por dentro) e Comercial (por fora).
- **Equivalência:** Comparação de capitais em datas diferentes no regime simples.

---

## Unidade 2: Juros Compostos (O Regime Padrão)

### 2.1 Conceitos e Fórmulas
- **Capitalização:** Juros sobre juros (exponencial).
- **Fórmula do Montante:** $M = P \\cdot (1 + i)^n$
- **VP e VF:** Cálculo do Valor Presente e Valor Futuro.

### 2.2 Taxas de Juros
- **Equivalentes:** Cálculo de taxas equivalentes (mensal para anual, etc.).
- **Conversão:** Comparação de taxas em diferentes períodos.

### 2.3 Descontos Compostos
- **Racional Composto:** Valor Presente de um título de valor nominal conhecido.

---

## Unidade 3: Séries Uniformes de Pagamento (Anuidades)

### 3.1 Conceitos
- **Definição:** Rendas Certas ou Anuidades (séries de pagamentos).
- **Classificação:** Imediatas, Diferidas, Antecipadas e Postecipadas.

### 3.2 Cálculo de Anuidades
- **Valor Presente (VP):** Valor hoje de uma série futura.
- **Valor Futuro (VF):** Montante acumulado de depósitos regulares.
- **Prestação (PMT):** Cálculo da parcela em financiamentos.

---

## Unidade 4: Sistemas de Amortização de Empréstimos

### 4.1 Tabela Price (Sistema Francês)
- **Característica:** Prestações fixas e iguais.
- **Amortização:** Crescente ao longo do tempo.

### 4.2 Sistema SAC (Amortização Constante)
- **Característica:** Amortização fixa.
- **Prestação:** Decrescente ao longo do tempo.

### 4.3 Comparação
- **SAM:** Sistema de Amortização Misto.
- **Análise:** Comparação de custos totais para o tomador.

---

## Unidade 5: Análise de Fluxos de Caixa Não Uniformes e Decisão de Investimento

### 5.1 Fluxos de Caixa Não Uniformes
- **Cálculo:** VP e VF para fluxos irregulares.
- **Ferramentas:** Uso da HP 12C e Excel.

### 5.2 Análise de Investimentos (Orçamento de Capital)
- **VPL (Valor Presente Líquido):** Principal indicador de viabilidade.
- **TIR (Taxa Interna de Retorno):** Taxa que zera o VPL.
- **Payback Descontado:** Tempo de recuperação corrigido pelo VDT.

---

## Unidade 6: Aplicações Especiais

### 6.1 Custo Efetivo Total (CET)
- **Análise:** Inclusão de taxas, tarifas e seguros no custo do empréstimo.

### 6.2 Financiamento Imobiliário e Leasing
- **Modelagem:** Características específicas dessas operações de longo prazo.

### 6.3 Inflação e Taxa de Juros
- **Equação de Fisher:** Taxa Real vs. Taxa Nominal.
- **Impacto:** Como a inflação corrói o poder de compra dos rendimentos.
    `
  },
  {
    id: 5,
    titulo: 'Módulo V: Avaliação de Investimentos',
    cronograma: '6-8 horas',
    texto: `
## Unidade 1: Fundamentos e Conceitos Preliminares

### 1.1 O Processo de Orçamento de Capital
- **Definição:** Decisões de investimento de longo prazo que moldam o futuro da empresa.
- **Classificação:** Projetos de Reposição, Expansão, Inovação e Obrigatórios (legais/ambientais).
- **Estratégia:** A avaliação de investimentos deve estar alinhada com a estratégia corporativa.

### 1.2 O Custo de Capital e TMA
- **WACC (CMPC):** Custo Médio Ponderado de Capital. Representa o custo de oportunidade dos investidores.
- **TMA (Taxa Mínima de Atratividade):** É a taxa mínima de retorno exigida para aceitar um projeto. Geralmente, TMA = WACC.
- **Risco x Retorno:** Projetos mais arriscados exigem uma TMA maior.

---

## Unidade 2: Elaboração do Fluxo de Caixa Relevante

### 2.1 Princípios do Fluxo de Caixa Incremental
Devemos considerar apenas o que muda com a decisão.
- **Custos Afundados (Sunk Costs):** Gastos passados (ex: pesquisa anterior) são irrelevantes.
- **Custo de Oportunidade:** O valor da melhor alternativa descartada (ex: aluguel perdido de um galpão próprio) é um custo relevante.
- **Efeitos Colaterais:** Impacto (positivo ou negativo) em outros produtos da empresa (canibalização).

### 2.2 Estrutura do Fluxo de Caixa
1.  **Fluxo Inicial (FCF0):** Investimento em ativos (CAPEX) + Necessidade de Capital de Giro (NCG).
2.  **Fluxo Operacional (FCO):** Receitas - Custos - Impostos.
    - *Dica:* A Depreciação não é saída de caixa, mas reduz o imposto a pagar (**Tax Shield**). Somamos ela de volta no final.
3.  **Fluxo Terminal (FCT):** Valor de venda dos ativos ao final + Recuperação do Capital de Giro.

---

## Unidade 3: Critérios de Avaliação Determinísticos

### 3.1 Valor Presente Líquido (VPL)
O "padrão-ouro" da análise. Traz todos os fluxos futuros a valor presente e subtrai o investimento.
- **Fórmula:** $$VPL = \\sum_{t=0}^{n} \\frac{FCF_t}{(1 + TMA)^t} - Investimento$$
- **Regra:** Se VPL > 0, o projeto cria riqueza. Aceitar.
- **Exemplo:** Investimento de 100, retorno de 120 em 1 ano, TMA de 10%.
    - $VPL = \\frac{120}{(1.10)^1} - 100 = 109,09 - 100 = 9,09$. (Aceitar).

### 3.2 Taxa Interna de Retorno (TIR)
A taxa intrínseca de retorno do projeto.
- **Definição:** É a taxa que faz o VPL ser zero.
- **Regra:** Se TIR > TMA, aceitar.
- **Limitações:** Pode falhar em fluxos não convencionais (múltiplas TIRs) ou projetos mutuamente exclusivos.
- **TIRM (Modificada):** Corrige a suposição de reinvestimento da TIR tradicional.

### 3.3 Outros Indicadores
- **Payback Descontado:** Tempo para recuperar o investimento, considerando o valor do dinheiro no tempo. Mede liquidez e risco.
- **Índice de Rentabilidade (IR):** Razão entre o VP das entradas e o Investimento Inicial. Útil para racionamento de capital.

---

## Unidade 4: Análise de Risco

### 4.1 Análise de Sensibilidade
- **O que é:** Testar o impacto de mudar **uma variável por vez** (ex: preço, volume, custo) no VPL.
- **Objetivo:** Identificar as variáveis críticas que exigem maior monitoramento.

### 4.2 Análise de Cenários
- **O que é:** Avaliar o projeto em conjuntos de variáveis: Cenário Otimista, Mais Provável e Pessimista.
- **Resultado:** Calcula-se um VPL Esperado ponderado pelas probabilidades.

### 4.3 Ponto de Equilíbrio (Break-even)
- **Contábil:** Lucro Zero.
- **Financeiro:** VPL Zero. Qual o volume mínimo de vendas para não destruir valor?

### 4.4 Simulação de Monte Carlo
- Uso de software para simular milhares de cenários possíveis baseados em distribuições de probabilidade das variáveis.

---

## Unidade 5: Decisões em Situações Especiais

### 5.1 Projetos Mutuamente Exclusivos
Quando só podemos escolher um (ex: reformar máquina A ou comprar máquina B).
- **Conflito:** Se VPL e TIR derem sinais opostos, **confie sempre no VPL**, pois ele maximiza a riqueza absoluta.

### 5.2 Racionamento de Capital
Quando a empresa tem limite de orçamento para investir.
- **Solução:** Usar o Índice de Rentabilidade (IR) para escolher o pacote de projetos que maximiza o VPL total dentro do orçamento.

### 5.3 Substituição de Ativos e Opções Reais
- **Substituição:** Análise do momento ótimo de troca (custo de manutenção vs. custo de capital).
- **Opções Reais:** Valor da flexibilidade gerencial (Opção de Expandir, Adiar ou Abandonar o projeto no futuro).
    `
  },
  {
    id: 6,
    titulo: 'Módulo VI: Custo e Estrutura de Capital',
    cronograma: '6-8 horas',
    texto: `
## Unidade 1: Introdução ao Custo de Capital

### 1.1 Definição e Importância
- **Custo de Capital:** É a taxa de retorno que a empresa deve obter em seus investimentos para manter seu valor de mercado e atrair fundos.
- **TMA (Taxa Mínima de Atratividade):** O Custo de Capital serve como a TMA, ou seja, a taxa mínima que um projeto deve render para ser aceito.
- **Relação com Risco:** Quanto maior o risco do projeto ou da empresa, maior será o custo de capital exigido pelos investidores.
- **Uso no VPL:** É a taxa de desconto utilizada para trazer os fluxos de caixa futuros a valor presente.

### 1.2 Fontes Básicas de Capital
- **Capital de Terceiros (Dívida):** Empréstimos bancários, debêntures, financiamentos. Geralmente tem custo menor e prioridade no recebimento.
- **Capital Próprio:** Ações Ordinárias, Ações Preferenciais, Lucros Retidos. Tem custo maior devido ao maior risco assumido pelos sócios.

### 1.3 O Efeito dos Impostos
- **Dedutibilidade:** Os juros da dívida são dedutíveis do Imposto de Renda (em regimes como Lucro Real), o que reduz o custo efetivo da dívida. Dividendos pagos aos acionistas não são dedutíveis.

---

## Unidade 2: Custo de Cada Componente do Capital

### 2.1 Custo da Dívida (Kd)
- **Custo da Dívida (Kd):** A taxa de juros bruta cobrada pelos credores.
- **Custo Efetivo Após Imposto ($K_{d(1-T)}$):**
    - Fórmula: $K_{d(1-T)} = K_d \\cdot (1 - T)$
    - Onde $T$ é a alíquota de Imposto de Renda. O termo $(1-T)$ representa o benefício fiscal (Tax Shield).

### 2.2 Custo do Capital Próprio ($K_s$)
- **Custo dos Lucros Retidos:** O custo de oportunidade de reinvestir o lucro em vez de distribuí-lo.
    - **Modelo de Gordon:** $K_s = \\frac{D_1}{P_0} + g$ (Dividendos esperados / Preço atual + Taxa de crescimento).
    - **CAPM (Capital Asset Pricing Model):** $K_s = R_f + \\beta \\cdot (R_m - R_f)$
        - $R_f$: Taxa Livre de Risco (ex: Títulos do Tesouro).
        - $\\beta$: Beta (medida de risco sistemático da empresa).
        - $(R_m - R_f)$: Prêmio de Risco de Mercado.
- **Custo de Novas Ações ($K_n$):** Custo dos lucros retidos ajustado pelos custos de emissão (flutuação) das novas ações.

### 2.3 Custo do Capital Preferencial ($K_p$)
- Para ações preferenciais com dividendo fixo e perpétuo: $K_p = \\frac{D_p}{P_p}$ (Dividendo / Preço).

---

## Unidade 3: Custo Médio Ponderado de Capital (CMPC ou WACC)

### 3.1 Conceito de Média Ponderada
- O WACC representa a taxa média que a empresa paga por todo o seu capital (próprio e de terceiros).
- Os pesos devem ser baseados, preferencialmente, nos **valores de mercado** da dívida e das ações, não nos valores contábeis.

### 3.2 Fórmula do WACC
$$WACC = \\left( \\frac{D}{V} \\right) \\cdot K_{d(1-T)} + \\left( \\frac{E}{V} \\right) \\cdot K_s$$
- $D$: Valor de mercado da Dívida.
- $E$: Valor de mercado do Capital Próprio (Equity).
- $V$: Valor total da empresa ($D + E$).
- $\\frac{D}{V}$ e $\\frac{E}{V}$: Pesos da dívida e do capital próprio.

### 3.3 Aplicações
- **TMA da Empresa:** O WACC é a taxa correta para avaliar projetos que tenham o **mesmo risco** das operações atuais da empresa.
- **Ajustes:** Para projetos com risco diferente, o WACC deve ser ajustado para cima (maior risco) ou para baixo (menor risco).

---

## Unidade 4: Estrutura de Capital

### 4.1 Conceito e Objetivos
- **Estrutura de Capital:** A combinação de Dívida de Longo Prazo e Capital Próprio usada para financiar a empresa.
- **Objetivo:** Encontrar a **Estrutura Ótima** que minimize o WACC e, consequentemente, maximize o valor da empresa.

### 4.2 Teorias da Estrutura de Capital
- **Abordagem Tradicional:** Existe uma estrutura ótima (um ponto de mínimo para o WACC).
- **Modigliani e Miller (MM):**
    - *Sem Impostos:* A estrutura é irrelevante (o valor da empresa não muda).
    - *Com Impostos:* A estrutura ótima seria 100% dívida devido ao benefício fiscal máximo.
- **Teoria do Trade-off:** A empresa equilibra o benefício fiscal da dívida com os custos da falência (risco financeiro). A estrutura ótima ocorre quando o benefício marginal da dívida iguala o custo marginal da falência.
- **Pecking Order (Hierarquia):** Empresas preferem financiar-se primeiro com Lucros Retidos (interno), depois Dívida e, por último, Emissão de Ações (externo), para evitar assimetria de informação.

### 4.3 Fatores de Influência
- Estabilidade das vendas (mais estável = pode ter mais dívida).
- Ativos tangíveis (garantias).
- Características do setor.

---

## Unidade 5: Alavancagem e Risco

### 5.1 Alavancagem Operacional (GAO)
- Uso de **Custos Fixos Operacionais**.
- Magnifica o efeito de mudanças nas Vendas sobre o Lucro Operacional (EBIT).
- **GAO:** Variação % no EBIT / Variação % nas Vendas.

### 5.2 Alavancagem Financeira (GAF)
- Uso de **Custos Fixos Financeiros** (Juros da Dívida).
- Magnifica o efeito de mudanças no EBIT sobre o Lucro por Ação (LPA) ou ROE.
- **GAF:** Variação % no LPA / Variação % no EBIT.

### 5.3 Alavancagem Combinada (GAC)
- Efeito total dos custos fixos operacionais e financeiros.
- **GAC:** GAO $\\times$ GAF. Mostra o impacto total das vendas no lucro do acionista.

### 5.4 Análise EBIT-LPA
- Gráfico que mostra o ponto de indiferença (nível de EBIT) onde duas estruturas de capital geram o mesmo LPA. Acima desse ponto, a alavancagem financeira é benéfica; abaixo, é prejudicial.
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
  const [activeTab, setActiveTab] = useState(0);

  const units = useMemo(() => {
    if (!modulo) return [];
    // Regex to find units: ## Unidade X: Title
    // We want to capture the title and the content following it until the next unit or end of string.
    const regex = /## Unidade \d+: (.*?)\n([\s\S]*?)(?=(## Unidade|$))/g;
    const matches = [...modulo.texto.matchAll(regex)];
    
    if (matches.length === 0) {
        // Fallback if no units found, return whole text as one unit
        return [{ titulo: 'Conteúdo Completo', conteudo: modulo.texto }];
    }

    return matches.map((m, index) => ({
      id: index,
      titulo: m[1].trim(),
      conteudo: m[2]
    }));
  }, [modulo]);

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
      <div className="w-full max-w-7xl mb-6">
        <Link to="/" className="text-blue-300 hover:text-blue-100 flex items-center gap-2 font-semibold">
          <FaArrowLeft /> Voltar aos módulos
        </Link>
      </div>

      {/* Header do Módulo */}
      <div className="w-full max-w-7xl bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-10 mb-10 text-white relative overflow-hidden">
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

      {/* Tabs Navigation */}
      {units.length > 1 && (
        <div className="w-full max-w-7xl mb-8 flex flex-wrap gap-2">
            {units.map((unit, index) => (
                <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        activeTab === index
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                    }`}
                >
                    Unidade {index + 1}
                </button>
            ))}
        </div>
      )}

      {/* Conteúdo do Módulo */}
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl p-12 mb-8 border border-gray-100">
        {units.length > 0 && (
            <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-blue-900">
                    {units[activeTab].titulo}
                </h2>
            </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700">
          {(units.length > 0 ? units[activeTab].conteudo : modulo.texto).split('\n').map((linha, idx) => {
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
          style={{ maxHeight: 400, width: '100%', objectFit: 'cover' }}
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
      <div className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaBook /> Teste Seu Conhecimento
        </h2>
        <QuizModulo moduloId={modulo.id} />
      </div>
    </div>
  );
}

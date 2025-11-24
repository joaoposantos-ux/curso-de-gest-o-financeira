import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChartLine, FaTrophy } from 'react-icons/fa';

// Quizzes expandidas com muito mais questões por módulo
const quizzes = {
  1: [
    {
      pergunta: 'Qual é o objetivo primário da Administração Financeira?',
      opcoes: [
        'Maximizar o lucro contábil de curto prazo',
        'Maximizar a riqueza dos acionistas (valor da empresa)',
        'Minimizar o pagamento de impostos',
        'Maximizar o número de funcionários'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que a Teoria da Agência e a Governança Corporativa buscam resolver?',
      opcoes: [
        'A falta de dinheiro no caixa',
        'Os conflitos de interesse entre acionistas (proprietários) e gestores (agentes)',
        'A alta carga tributária',
        'A concorrência desleal'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual mercado é responsável pela negociação de títulos de longo prazo (ações e debêntures)?',
      opcoes: [
        'Mercado Monetário',
        'Mercado de Crédito',
        'Mercado de Capitais',
        'Mercado Cambial'
      ],
      resposta: 2
    },
    {
      pergunta: 'O que caracteriza a Decisão de Investimento (Orçamento de Capital)?',
      opcoes: [
        'Escolher onde alocar recursos em ativos para obter retorno futuro',
        'Definir de onde captar recursos',
        'Decidir o nível de estoque',
        'Calcular o imposto de renda'
      ],
      resposta: 0
    },
    {
      pergunta: 'Qual a função dos Agentes Superavitários no SFN?',
      opcoes: [
        'Tomar dinheiro emprestado',
        'Fornecer recursos (poupança) para o sistema',
        'Regular os bancos',
        'Emitir moeda'
      ],
      resposta: 1
    }
  ],
  2: [
    {
      pergunta: 'Qual é considerada a base fundamental para todo o planejamento financeiro?',
      opcoes: [
        'A Previsão de Vendas',
        'O Orçamento de Produção',
        'O Balanço Patrimonial do ano anterior',
        'A contratação de novos funcionários'
      ],
      resposta: 0
    },
    {
      pergunta: 'Qual a principal diferença entre Orçamento Operacional e Orçamento de Capital?',
      opcoes: [
        'O Operacional foca no curto prazo (DRE) e o de Capital em investimentos de longo prazo',
        'O Operacional é feito pelos bancos e o de Capital pelos sócios',
        'O de Capital não envolve dinheiro',
        'Não há diferença, são sinônimos'
      ],
      resposta: 0
    },
    {
      pergunta: 'O que representa o Ciclo Financeiro (Ciclo de Caixa)?',
      opcoes: [
        'O tempo total de produção',
        'O período entre o pagamento aos fornecedores e o recebimento das vendas',
        'O tempo que o dinheiro fica no banco rendendo juros',
        'O prazo de validade dos produtos'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual é o objetivo da Análise de Variâncias no Controle Financeiro?',
      opcoes: [
        'Calcular o imposto de renda devido',
        'Identificar e mensurar as diferenças entre o resultado orçado e o realizado',
        'Demitir funcionários improdutivos',
        'Aumentar o preço dos produtos'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que o WACC (Custo Médio Ponderado de Capital) indica?',
      opcoes: [
        'O lucro total da empresa',
        'A taxa mínima de retorno que a empresa deve gerar para criar valor',
        'O valor total da dívida bancária',
        'O salário do diretor financeiro'
      ],
      resposta: 1
    }
  ],
  3: [
    {
      pergunta: 'Como é calculado o Capital de Giro Líquido (CGL)?',
      opcoes: [
        'Ativo Não Circulante - Passivo Não Circulante',
        'Ativo Circulante - Passivo Circulante',
        'Lucro Líquido + Depreciação',
        'Caixa + Estoques'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que define o Ciclo Financeiro (Ciclo de Caixa)?',
      opcoes: [
        'Ciclo Operacional - Prazo Médio de Pagamento (PMP)',
        'Prazo Médio de Estocagem + Prazo Médio de Recebimento',
        'O tempo total de fabricação do produto',
        'O prazo de validade dos estoques'
      ],
      resposta: 0
    },
    {
      pergunta: 'O que caracteriza uma Política Conservadora de Investimento em Ativos Circulantes?',
      opcoes: [
        'Manter níveis baixos de caixa e estoques para maximizar rentabilidade',
        'Manter níveis altos de Ativo Circulante (muito caixa e estoque) para reduzir risco',
        'Investir apenas em ativos fixos',
        'Não conceder crédito aos clientes'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual o objetivo do modelo de Lote Econômico de Compra (LEC/EOQ)?',
      opcoes: [
        'Comprar o máximo possível para ganhar descontos',
        'Minimizar os custos totais de pedido e armazenagem',
        'Zerar o estoque da empresa',
        'Aumentar o preço de venda'
      ],
      resposta: 1
    },
    {
      pergunta: 'Quais são os 5 Cs do Crédito?',
      opcoes: [
        'Carro, Casa, Comida, Computador, Celular',
        'Caráter, Capacidade, Capital, Colateral, Condições',
        'Custo, Caixa, Controle, Cobrança, Cliente',
        'Capital, Crédito, Confiança, Cadastro, Consulta'
      ],
      resposta: 1
    }
  ],
  4: [
    {
      pergunta: 'Qual a fórmula básica para calcular o Montante em Juros Simples?',
      opcoes: [
        'M = P * (1 + i)^n',
        'M = P * (1 + i * n)',
        'M = P * i * n',
        'M = P / (1 + i)'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que caracteriza o Sistema de Amortização Constante (SAC)?',
      opcoes: [
        'Prestações fixas e iguais do início ao fim',
        'Amortização fixa mensal e prestações decrescentes',
        'Pagamento único no final',
        'Juros calculados sobre o valor original da dívida'
      ],
      resposta: 1
    },
    {
      pergunta: 'Para que serve o Valor Presente Líquido (VPL) na análise de investimentos?',
      opcoes: [
        'Para calcular o imposto de renda',
        'Para determinar se um projeto cria valor (riqueza) hoje',
        'Para saber quanto tempo leva para recuperar o investimento',
        'Para calcular a taxa de juros do banco'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que é o Custo Efetivo Total (CET) de um empréstimo?',
      opcoes: [
        'Apenas a taxa de juros nominal',
        'A soma de juros, taxas, tarifas, seguros e outras despesas cobradas na operação',
        'O valor total da dívida sem juros',
        'O lucro do banco'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual a relação entre Taxa Nominal, Taxa Real e Inflação (Equação de Fisher)?',
      opcoes: [
        'Taxa Real = Taxa Nominal + Inflação',
        '(1 + Taxa Nominal) = (1 + Taxa Real) * (1 + Inflação)',
        'Taxa Nominal é sempre menor que a Taxa Real',
        'A inflação não afeta o ganho real'
      ],
      resposta: 1
    }
  ],
  5: [
    {
      pergunta: 'O que são "Sunk Costs" (Custos Afundados) na análise de investimentos?',
      opcoes: [
        'Custos de manutenção de navios',
        'Gastos passados já incorridos que não se recuperam e devem ser ignorados na decisão',
        'Custos futuros de oportunidade',
        'Investimentos em capital de giro'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual é a regra de decisão fundamental do Valor Presente Líquido (VPL)?',
      opcoes: [
        'Aceitar se VPL > 0 (cria riqueza)',
        'Aceitar se VPL < 0 (custa menos)',
        'Aceitar se VPL for igual à TIR',
        'Aceitar qualquer projeto com lucro contábil'
      ],
      resposta: 0
    },
    {
      pergunta: 'Em caso de conflito entre VPL e TIR em projetos mutuamente exclusivos, qual critério deve prevalecer?',
      opcoes: [
        'A TIR, pois é uma porcentagem',
        'O VPL, pois mede a riqueza absoluta adicionada aos acionistas',
        'O Payback, pois é mais rápido',
        'A intuição do gestor'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que o Payback Descontado considera que o Payback Simples ignora?',
      opcoes: [
        'O valor do dinheiro no tempo (taxa de desconto)',
        'O imposto de renda',
        'A depreciação',
        'O custo dos funcionários'
      ],
      resposta: 0
    },
    {
      pergunta: 'Para que serve a Análise de Cenários?',
      opcoes: [
        'Para prever o futuro com 100% de certeza',
        'Para avaliar o projeto sob diferentes conjuntos de premissas (Otimista, Base, Pessimista)',
        'Para calcular o imposto devido',
        'Para escolher os fornecedores'
      ],
      resposta: 1
    }
  ],
  6: [
    {
      pergunta: 'Qual é a principal função do Custo de Capital na análise de investimentos?',
      opcoes: [
        'Determinar o lucro líquido contábil',
        'Servir como Taxa Mínima de Atratividade (TMA) para descontar fluxos de caixa (VPL)',
        'Calcular o imposto de renda a pagar',
        'Definir o preço de venda dos produtos'
      ],
      resposta: 1
    },
    {
      pergunta: 'Como o Imposto de Renda afeta o Custo da Dívida?',
      opcoes: [
        'Aumenta o custo, pois impostos são despesas',
        'Não afeta, pois juros não são tributáveis',
        'Reduz o custo efetivo, pois os juros são dedutíveis (Benefício Fiscal)',
        'Torna a dívida igual ao capital próprio'
      ],
      resposta: 2
    },
    {
      pergunta: 'O que representa o Beta (β) no modelo CAPM?',
      opcoes: [
        'A taxa livre de risco',
        'O risco sistemático da empresa em relação ao mercado',
        'O crescimento dos dividendos',
        'O valor da dívida'
      ],
      resposta: 1
    },
    {
      pergunta: 'Segundo a Teoria do Trade-off, o que define a Estrutura de Capital Ótima?',
      opcoes: [
        'O uso de 100% de capital próprio para evitar riscos',
        'O equilíbrio entre o benefício fiscal da dívida e os custos de falência',
        'A preferência por lucros retidos (Pecking Order)',
        'A irrelevância da estrutura de capital'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que a Alavancagem Operacional (GAO) mede?',
      opcoes: [
        'O impacto da dívida no lucro por ação',
        'O impacto dos custos fixos operacionais na sensibilidade do EBIT às vendas',
        'O custo médio ponderado de capital',
        'A liquidez corrente da empresa'
      ],
      resposta: 1
    }
  ]
};

export default function QuizModulo({ moduloId, onFinish }) {
  const perguntas = quizzes[moduloId] || [];
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [finalizado, setFinalizado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [respostas, setRespostas] = useState([]);
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = import.meta.env.VITE_API_URL;

  const progresso = Math.round(((indice) / perguntas.length) * 100);
  const percentualAcertos = perguntas.length > 0 ? Math.round((acertos / perguntas.length) * 100) : 0;

  async function salvarProgresso(acertosFinais) {
    if (!usuario) {
      console.error('Usuário não encontrado no localStorage');
      return;
    }
    
    setSalvando(true);
    const urlApi = `${API_URL}/quiz/progresso`;
    const dados = {
      usuario_id: usuario.id,
      modulo_id: moduloId,
      acertos: acertosFinais,
      total: perguntas.length
    };
    
    console.log('Salvando progresso:', { urlApi, dados });
    
    try {
      const response = await fetch(urlApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Progresso salvo com sucesso:', result);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      alert('Erro ao salvar progresso. Verifique a conexão com o servidor.');
    }
    setSalvando(false);
  }

  function responder(indiceOpcao) {
    setRespostaSelecionada(indiceOpcao);
    const acertou = indiceOpcao === perguntas[indice].resposta;
    const novoAcertos = acertos + (acertou ? 1 : 0);
    
    setRespostas([...respostas, {
      pergunta: indice + 1,
      selecionada: indiceOpcao,
      correta: perguntas[indice].resposta,
      acertou
    }]);
    
    if (acertou) setAcertos(novoAcertos);
    
    setTimeout(() => {
      if (indice + 1 < perguntas.length) {
        setIndice(indice + 1);
        setRespostaSelecionada(null);
      } else {
        setFinalizado(true);
        salvarProgresso(novoAcertos);
        if (onFinish) onFinish(novoAcertos);
      }
    }, 900);
  }

  if (perguntas.length === 0) {
    return <div className="p-4 text-gray-600">Nenhum quiz disponível para este módulo.</div>;
  }

  if (finalizado) {
    const aprovado = percentualAcertos >= 70;
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-6">
        <div className="text-center mb-6">
          {aprovado ? (
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-6xl text-green-500" />
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <FaTimesCircle className="text-6xl text-orange-500" />
            </div>
          )}
          <h2 className={`text-2xl font-bold mb-2 ${aprovado ? 'text-green-700' : 'text-orange-700'}`}>
            {aprovado ? '✓ Parabéns!' : 'Continue Estudando'}
          </h2>
          <p className="text-gray-700 mb-4">
            {aprovado 
              ? 'Você foi aprovado neste módulo!' 
              : 'Você precisa de 70% para aprovação. Tente novamente!'}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600 mb-1">Acertos</div>
              <div className="text-3xl font-bold text-green-600">{acertos}</div>
              <div className="text-xs text-gray-500">de {perguntas.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Percentual</div>
              <div className="text-3xl font-bold text-blue-600">{percentualAcertos}%</div>
              <div className="text-xs text-gray-500">Taxa de acerto</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <div className={`text-2xl font-bold ${aprovado ? 'text-green-600' : 'text-orange-600'}`}>
                {aprovado ? '✓' : 'Repetir'}
              </div>
              <div className="text-xs text-gray-500">{aprovado ? 'Aprovado' : 'Repetir'}</div>
            </div>
          </div>
        </div>

        {salvando && (
          <div className="text-center text-blue-600 mb-4 flex items-center justify-center gap-2">
            <FaChartLine className="animate-spin" /> Salvando progresso...
          </div>
        )}

        <div className="space-y-2 mb-6">
          <button 
            className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition"
            onClick={() => window.location.reload()}
          >
            Refazer Quiz
          </button>
          <button 
            className="w-full px-4 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold transition"
            onClick={() => window.history.back()}
          >
            Voltar aos Módulos
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          {salvando ? '...' : 'Seu progresso foi salvo e aparecerá em "Área do Aluno"'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progresso do Quiz</span>
          <span className="text-sm font-bold text-blue-600">{indice + 1} de {perguntas.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-6 text-gray-800">{perguntas[indice].pergunta}</h2>

      <div className="space-y-3">
        {perguntas[indice].opcoes.map((opcao, i) => {
          let bgColor = 'bg-blue-50 hover:bg-blue-100 border-blue-200';
          
          if (respostaSelecionada !== null) {
            if (i === perguntas[indice].resposta) {
              bgColor = 'bg-green-100 border-green-400';
            } else if (respostaSelecionada === i && respostaSelecionada !== perguntas[indice].resposta) {
              bgColor = 'bg-red-100 border-red-400';
            } else {
              bgColor = 'bg-gray-100 border-gray-200';
            }
          }

          return (
            <button
              key={i}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${bgColor} ${
                respostaSelecionada === null ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              disabled={respostaSelecionada !== null}
              onClick={() => responder(i)}
            >
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  respostaSelecionada === i 
                    ? i === perguntas[indice].resposta ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500'
                    : respostaSelecionada === null ? 'border-gray-300' : 'border-gray-300'
                }`}>
                  {respostaSelecionada !== null && i === perguntas[indice].resposta && (
                    <FaCheckCircle className="text-white text-xs" />
                  )}
                </div>
                <span className="font-medium text-gray-800">{opcao}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

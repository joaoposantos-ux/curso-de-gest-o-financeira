import React, { useState } from 'react';

// Exemplo de perguntas para cada módulo (pode ser expandido depois)
const quizzes = {
  1: [
    {
      pergunta: 'O que é gestão financeira?',
      opcoes: [
        'A administração dos recursos financeiros de uma organização',
        'A gestão de pessoas',
        'A análise de marketing',
        'A produção industrial'
      ],
      resposta: 0
    },
    {
      pergunta: 'Qual o principal objetivo da gestão financeira?',
      opcoes: [
        'Maximizar o lucro a qualquer custo',
        'Garantir a saúde financeira e sustentabilidade do negócio',
        'Reduzir o número de funcionários',
        'Aumentar o estoque'
      ],
      resposta: 1
    },
    {
      pergunta: 'Gestão financeira é importante para:',
      opcoes: [
        'Apenas grandes empresas',
        'Qualquer pessoa ou organização',
        'Somente bancos',
        'Apenas o governo'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que compõe o ciclo financeiro?',
      opcoes: [
        'Receitas, despesas e investimentos',
        'Apenas receitas',
        'Somente despesas',
        'Apenas investimentos'
      ],
      resposta: 0
    },
    {
      pergunta: 'Qual destes NÃO é um objetivo da gestão financeira?',
      opcoes: [
        'Maximizar o valor da empresa',
        'Reduzir riscos financeiros',
        'Ignorar o fluxo de caixa',
        'Buscar rentabilidade'
      ],
      resposta: 2
    },
    {
      pergunta: 'O controle financeiro ajuda a:',
      opcoes: [
        'Evitar desperdícios e melhorar decisões',
        'Aumentar gastos sem controle',
        'Ignorar receitas',
        'Reduzir lucros'
      ],
      resposta: 0
    },
    {
      pergunta: 'O que é orçamento?',
      opcoes: [
        'Planejamento das receitas e despesas futuras',
        'Relatório de vendas',
        'Lista de funcionários',
        'Plano de marketing'
      ],
      resposta: 0
    },
    {
      pergunta: 'A gestão financeira pessoal envolve:',
      opcoes: [
        'Apenas empresas',
        'Qualquer pessoa que administra seu dinheiro',
        'Somente bancos',
        'Apenas investidores profissionais'
      ],
      resposta: 1
    },
    {
      pergunta: 'O que é fluxo de caixa?',
      opcoes: [
        'Controle das entradas e saídas de dinheiro',
        'Controle de estoque',
        'Gestão de pessoas',
        'Planejamento de marketing'
      ],
      resposta: 0
    },
    {
      pergunta: 'A gestão financeira eficiente resulta em:',
      opcoes: [
        'Maior sustentabilidade e crescimento',
        'Mais dívidas',
        'Desorganização financeira',
        'Menor controle dos recursos'
      ],
      resposta: 0
    }
  ],
  2: [
    {
      pergunta: 'O que é planejamento financeiro?',
      opcoes: [
        'Definir metas e estratégias para o uso dos recursos financeiros',
        'Contratar novos funcionários',
        'Comprar equipamentos',
        'Aumentar o preço dos produtos'
      ],
      resposta: 0
    },
    {
      pergunta: 'O controle financeiro serve para:',
      opcoes: [
        'Monitorar receitas e despesas',
        'Aumentar o endividamento',
        'Reduzir a produção',
        'Contratar fornecedores'
      ],
      resposta: 0
    }
  ],
  3: [
    {
      pergunta: 'O que é um balanço patrimonial?',
      opcoes: [
        'Demonstração da posição financeira da empresa em determinado momento',
        'Relatório de vendas',
        'Plano de marketing',
        'Lista de funcionários'
      ],
      resposta: 0
    },
    {
      pergunta: 'A DRE (Demonstração do Resultado do Exercício) mostra:',
      opcoes: [
        'O resultado líquido de um período',
        'O estoque de mercadorias',
        'A folha de pagamento',
        'O fluxo de caixa futuro'
      ],
      resposta: 0
    }
  ],
  4: [
    {
      pergunta: 'O que é fluxo de caixa?',
      opcoes: [
        'Controle das entradas e saídas de dinheiro',
        'Controle de estoque',
        'Gestão de pessoas',
        'Planejamento de marketing'
      ],
      resposta: 0
    },
    {
      pergunta: 'Capital de giro é:',
      opcoes: [
        'Recursos necessários para manter as operações do dia a dia',
        'Investimento em imóveis',
        'Compra de máquinas',
        'Pagamento de impostos'
      ],
      resposta: 0
    }
  ],
  5: [
    {
      pergunta: 'Fontes de financiamento podem ser:',
      opcoes: [
        'Próprias ou de terceiros',
        'Apenas empréstimos bancários',
        'Somente capital próprio',
        'Apenas vendas a prazo'
      ],
      resposta: 0
    },
    {
      pergunta: 'Investimento é:',
      opcoes: [
        'Aplicação de recursos visando retorno futuro',
        'Pagamento de dívidas',
        'Compra de estoque',
        'Redução de custos'
      ],
      resposta: 0
    }
  ],
  6: [
    {
      pergunta: 'Indicadores financeiros servem para:',
      opcoes: [
        'Avaliar o desempenho financeiro da empresa',
        'Contratar funcionários',
        'Planejar marketing',
        'Aumentar o estoque'
      ],
      resposta: 0
    },
    {
      pergunta: 'Um exemplo de indicador de desempenho é:',
      opcoes: [
        'Liquidez corrente',
        'Número de funcionários',
        'Quantidade de produtos',
        'Área construída'
      ],
      resposta: 0
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
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = import.meta.env.VITE_API_URL;

  const progresso = Math.round(((indice) / perguntas.length) * 100);

  async function salvarProgresso(acertosFinais) {
    if (!usuario) return;
    setSalvando(true);
    await fetch(`${API_URL}/quiz/progresso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id: usuario.id,
        modulo_id: moduloId,
        acertos: acertosFinais,
        total: perguntas.length
      })
    });
    setSalvando(false);
  }

  function responder(indiceOpcao) {
    setRespostaSelecionada(indiceOpcao);
    const acertou = indiceOpcao === perguntas[indice].resposta;
    const novoAcertos = acertos + (acertou ? 1 : 0);
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
    return <div className="p-4">Nenhum quiz disponível para este módulo.</div>;
  }

  if (finalizado) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Quiz finalizado!</h2>
        <p className="text-lg">Você acertou {acertos} de {perguntas.length} perguntas.</p>
        {salvando && <div className="text-blue-600 mt-2">Salvando progresso...</div>}
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => window.location.reload()}>Refazer Quiz</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-6">
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Progresso do Quiz</div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progresso}%` }}></div>
        </div>
        <div className="text-right text-xs text-gray-500 mt-1">{indice + 1} / {perguntas.length}</div>
      </div>
      <h2 className="text-lg font-semibold mb-4">{perguntas[indice].pergunta}</h2>
      <div className="space-y-2">
        {perguntas[indice].opcoes.map((opcao, i) => (
          <button
            key={i}
            className={`w-full text-left px-4 py-2 rounded border transition focus:outline-none ${respostaSelecionada === null ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' : i === perguntas[indice].resposta ? 'bg-green-100 border-green-400' : respostaSelecionada === i ? 'bg-red-100 border-red-400' : 'bg-gray-100 border-gray-200'}`}
            disabled={respostaSelecionada !== null}
            onClick={() => responder(i)}
          >
            {opcao}
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChartLine, FaTrophy } from 'react-icons/fa';

// Quizzes expandidas com muito mais questões por módulo
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
    },
    {
      pergunta: 'Qual é a relação fundamental da contabilidade?',
      opcoes: [
        'Ativo = Passivo + Patrimônio Líquido',
        'Receita = Despesa',
        'Lucro = Ativo - Passivo',
        'Capital = Ativo × 2'
      ],
      resposta: 0
    },
    {
      pergunta: 'O que significa "sustentabilidade financeira"?',
      opcoes: [
        'Ter lucros infinitos',
        'Capacidade de manter operações e crescer sem quebrar',
        'Não gastar dinheiro',
        'Ter apenas receitas'
      ],
      resposta: 1
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
    },
    {
      pergunta: 'Qual é a primeira etapa do planejamento financeiro?',
      opcoes: [
        'Comprar ativos',
        'Diagnóstico da situação atual',
        'Pedir empréstimo',
        'Aumentar vendas'
      ],
      resposta: 1
    },
    {
      pergunta: 'Objetivos financeiros de curto prazo são aqueles com:',
      opcoes: [
        'Mais de 10 anos',
        'Entre 5 e 10 anos',
        'Até 1 ano',
        'Nunca alcançáveis'
      ],
      resposta: 2
    },
    {
      pergunta: 'Um orçamento bem elaborado deve:',
      opcoes: [
        'Ser fixo e nunca mudar',
        'Ser revisado regularmente conforme necessário',
        'Servir apenas para demonstrar resultados',
        'Ser totalmente realista sem margem de segurança'
      ],
      resposta: 1
    },
    {
      pergunta: 'A folga orçamentária (buffer) em um orçamento:',
      opcoes: [
        'É uma fraqueza do gestor',
        'Protege contra imprevistos e variações',
        'Significa que o orçamento está errado',
        'Aumenta custos desnecessariamente'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual ferramenta é essencial para o controle financeiro?',
      opcoes: [
        'Apenas calculadora manual',
        'Relatórios e indicadores de desempenho',
        'Nenhuma, controle é apenas mental',
        'Apenas sistemas muito caros'
      ],
      resposta: 1
    },
    {
      pergunta: 'Uma variação orçamentária positiva significa:',
      opcoes: [
        'Sempre é bom',
        'Resultado melhor do que esperado em receita ou menor em despesa',
        'Sempre é ruim',
        'Que o orçamento estava errado'
      ],
      resposta: 1
    },
    {
      pergunta: 'O orçamento operacional foca em:',
      opcoes: [
        'Compra de imóveis',
        'Receitas e despesas do dia a dia da operação',
        'Apenas salários',
        'Investimentos em ações'
      ],
      resposta: 1
    },
    {
      pergunta: 'A reconciliação bancária é importante para:',
      opcoes: [
        'Gastar mais dinheiro',
        'Comparar registros com extratos para verificar erros',
        'Aumentar juros',
        'Reduzir funcionários'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual é um indicador importante de controle?',
      opcoes: [
        'Cor do escritório',
        'Taxa de variação entre orçado e realizado',
        'Número de funcionários',
        'Marca do computador'
      ],
      resposta: 1
    },
    {
      pergunta: 'A separação de responsabilidades em finanças:',
      opcoes: [
        'É desnecessária em empresas pequenas',
        'Reduz fraudes e erros tendo pessoas diferentes para aprovar e executar',
        'Torna tudo mais lento',
        'Aumenta custos muito'
      ],
      resposta: 1
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
    },
    {
      pergunta: 'No balanço patrimonial, o Ativo representa:',
      opcoes: [
        'O que a empresa deve',
        'O que a empresa possui',
        'Apenas dinheiro em caixa',
        'Os funcionários'
      ],
      resposta: 1
    },
    {
      pergunta: 'O Passivo no balanço patrimonial é:',
      opcoes: [
        'O que a empresa possui',
        'O que a empresa deve (obrigações)',
        'Apenas lucro',
        'Apenas estoque'
      ],
      resposta: 1
    },
    {
      pergunta: 'O Patrimônio Líquido é calculado por:',
      opcoes: [
        'Ativo + Passivo',
        'Ativo - Passivo',
        'Receita - Despesa',
        'Lucro + Investimento'
      ],
      resposta: 1
    },
    {
      pergunta: 'Ativo Circulante inclui:',
      opcoes: [
        'Apenas imóveis',
        'Recursos que se convertem em dinheiro até 1 ano (caixa, clientes)',
        'Apenas dívidas',
        'Máquinas de longo prazo'
      ],
      resposta: 1
    },
    {
      pergunta: 'A Análise Horizontal dos demonstrativos:',
      opcoes: [
        'Compara itens em um período',
        'Compara evolução ao longo de vários períodos (tendência)',
        'Sempre mostra crescimento',
        'Não serve para nada'
      ],
      resposta: 1
    },
    {
      pergunta: 'A Análise Vertical dos demonstrativos:',
      opcoes: [
        'Compara períodos diferentes',
        'Mostra proporção de cada item em relação ao total',
        'Mostra tendência',
        'Identifica problemas estruturais sempre'
      ],
      resposta: 1
    },
    {
      pergunta: 'Depreciation (Depreciação) é:',
      opcoes: [
        'Ganho extraordinário',
        'Redução do valor de um ativo ao longo do tempo',
        'Aumento de dívida',
        'Rendimento do investimento'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual setor utiliza mais análise de demonstrativos?',
      opcoes: [
        'Apenas construção',
        'Investidores, credores, gestores e reguladores',
        'Nenhum setor precisa',
        'Apenas bancos'
      ],
      resposta: 1
    },
    {
      pergunta: 'Uma empresa com Ativo > Passivo tem:',
      opcoes: [
        'Patrimônio Líquido negativo',
        'Patrimônio Líquido positivo',
        'Que quebrar obrigatoriamente',
        'Que crescer sempre'
      ],
      resposta: 1
    },
    {
      pergunta: 'O EBIT significa:',
      opcoes: [
        'Lucro após impostos',
        'Lucro operacional antes de impostos',
        'Especulação de mercado',
        'Endividamento total'
      ],
      resposta: 1
    }
  ],
  4: [
    {
      pergunta: 'O que é fluxo de caixa?',
      opcoes: [
        'Controle de estoque',
        'Controle das entradas e saídas de dinheiro',
        'Gestão de pessoas',
        'Planejamento de marketing'
      ],
      resposta: 1
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
    },
    {
      pergunta: 'Por que fluxo de caixa é crítico?',
      opcoes: [
        'Porque são números grandes',
        'Uma empresa pode ser lucrável mas quebrar sem caixa',
        'Apenas para auditoria',
        'Não é realmente importante'
      ],
      resposta: 1
    },
    {
      pergunta: 'O ciclo operacional inclui:',
      opcoes: [
        'Apenas compra de matéria-prima',
        'Compra, produção, venda até recebimento',
        'Apenas pagamento de contas',
        'Nenhum desses'
      ],
      resposta: 1
    },
    {
      pergunta: 'Se o ciclo financeiro é 60 dias, significa:',
      opcoes: [
        'A empresa recebe 60 dias após vender',
        'A empresa precisa financiar 60 dias entre pagamento e recebimento',
        'Sempre é problema',
        'Não significa nada'
      ],
      resposta: 1
    },
    {
      pergunta: 'Para reduzir a necessidade de capital de giro:',
      opcoes: [
        'Aumentar prazo de fornecedor',
        'Acelerar recebimentos',
        'Reduzir estoque',
        'Todas as alternativas acima'
      ],
      resposta: 3
    },
    {
      pergunta: 'O método direto para fluxo de caixa:',
      opcoes: [
        'Baseia-se em movimentações reais de caixa',
        'Parte do lucro líquido',
        'É mais complexo',
        'Não existe'
      ],
      resposta: 0
    },
    {
      pergunta: 'Um aumento em contas a receber significa:',
      opcoes: [
        'Mais dinheiro em caixa',
        'Menos caixa (dinheiro preso em créditos)',
        'Sempre positivo',
        'Não afeta caixa'
      ],
      resposta: 1
    },
    {
      pergunta: 'Just-in-time em gestão de estoque:',
      opcoes: [
        'Compra tudo no começo do período',
        'Recebe matéria-prima apenas quando necessário',
        'Não reduz necessidade de capital',
        'É muito caro'
      ],
      resposta: 1
    },
    {
      pergunta: 'Um saldo de caixa negativo significa:',
      opcoes: [
        'Lucro negativo',
        'Mais dinheiro saiu do que entrou (descoberto bancário)',
        'Sempre é bom',
        'Não tem consequência'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual atividade gera fluxo positivo?',
      opcoes: [
        'Emprestar dinheiro para pessoas',
        'Recebimento de clientes',
        'Pagar fornecedores',
        'Pagar aluguel'
      ],
      resposta: 1
    },
    {
      pergunta: 'Sazonalidade em fluxo de caixa significa:',
      opcoes: [
        'Sempre uniforme',
        'Variações conforme período do ano',
        'Impossível prever',
        'Não existe'
      ],
      resposta: 1
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
        'Pagamento de dívidas',
        'Compra de estoque',
        'Aplicação de recursos visando retorno futuro',
        'Redução de custos'
      ],
      resposta: 2
    },
    {
      pergunta: 'Capital Social é:',
      opcoes: [
        'Custo de operação',
        'Investimento inicial dos proprietários',
        'Empréstimo bancário',
        'Lucro retido'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual é a vantagem de usar capital próprio?',
      opcoes: [
        'Sem custo de juros',
        'Dilui a propriedade da empresa',
        'Reduz risco dos acionistas',
        'Aumenta dívidas'
      ],
      resposta: 0
    },
    {
      pergunta: 'Debêntures são:',
      opcoes: [
        'Títulos de patrimônio',
        'Produtos bancários',
        'Títulos de dívida emitidos pela empresa',
        'Ações da empresa'
      ],
      resposta: 2
    },
    {
      pergunta: 'Leasing é melhor que compra quando:',
      opcoes: [
        'Nunca é melhor',
        'Sempre é pior',
        'Se há necessidade de flexibilidade e mudança frequente',
        'Não existe essa comparação'
      ],
      resposta: 2
    },
    {
      pergunta: 'Payback é:',
      opcoes: [
        'Lucro total do investimento',
        'Tempo para recuperar investimento inicial',
        'Retorno em percentual',
        'Risco do investimento'
      ],
      resposta: 1
    },
    {
      pergunta: 'TIR (Taxa Interna de Retorno) é usada para:',
      opcoes: [
        'Calcular estoque',
        'Comparar investimentos com custo de capital',
        'Apenas em bancos',
        'Não serve para nada'
      ],
      resposta: 1
    },
    {
      pergunta: 'VPL (Valor Presente Líquido) > 0 significa:',
      opcoes: [
        'Investimento destrói valor',
        'Investimento agrega valor',
        'Sempre é ruim',
        'Indiferente'
      ],
      resposta: 1
    },
    {
      pergunta: 'Qual custo é menor normalmente?',
      opcoes: [
        'Capital de terceiros (taxa de juros)',
        'Capital próprio',
        'Sempre igual',
        'Não há diferença'
      ],
      resposta: 0
    },
    {
      pergunta: 'Diversificação de investimentos significa:',
      opcoes: [
        'Colocar tudo em um ativo',
        'Distribuir em vários ativos para reduzir risco',
        'Não investir',
        'Apenas em ações'
      ],
      resposta: 1
    },
    {
      pergunta: 'Renda fixa é caracterizada por:',
      opcoes: [
        'Alto risco',
        'Retorno definido e previsível',
        'Altíssimo retorno',
        'Impossível saber retorno'
      ],
      resposta: 1
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
      pergunta: 'Liquidez Corrente é:',
      opcoes: [
        'Ativo Total / Passivo Total',
        'Ativo Circulante / Passivo Circulante',
        'Caixa / Obrigações',
        'Lucro / Receita'
      ],
      resposta: 1
    },
    {
      pergunta: 'Uma Liquidez Corrente de 1,5 significa:',
      opcoes: [
        'Problema grave',
        'R$ 1,50 de ativo para cada R$ 1 de obrigação de curto prazo',
        'Muito baixo',
        'Impossível de interpretar'
      ],
      resposta: 1
    },
    {
      pergunta: 'Margem de Lucro Líquida mede:',
      opcoes: [
        'Quantas vezes o estoque se renova',
        'Qual percentual da venda vira lucro',
        'Quanto tempo leva receber',
        'Capacidade de pagar contas'
      ],
      resposta: 1
    },
    {
      pergunta: 'ROE (Rentabilidade do Patrimônio) é importante porque:',
      opcoes: [
        'Mostra custo operacional',
        'Mostra retorno para proprietários',
        'Calcula juros',
        'Não é importante'
      ],
      resposta: 1
    },
    {
      pergunta: 'Endividamento alto pode significar:',
      opcoes: [
        'Sempre problema',
        'Risco e alavanca de retorno, depende do contexto',
        'Sempre excelente',
        'Não afeta nada'
      ],
      resposta: 1
    },
    {
      pergunta: 'Giro do Ativo mostra:',
      opcoes: [
        'Lucro total',
        'Quantas vezes o ativo se "vira" em vendas',
        'Quanto custa operação',
        'Nada relevante'
      ],
      resposta: 1
    },
    {
      pergunta: 'Prazo Médio de Recebimento de 45 dias significa:',
      opcoes: [
        'Recebe em 1 mês',
        'Leva em média 45 dias para receber de clientes',
        'Problema sempre',
        'Não importa'
      ],
      resposta: 1
    },
    {
      pergunta: 'Um indicador isolado:',
      opcoes: [
        'É sempre suficiente para análise',
        'Pode enganar, análise deve ser do conjunto',
        'Não importa contexto',
        'Diz tudo sobre a empresa'
      ],
      resposta: 1
    },
    {
      pergunta: 'Balanced Scorecard (BSC) equilibra:',
      opcoes: [
        'Apenas números',
        'Perspectivas financeiras, cliente, interna e aprendizado',
        'Apenas pessoas',
        'Só custos'
      ],
      resposta: 1
    },
    {
      pergunta: 'Comparação com concorrentes é importante para:',
      opcoes: [
        'Inutilidade',
        'Entender posicionamento competitivo',
        'Não adiciona valor',
        'Apenas para vender'
      ],
      resposta: 1
    },
    {
      pergunta: 'Taxa de Cobertura (Lucro / Juros) > 5x significa:',
      opcoes: [
        'Muito risco',
        'Segurança adequada para pagar juros',
        'Problema financeiro',
        'Irrelevante'
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
                {aprovado ? '✓' : 'Repe'}
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

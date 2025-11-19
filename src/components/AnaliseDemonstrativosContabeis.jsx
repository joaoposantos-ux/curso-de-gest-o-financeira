import React from 'react';

const estilos = {
  container: {
    background: '#ecf0f1',
    color: '#34495e',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '30px',
    margin: '0 auto',
    maxWidth: '900px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  titulo: {
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    marginBottom: '25px',
    fontSize: '2em',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subtitulo: {
    color: '#3498db',
    borderBottom: '1px dashed #3498db',
    paddingBottom: '5px',
    marginTop: '30px',
    fontSize: '1.3em',
    fontWeight: 'bold',
  },
  topico: {
    marginBottom: '20px',
    padding: '15px',
    background: '#f7f9fb',
    borderLeft: '5px solid #3498db',
    borderRadius: '4px',
  },
  formula: {
    background: '#eaf6ff',
    padding: '10px',
    border: '1px dashed #3498db',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

export default function AnaliseDemonstrativosContabeis() {
  return (
    <div style={estilos.container}>
      <h1 style={estilos.titulo}>MÓDULO 3: Demonstração do Resultado (DRE)</h1>
      <div style={estilos.topico}>
        <h2 style={estilos.subtitulo}>3.1 – Estrutura Completa da DRE</h2>
        <p>A DRE é elaborada sob o <strong>Regime de Competência</strong> e apura o resultado líquido (Lucro ou Prejuízo) do período.</p>
        <h3 style={{...estilos.subtitulo, fontSize: '1.1em', marginTop: '10px'}}>As Primeiras Linhas (Receita e Custo)</h3>
        <ol>
          <li><b>Receita Bruta:</b> Total de vendas de bens e serviços.</li>
          <li><b>(-) Deduções e Impostos:</b> Impostos sobre vendas (ICMS, IPI, PIS, COFINS) e descontos.</li>
          <li><b>= Receita Líquida:</b> Ponto de partida para a análise de lucratividade.</li>
          <li><b>(-) Custo dos Bens/Serviços Vendidos (CMV/CVM):</b> Valor de aquisição ou produção dos itens vendidos.</li>
          <li><b>= Lucro Bruto:</b> Indica a margem de ganho antes das despesas operacionais.</li>
        </ol>
      </div>
      <div style={estilos.topico}>
        <h2 style={estilos.subtitulo}>3.2 – Despesas Operacionais e EBITDA</h2>
        <h3 style={{...estilos.subtitulo, fontSize: '1.1em', marginTop: '10px'}}>Despesas Operacionais</h3>
        <p>São os gastos necessários para manter a atividade principal da empresa, mas que não estão diretamente ligados à produção (custo).</p>
        <ul>
          <li><b>Despesas de Vendas:</b> Comissões, publicidade, fretes, salários de vendedores.</li>
          <li><b>Despesas Administrativas:</b> Aluguel da sede, salários da diretoria, despesas jurídicas.</li>
          <li><b>Depreciação e Amortização:</b> Perda de valor de Imobilizado e Intangível, que <strong>não envolve saída de caixa</strong>.</li>
        </ul>
        <h3 style={{...estilos.subtitulo, fontSize: '1.1em', marginTop: '10px'}}>EBITDA (Lucro antes de Juros, Impostos, Depreciação e Amortização)</h3>
        <div style={estilos.formula}>
          EBITDA = Lucro Bruto - Despesas Operacionais (sem D&A)
        </div>
        <p>Representa o <strong>potencial de geração de caixa operacional puro</strong> da empresa. É um indicador muito usado em análises e valuation.</p>
      </div>
      <div style={estilos.topico}>
        <h2 style={estilos.subtitulo}>3.3 – Resultado Financeiro e Impostos</h2>
        <h3 style={{...estilos.subtitulo, fontSize: '1.1em', marginTop: '10px'}}>Resultado Antes dos Impostos</h3>
        <ol>
          <li><b>Resultado Operacional (EBIT):</b> EBITDA (-) Depreciação e Amortização.</li>
          <li><b>(+/-) Receitas e Despesas Financeiras:</b> Juros de empréstimos (despesa) e Juros de aplicações (receita).</li>
          <li><b>= LAIR (Lucro Antes do Imposto de Renda):</b> Base para o cálculo dos impostos.</li>
          <li><b>(-) IRPJ e CSLL:</b> Imposto de Renda Pessoa Jurídica e Contribuição Social sobre o Lucro Líquido.</li>
          <li><b>= Lucro Líquido:</b> O resultado final que será distribuído ou reinvestido no Patrimônio Líquido.</li>
        </ol>
      </div>
      <div style={estilos.topico}>
        <h2 style={estilos.subtitulo}>3.4 – Análise Vertical e Horizontal da DRE</h2>
        <h3 style={{...estilos.subtitulo, fontSize: '1.1em', marginTop: '10px'}}>Análise Vertical (Margens e Estrutura)</h3>
        <p>Mede a participação de cada linha da DRE em relação à <strong>Receita Líquida (100%)</strong>. É utilizada para calcular as <b>Margens</b>:</p>
        <ul>
          <li><b>Margem Bruta:</b> Lucro Bruto / Receita Líquida.</li>
          <li><b>Margem EBITDA:</b> EBITDA / Receita Líquida.</li>
          <li><b>Margem Líquida:</b> Lucro Líquido / Receita Líquida.</li>
        </ul>
        <h3 style={{...estilos.subtitulo, fontSize: '1.1em', marginTop: '10px'}}>Análise Horizontal (Evolução Anual)</h3>
        <p>Mede a <strong>evolução percentual</strong> de cada linha da DRE ao longo dos períodos. Ajuda a identificar as tendências de evolução de receitas e despesas.</p>
      </div>
    </div>
  );
}

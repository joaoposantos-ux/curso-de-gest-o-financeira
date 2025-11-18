import React, { useRef } from 'react';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DeclaracaoConclusao({ usuario, onVoltar }) {
  const declaracaoRef = useRef(null);
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const mesAno = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const gerarPDF = async () => {
    if (!declaracaoRef.current) return;

    try {
      const canvas = await html2canvas(declaracaoRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`declaracao-conclusao-${usuario?.nome?.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="w-full max-w-4xl mb-8">
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 text-white hover:text-blue-300 transition mb-6 font-semibold"
        >
          <FaArrowLeft /> Voltar para Área do Aluno
        </button>
      </div>

      {/* Documento de Declaração */}
      <div ref={declaracaoRef} className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-12" style={{ minHeight: '600px' }}>
        {/* Header com Logo e Título */}
        <div className="text-center mb-8 pb-6 border-b-4 border-blue-600">
          <div className="text-sm font-semibold text-gray-600 mb-2">INSTITUIÇÃO DE EDUCAÇÃO CONTINUADA</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gestão Financeira</h1>
          <div className="text-blue-600 font-semibold">Curso Online Certificado</div>
        </div>

        {/* Corpo do Documento */}
        <div className="space-y-6">
          {/* Título */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">DECLARAÇÃO DE CONCLUSÃO</h2>
            <p className="text-gray-600 text-sm">Certificado de Participação e Aprovação</p>
          </div>

          {/* Conteúdo Principal */}
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-center text-lg font-semibold">
              Declaramos por este meio que
            </p>

            {/* Nome do Aluno */}
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 mb-2 pb-2 border-b-2 border-blue-400">
                {usuario?.nome?.toUpperCase()}
              </p>
            </div>

            {/* Corpo Descritivo */}
            <div className="text-justify space-y-4">
              <p>
                Participou e foi aprovado com êxito no Curso de <strong>GESTÃO FINANCEIRA</strong>, 
                realizado integralmente por esta instituição, conforme cronograma estabelecido e com base 
                no cumprimento de todas as exigências curriculares.
              </p>

              <p>
                Durante o curso, o participante demonstrou domínio dos seguintes conteúdos:
              </p>

              {/* Módulos Completados */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm ml-6">
                  <li className="list-disc">Introdução à Gestão Financeira e Conceitos Básicos</li>
                  <li className="list-disc">Planejamento e Controle Financeiro</li>
                  <li className="list-disc">Análise de Demonstrativos Contábeis</li>
                  <li className="list-disc">Fluxo de Caixa e Capital de Giro</li>
                  <li className="list-disc">Fontes de Financiamento e Investimentos</li>
                  <li className="list-disc">Indicadores de Desempenho Financeiro e Tomada de Decisão</li>
                </ul>
              </div>

              <p>
                O participante completou todos os módulos do curso com aprovação em todas as avaliações 
                correspondentes, demonstrando pleno conhecimento dos conteúdos ministrados e competência 
                para aplicação prática dos conceitos de gestão financeira em organizações e gestão pessoal.
              </p>

              <p>
                Este certificado é válido como comprovação de conclusão do curso de Gestão Financeira 
                e reconhece as habilidades e conhecimentos adquiridos pelo participante.
              </p>
            </div>

            {/* Data e Assinatura */}
            <div className="pt-6 mt-8">
              <p className="text-center text-gray-600 mb-12">
                Emitido em {dataAtual}
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="border-t-2 border-gray-800 pt-2 text-sm">
                    <p className="font-semibold text-gray-800">Coordenação do Curso</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-800 pt-2 text-sm">
                    <p className="font-semibold text-gray-800">Direção Acadêmica</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Autenticação */}
            <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t">
              <p>Documento gerado digitalmente - {new Date().toLocaleString('pt-BR')}</p>
              <p>Validade: Permanente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="w-full max-w-4xl mt-8 flex gap-4">
        <button
          onClick={gerarPDF}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition shadow-lg"
        >
          <FaFilePdf className="text-xl" /> Baixar PDF
        </button>
        <button
          onClick={onVoltar}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg"
        >
          Voltar
        </button>
      </div>

      {/* Info Footer */}
      <div className="w-full max-w-4xl mt-6 bg-blue-50 rounded-lg p-4 text-center text-gray-700 text-sm">
        Você pode baixar e imprimir esta declaração quantas vezes desejar.
      </div>
    </div>
  );
}

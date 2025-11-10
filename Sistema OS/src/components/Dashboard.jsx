import React from 'react';
import { ChartBarIcon, ClipboardDocumentListIcon, WrenchScrewdriverIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ usuario }) {
  const resumo = [
    { label: 'OS Pendentes', value: 8, icon: ClipboardDocumentListIcon, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Em Desenvolvimento', value: 4, icon: WrenchScrewdriverIcon, color: 'bg-blue-100 text-blue-700' },
    { label: 'Concluídas', value: 12, icon: CheckCircleIcon, color: 'bg-green-100 text-green-700' },
    { label: 'Usuários', value: 5, icon: UserGroupIcon, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        <ChartBarIcon className="h-8 w-8 text-blue-500" />
        Dashboard - Em Desenvolvimento
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {resumo.map((item, idx) => (
          <div key={idx} className={`rounded-xl shadow p-5 flex items-center gap-4 ${item.color}`}>
            <item.icon className="h-10 w-10 opacity-80" />
            <div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Adicione mais widgets ou gráficos aqui */}
    </div>
  );
}

import React, { useState } from 'react';
import { Card, Button, StatsCard } from '../components/Shared';
import { User, UserRole } from '../types';

interface DirectorDashboardProps {
  user: User;
  onLogout: () => void;
}

const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ user, onLogout }) => {
  const [tab, setTab] = useState<'finance' | 'staff' | 'stock'>('finance');

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-6 space-y-8">
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">CE</div>
          Diretoria
        </div>
        <nav className="space-y-2">
          {['finance', 'staff', 'stock'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t as any)}
              className={`w-full text-left p-3 rounded-lg text-sm font-bold ${tab === t ? 'bg-indigo-600' : 'hover:bg-white/10'}`}
            >
              {t === 'finance' ? '💰 Faturamento' : t === 'staff' ? '👥 Funcionários' : '📦 Estoque'}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="text-red-400 font-bold text-sm mt-10">Sair</button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8">Gestão Estratégica - {user.name}</h1>
        
        {tab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <StatsCard title="Receita Mensal" value="AKZ 1.250.000" color="bg-emerald-50 text-emerald-600" icon="💵" />
              <StatsCard title="Pagamentos Pendentes" value="12" color="bg-rose-50 text-rose-600" icon="⚠️" />
              <StatsCard title="Lucro Líquido" value="AKZ 850.000" color="bg-blue-50 text-blue-600" icon="📈" />
            </div>
            <Card className="p-8">
              <h3 className="font-bold mb-4">Relatório de Inadimplência</h3>
              <div className="text-gray-400 text-center py-10">Gráfico de faturamento em tempo real...</div>
            </Card>
          </div>
        )}

        {tab === 'stock' && (
          <Card className="p-6">
            <h3 className="font-bold mb-4 text-lg">Controle de Inventário Central</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-xs text-gray-400 uppercase tracking-widest">
                  <th className="py-4">Item</th>
                  <th className="py-4">Qtd</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 font-bold">Resmas de Papel</td>
                  <td className="py-4">45</td>
                  <td className="py-4"><span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-xs">OK</span></td>
                </tr>
              </tbody>
            </table>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DirectorDashboard;

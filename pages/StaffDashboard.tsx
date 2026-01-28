
import React, { useState } from 'react';
import { Card, Button, Input, StatsCard } from '../components/Shared';
import { User } from '../types';
import { MOCK_INVENTORY } from '../constants';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
  const [stock, setStock] = useState(MOCK_INVENTORY);

  return (
    <div className="min-h-screen bg-emerald-50/20">
      <header className="bg-white border-b p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">SE</div>
          <div>
            <h1 className="font-bold text-gray-800">Gestão de Estoque</h1>
            <p className="text-xs text-gray-400">Funcionário: {user.name}</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-xs font-bold text-red-500">Sair</button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatsCard title="Itens Cadastrados" value={stock.length} color="bg-white text-emerald-600" icon="📦" />
          <StatsCard title="Abaixo do Mínimo" value="0" color="bg-white text-rose-600" icon="📉" />
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg">Inventário Atual</h2>
            <Button variant="primary">+ Adicionar Item</Button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b">
                <th className="py-4">Nome</th>
                <th className="py-4">Quantidade</th>
                <th className="py-4">Categoria</th>
                <th className="py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {stock.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-bold">{item.name}</td>
                  <td className="py-4 font-mono">{item.quantity} unidades</td>
                  <td className="py-4"><span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold">{item.category}</span></td>
                  <td className="py-4 text-right flex justify-end gap-2">
                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded">➕</button>
                    <button className="p-2 bg-rose-50 text-rose-600 rounded">➖</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
};

export default StaffDashboard;

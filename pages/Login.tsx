
import React, { useState } from 'react';
import { Card, Button, Input } from '../components/Shared';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Busca o usuário na lista dinâmica (Simulando auth)
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      // Em um sistema real, aqui verificaríamos o hash da senha
      // Como é um MVP, qualquer senha preenchida para um usuário válido loga
      if (password.length >= 4) {
        onLogin(foundUser);
      } else {
        setError('A senha deve ter pelo menos 4 caracteres.');
      }
    } else {
      setError('Usuário não encontrado. Verifique o email ou fale com o administrador.');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-2xl shadow-indigo-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-indigo-200">PB</div>
          <h1 className="text-2xl font-bold text-gray-800">Acesso Restrito</h1>
          <p className="text-gray-500">Faça login com sua conta institucional.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Email Institucional" 
            placeholder="seu.nome@creche.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            label="Senha de Acesso" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-pulse">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full py-4 text-lg">Entrar no Sistema</Button>
          
          <div className="text-center">
            <a href="#home" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Voltar para o site público</a>
          </div>
        </form>

        <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-[10px] text-indigo-800 leading-relaxed">
          <p className="font-bold mb-1 uppercase tracking-widest opacity-60">Aviso de Segurança:</p>
          <p>Este sistema é de uso exclusivo de funcionários da Pequenos Brilhantes. Se você esqueceu sua senha, entre em contato com a coordenação.</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;

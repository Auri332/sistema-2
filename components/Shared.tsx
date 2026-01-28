
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; glass?: boolean }> = ({ children, className = "", glass }) => (
  <div className={`rounded-3xl transition-all duration-300 ${glass ? 'bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl' : 'bg-white shadow-sm border border-gray-100'} overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
}> = ({ children, onClick, variant = 'primary', className = "", type = 'button' }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100',
    secondary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-100',
    ghost: 'text-gray-500 hover:bg-gray-100'
  };
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`px-6 py-3 rounded-2xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<{
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
}> = ({ label, type = 'text', placeholder, value, onChange, multiline }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>}
    {multiline ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-5 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[120px] bg-gray-50/50"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-5 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-gray-50/50"
      />
    )}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-indigo-100 text-indigo-600" }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${color}`}>
    {children}
  </span>
);

// Added missing StatsCard component
export const StatsCard: React.FC<{ title: string; value: string | number; color?: string; icon?: string }> = ({ title, value, color = "bg-white", icon }) => (
  <Card className={`p-6 ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
        <h3 className="text-2xl font-black">{value}</h3>
      </div>
      {icon && <span className="text-2xl">{icon}</span>}
    </div>
  </Card>
);

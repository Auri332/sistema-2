
import React, { useState, useEffect } from 'react';
import { User, UserRole, SiteContent } from './types';
import { MOCK_USERS, INITIAL_SITE_CONTENT } from './constants';
import PublicSite from './pages/PublicSite';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherPortal from './pages/TeacherPortal';
import DirectorDashboard from './pages/DirectorDashboard';
import ParentPortal from './pages/ParentPortal';
import StaffDashboard from './pages/StaffDashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [currentHash, setCurrentHash] = useState<string>(() => {
    return window.location.hash.replace(/^#\/?/, '') || 'home';
  });

  const [missingKeys, setMissingKeys] = useState<{gemini: boolean, supabase: boolean}>({
    gemini: false,
    supabase: false
  });

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace(/^#\/?/, '') || 'home');
    };
    window.addEventListener('hashchange', handleHashChange);

    // Verificação de chaves
    const env = (import.meta as any).env || {};
    const hasGemini = !!(process.env.API_KEY || env.VITE_API_KEY);
    const hasSupabaseKey = !!(process.env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY);
    
    setMissingKeys({
      gemini: !hasGemini,
      supabase: !hasSupabaseKey
    });

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const routes: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'admin',
      [UserRole.DIRECTOR]: 'director',
      [UserRole.TEACHER]: 'teacher',
      [UserRole.PARENT]: 'parent',
      [UserRole.STAFF]: 'staff',
      [UserRole.PUBLIC]: 'home'
    };
    window.location.hash = routes[user.role] || 'home';
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.hash = 'home';
  };

  const renderContent = () => {
    if (!currentUser) {
      if (currentHash === 'login') return <Login onLogin={handleLogin} users={MOCK_USERS} />;
      return <PublicSite content={siteContent} />;
    }

    switch (currentUser.role) {
      case UserRole.ADMIN:
        return <AdminDashboard user={currentUser} onLogout={handleLogout} siteContent={siteContent} onUpdateSite={setSiteContent} />;
      case UserRole.DIRECTOR:
        return <DirectorDashboard user={currentUser} onLogout={handleLogout} />;
      case UserRole.TEACHER:
        return <TeacherPortal user={currentUser} onLogout={handleLogout} />;
      case UserRole.PARENT:
        return <ParentPortal user={currentUser} onLogout={handleLogout} />;
      case UserRole.STAFF:
        return <StaffDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <PublicSite content={siteContent} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-900">
      {(missingKeys.gemini || missingKeys.supabase) && (
        <div className="bg-amber-500 text-white text-[10px] py-1.5 px-4 text-center font-bold sticky top-0 z-[9999] shadow-lg flex items-center justify-center gap-4">
          <span>⚠️ CONFIGURAÇÃO:</span>
          {missingKeys.supabase && <span className="bg-white/20 px-2 py-0.5 rounded">Falta Chave Supabase (Anon Key)</span>}
          {missingKeys.gemini && <span className="bg-white/20 px-2 py-0.5 rounded">Falta Chave Gemini (IA)</span>}
          <span className="opacity-70 text-[8px] hidden md:inline">Adicione as variáveis VITE_ nas configurações da Vercel.</span>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default App;

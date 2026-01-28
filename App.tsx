
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

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace(/^#\/?/, '') || 'home');
    };
    window.addEventListener('hashchange', handleHashChange);
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
      {renderContent()}
    </div>
  );
};

export default App;

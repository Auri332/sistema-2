
import React, { useState, useEffect } from 'react';
import { User, UserRole, SiteContent, Student, Class, FinancialRecord, InventoryItem } from './types';
import { MOCK_USERS, INITIAL_SITE_CONTENT, MOCK_STUDENTS, MOCK_CLASSES, MOCK_FINANCE, MOCK_INVENTORY } from './constants';
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
  
  // Estado Global de Dados
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);
  const [finances, setFinances] = useState<FinancialRecord[]>(MOCK_FINANCE);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  
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
      if (currentHash === 'login') return <Login onLogin={handleLogin} users={users} />;
      return <PublicSite content={siteContent} />;
    }

    const commonProps = { user: currentUser, onLogout: handleLogout };

    switch (currentUser.role) {
      case UserRole.ADMIN:
        return (
          <AdminDashboard 
            {...commonProps}
            siteContent={siteContent} 
            onUpdateSite={setSiteContent}
            users={users} setUsers={setUsers}
            students={students} setStudents={setStudents}
            classes={classes} setClasses={setClasses}
            finances={finances}
          />
        );
      case UserRole.TEACHER:
        return (
          <TeacherPortal 
            {...commonProps}
            students={students} setStudents={setStudents}
            classes={classes}
          />
        );
      case UserRole.STAFF:
        return (
          <StaffDashboard 
            {...commonProps}
            students={students} setStudents={setStudents}
            classes={classes}
            finances={finances} setFinances={setFinances}
            inventory={inventory} setInventory={setInventory}
          />
        );
      case UserRole.PARENT:
        return <ParentPortal {...commonProps} students={students} finances={finances} />;
      case UserRole.DIRECTOR:
        return <DirectorDashboard {...commonProps} finances={finances} users={users} />;
      default:
        return <PublicSite content={siteContent} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-900 overflow-x-hidden">
      {renderContent()}
    </div>
  );
};

export default App;

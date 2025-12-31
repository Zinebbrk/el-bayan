import { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { Lessons } from './components/Lessons';
import { ChatbotTutor } from './components/ChatbotTutor';
import { Assessments } from './components/Assessments';
import { Games } from './components/Games';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { FontLoader } from './components/FontLoader';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export type Page = 'landing' | 'dashboard' | 'lessons' | 'chatbot' | 'assessments' | 'games' | 'profile' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { user, signOut, loading } = useAuth();

  // Auto-redirect to dashboard when user logs in
  useEffect(() => {
    if (user && currentPage === 'landing') {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('landing');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[#688837] mb-4" style={{ fontFamily: 'Amiri, serif' }}>
            البيان
          </div>
          <div className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <FontLoader />
      {!user && currentPage === 'landing' && (
        <Landing onExplore={handleLogin} />
      )}
      
      {user && (
        <>
          {currentPage === 'dashboard' && (
            <Dashboard onNavigate={navigateTo} onLogout={handleLogout} />
          )}
          {currentPage === 'lessons' && (
            <Lessons onNavigate={navigateTo} onLogout={handleLogout} />
          )}
          {currentPage === 'chatbot' && (
            <ChatbotTutor onNavigate={navigateTo} onLogout={handleLogout} />
          )}
          {currentPage === 'assessments' && (
            <Assessments onNavigate={navigateTo} onLogout={handleLogout} />
          )}
          {currentPage === 'games' && (
            <Games onNavigate={navigateTo} onLogout={handleLogout} />
          )}
          {currentPage === 'profile' && (
            <Profile onNavigate={navigateTo} onLogout={handleLogout} />
          )}
          {currentPage === 'settings' && (
            <Settings onNavigate={navigateTo} onLogout={handleLogout} />
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
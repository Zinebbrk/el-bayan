import { useState } from 'react';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { Lessons } from './components/Lessons';
import { ChatbotTutor } from './components/ChatbotTutor';
import { Assessments } from './components/Assessments';
import { Games } from './components/Games';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { HarakaMatching } from './components/HarakaMatching';
import { IrabMaster } from './components/IrabMaster';
import { FontLoader } from './components/FontLoader';

export type Page = 'landing' | 'signin' | 'signup' | 'dashboard' | 'lessons' | 'chatbot' | 'assessments' | 'games' | 'harakaMatching' | 'irabMaster' | 'profile' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <FontLoader />
      {!isLoggedIn && (
        <>
          {currentPage === 'landing' && (
            <Landing onExplore={() => setCurrentPage('signin')} />
          )}
          {currentPage === 'signin' && (
            <SignIn 
              onSignUp={() => setCurrentPage('signup')} 
              onSignIn={handleLogin}
            />
          )}
          {currentPage === 'signup' && (
            <SignUp 
              onSignIn={() => setCurrentPage('signin')} 
              onSignUp={handleLogin}
            />
          )}
        </>
      )}
      
      {isLoggedIn && (
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
          {currentPage === 'harakaMatching' && (
            <HarakaMatching 
              onBack={() => setCurrentPage('games')} 
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'irabMaster' && (
            <IrabMaster 
              onBack={() => setCurrentPage('games')} 
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />
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
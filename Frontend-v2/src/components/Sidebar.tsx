import { Home, BookOpen, MessageCircle, FileCheck, Gamepad2, User, Settings, LogOut } from 'lucide-react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'lessons' as Page, label: 'Lessons', icon: BookOpen },
    { id: 'chatbot' as Page, label: 'AI Tutor', icon: MessageCircle },
    { id: 'assessments' as Page, label: 'Assessments', icon: FileCheck },
    { id: 'games' as Page, label: 'Games', icon: Gamepad2 },
    { id: 'profile' as Page, label: 'Profile', icon: User },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#FFFDF6] border-r border-[#E1CB98]/30 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[#E1CB98]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-[#FFFDF6]" />
          </div>
          <span className="text-xl text-[#2D2A26]" style={{ fontFamily: 'Amiri, serif' }}>
            البيان
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#688837] text-white shadow-lg'
                  : 'text-[#2D2A26]/70 hover:bg-[#E1CB98]/30 hover:text-[#688837]'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#2D2A26]/70 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Decorative Pattern */}
      <div className="absolute bottom-20 left-0 right-0 h-32 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sidebar-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="15" fill="none" stroke="#688837" strokeWidth="1" />
              <circle cx="20" cy="20" r="8" fill="#688837" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sidebar-pattern)" />
        </svg>
      </div>
    </aside>
  );
}

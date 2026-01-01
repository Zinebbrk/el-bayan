import { Bell, Globe, Moon, Volume2, Wifi, Shield, User, HelpCircle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';

interface SettingsProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Settings({ onNavigate, onLogout }: SettingsProps) {
  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="settings" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl text-[#2D2A26] mb-2"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Settings
          </h1>
          <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Customize your learning experience
          </p>
        </div>

        <div className="max-w-4xl">
          {/* Account Settings */}
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Account
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Email
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    ahmed.m@email.com
                  </div>
                </div>
                <Button variant="outline" className="border-[#E1CB98] text-[#688837]">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Password
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    ••••••••
                  </div>
                </div>
                <Button variant="outline" className="border-[#E1CB98] text-[#688837]">
                  Change
                </Button>
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Learning Preferences
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[#2D2A26] mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Difficulty Level
                </label>
                <div className="flex gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                        level === 'Intermediate'
                          ? 'bg-[#688837] text-white'
                          : 'bg-[#E1CB98]/30 text-[#2D2A26] hover:bg-[#E1CB98]/50'
                      }`}
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#2D2A26] mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Dialect Preference
                </label>
                <select className="w-full px-4 py-3 rounded-xl bg-[#E1CB98]/10 border-2 border-[#E1CB98] text-[#2D2A26] focus:border-[#688837] focus:outline-none" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <option>Classical Arabic (Fusha)</option>
                  <option>Quranic Arabic</option>
                  <option>Modern Standard Arabic</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Enable Diacritics (Harakat)
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Show vowel marks in lessons and exercises
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-14 h-7 bg-[#E1CB98] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#688837]"></div>
                </label>
              </div>

              <div>
                <label className="block text-[#2D2A26] mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Daily Goal
                </label>
                <select className="w-full px-4 py-3 rounded-xl bg-[#E1CB98]/10 border-2 border-[#E1CB98] text-[#2D2A26] focus:border-[#688837] focus:outline-none" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <option>15 minutes/day</option>
                  <option>30 minutes/day</option>
                  <option>1 hour/day</option>
                  <option>2 hours/day</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interface Settings */}
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Interface
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Interface Language
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Change the app interface language
                  </div>
                </div>
                <select className="px-4 py-2 rounded-xl bg-white border border-[#E1CB98] text-[#2D2A26] focus:border-[#688837] focus:outline-none" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <option>English</option>
                  <option>العربية</option>
                  <option>Français</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Dark Mode
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Enable dark theme for reduced eye strain
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-7 bg-[#E1CB98] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#688837]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-[#688837]" />
                  <div>
                    <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Offline Mode
                    </div>
                    <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      Download lessons for offline access
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-7 bg-[#E1CB98] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#688837]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Daily Reminders
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Get reminded to complete your daily lessons
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-14 h-7 bg-[#E1CB98] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#688837]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Achievement Alerts
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Notify when you earn badges or reach milestones
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-14 h-7 bg-[#E1CB98] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#688837]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Weekly Progress Report
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Receive weekly summary of your learning progress
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-14 h-7 bg-[#E1CB98] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#688837]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Audio & Pronunciation
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#E1CB98]/10">
                <div>
                  <div className="text-[#2D2A26] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Audio Pronunciation
                  </div>
                  <div className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Play audio for words and sentences
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-14 h-7 bg-[#E1CB98] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#688837]"></div>
                </label>
              </div>

              <div>
                <label className="block text-[#2D2A26] mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Recitation Style
                </label>
                <select className="w-full px-4 py-3 rounded-xl bg-[#E1CB98]/10 border-2 border-[#E1CB98] text-[#2D2A26] focus:border-[#688837] focus:outline-none" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <option>Hafs (حفص)</option>
                  <option>Warsh (ورش)</option>
                  <option>Qalun (قالون)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Privacy & Security
              </h2>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start border-[#E1CB98] text-[#2D2A26] hover:bg-[#E1CB98]/20">
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start border-[#E1CB98] text-[#2D2A26] hover:bg-[#E1CB98]/20">
                Terms of Service
              </Button>
              <Button variant="outline" className="w-full justify-start border-[#E1CB98] text-[#2D2A26] hover:bg-[#E1CB98]/20">
                Data & Privacy Settings
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Help & Support
              </h2>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start border-[#E1CB98] text-[#2D2A26] hover:bg-[#E1CB98]/20">
                Help Center
              </Button>
              <Button variant="outline" className="w-full justify-start border-[#E1CB98] text-[#2D2A26] hover:bg-[#E1CB98]/20">
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start border-[#E1CB98] text-[#2D2A26] hover:bg-[#E1CB98]/20">
                Report a Bug
              </Button>
              <Button variant="outline" className="w-full justify-start border-[#E1CB98] text-[#2D2A26] hover:bg-[#E1CB98]/20">
                Send Feedback
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-200">
            <h2 
              className="text-2xl text-red-600 mb-6"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              Danger Zone
            </h2>

            <div className="space-y-4">
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100">
                Clear Learning History
              </Button>
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100">
                Reset All Progress
              </Button>
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

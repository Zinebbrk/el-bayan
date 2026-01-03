import { Sparkles, BookOpen, MessageCircle, Target, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import backgroundImage from '../background.png';

interface LandingProps {
  onExplore: () => void;
  onViewLessons?: () => void;
}

export function Landing({ onExplore, onViewLessons }: LandingProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onExplore();
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay for Opacity */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)'
        }}
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF6]/80 backdrop-blur-md border-b border-[#E1CB98]/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#FFFDF6]" />
            </div>
            <span 
              className="text-[#2D2A26] font-bold" 
              style={{ 
                fontFamily: 'Scheherazade New, Amiri, serif',
                fontSize: '1.5rem',
                letterSpacing: '0.05em',
                textShadow: '1px 1px 2px rgba(104, 136, 55, 0.1)'
              }}
            >
              البيان
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-[#2D2A26] hover:text-[#688837] transition-colors">Features</a>
            <a href="#about" className="text-[#2D2A26] hover:text-[#688837] transition-colors">About</a>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-[#688837] hover:bg-[#688837]/90 text-white rounded-full px-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <AuthModal 
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Content */}
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Quranic Verse */}
          <div 
            className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-[#688837]/10 to-[#E1CB98]/20 backdrop-blur-sm border border-[#C8A560]/30 shadow-2xl"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            <div className="text-5xl md:text-6xl text-[#688837] leading-relaxed mb-6">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-5xl md:text-6xl text-[#688837] leading-relaxed mb-4">
              ٱلرَّحۡمَٰنُ
            </div>
            <div className="text-4xl md:text-5xl text-[#688837] leading-relaxed mb-4">
              عَلَّمَ ٱلۡقُرۡءَانَ
            </div>
            <div className="text-4xl md:text-5xl text-[#688837] leading-relaxed mb-4">
              خَلَقَ ٱلۡإِنسَٰنَ
            </div>
            <div className="text-4xl md:text-5xl text-[#688837] leading-relaxed">
              عَلَّمَهُ ٱلۡبَيَانَ
            </div>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-5xl md:text-6xl text-[#2D2A26] mb-6"
            style={{ 
              fontFamily: 'Scheherazade New, Amiri, serif',
              fontWeight: '700',
              letterSpacing: '0.05em',
              textShadow: '2px 2px 4px rgba(104, 136, 55, 0.15)'
            }}
          >
            البيان
            <span className="block text-3xl md:text-4xl mt-2 text-[#688837]">El-Bayan</span>
          </h1>
          
          <p className="text-xl text-[#2D2A26]/80 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Cairo, sans-serif' }}>
            An adaptive journey to mastering Arabic Grammar , at your place and your level.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
          <Button
            onClick={onExplore}
            className="bg-[#688837] hover:bg-[#688837]/90 text-white rounded-2xl px-12 py-6 text-xl shadow-2xl hover:shadow-[#688837]/50 transition-all duration-300 hover:scale-105 border-2 border-[#C8A560]"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Explore
          </Button>
            {onViewLessons && (
              <Button
                onClick={onViewLessons}
                variant="outline"
                className="border-2 border-[#688837] text-[#688837] hover:bg-[#688837]/10 rounded-2xl px-12 py-6 text-xl transition-all duration-300 hover:scale-105"
              >
                <BookOpen className="w-6 h-6 mr-2" />
                View Lessons (Demo)
              </Button>
            )}
          </div>

          {/* Decorative Line */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#E1CB98]"></div>
            <div className="w-3 h-3 rotate-45 border-2 border-[#C8A560]"></div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#E1CB98]"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#E1CB98]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl text-[#2D2A26] mb-6"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            About El-Bayan
          </h2>
          <p className="text-lg text-[#2D2A26]/70 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
            El-Bayan is an adaptive platform for mastering Arabic grammar using AI. 
            Rooted in Islamic heritage and powered by modern technology, we provide 
            personalized learning paths that adjust to your level, helping you understand 
            the beauty and precision of the Arabic language.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-4xl text-center text-[#2D2A26] mb-16"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Key Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-[#FFFDF6]" />
              </div>
              <h3 className="text-xl text-[#2D2A26] mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                Adaptive Lessons
              </h3>
              <p className="text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Real-time grammar correction and personalized difficulty adjustment
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-[#FFFDF6]" />
              </div>
              <h3 className="text-xl text-[#2D2A26] mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                AI Chatbot Tutor
              </h3>
              <p className="text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Ask questions and get instant explanations for grammar rules
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-[#FFFDF6]" />
              </div>
              <h3 className="text-xl text-[#2D2A26] mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                Assessments & Quizzes
              </h3>
              <p className="text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Automatic feedback and detailed performance analysis
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] hover:border-[#688837] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-[#FFFDF6]" />
              </div>
              <h3 className="text-xl text-[#2D2A26] mb-3" style={{ fontFamily: 'Amiri, serif' }}>
                Gamified Learning
              </h3>
              <p className="text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Earn XP points, unlock badges, and track your progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#E1CB98]/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl text-center text-[#2D2A26] mb-16"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            How It Works
          </h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#688837] text-white flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  Start Your Journey
                </h3>
                <p className="text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Create your account and complete a quick assessment to determine your level
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#688837] text-white flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  Learn Adaptively
                </h3>
                <p className="text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Follow personalized lessons that adjust to your progress in real-time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#688837] text-white flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  Get AI Assistance
                </h3>
                <p className="text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Ask our AI tutor any grammar question and receive detailed explanations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#688837] text-white flex items-center justify-center">
                4
              </div>
              <div>
                <h3 className="text-xl text-[#2D2A26] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  Master & Achieve
                </h3>
                <p className="text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Track your progress, earn badges, and master Arabic grammar step by step
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 
            className="text-4xl text-[#2D2A26] mb-6"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Begin Your Arabic Grammar Journey
          </h2>
          <p className="text-lg text-[#2D2A26]/70 mb-8" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Join thousands of learners mastering the beauty of Arabic grammar
          </p>
          <Button
            onClick={onExplore}
            className="bg-[#688837] hover:bg-[#688837]/90 text-white rounded-2xl px-12 py-6 text-xl shadow-2xl hover:shadow-[#688837]/50 transition-all duration-300 hover:scale-105"
          >
            Start Learning Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E1CB98]/30 py-12 px-6 bg-[#FFFDF6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-[#2D2A26] mb-4" style={{ fontFamily: 'Amiri, serif' }}>
                About
              </h4>
              <ul className="space-y-2 text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <li><a href="#" className="hover:text-[#688837]">Our Story</a></li>
                <li><a href="#" className="hover:text-[#688837]">Team</a></li>
                <li><a href="#" className="hover:text-[#688837]">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#2D2A26] mb-4" style={{ fontFamily: 'Amiri, serif' }}>
                Resources
              </h4>
              <ul className="space-y-2 text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <li><a href="#" className="hover:text-[#688837]">Blog</a></li>
                <li><a href="#" className="hover:text-[#688837]">FAQ</a></li>
                <li><a href="#" className="hover:text-[#688837]">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#2D2A26] mb-4" style={{ fontFamily: 'Amiri, serif' }}>
                Legal
              </h4>
              <ul className="space-y-2 text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <li><a href="#" className="hover:text-[#688837]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#688837]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#688837]">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#2D2A26] mb-4" style={{ fontFamily: 'Amiri, serif' }}>
                Contact
              </h4>
              <ul className="space-y-2 text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <li><a href="#" className="hover:text-[#688837]">Email</a></li>
                <li><a href="#" className="hover:text-[#688837]">Twitter</a></li>
                <li><a href="#" className="hover:text-[#688837]">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#E1CB98]/30 text-center text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <p>© 2025 El-Bayan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
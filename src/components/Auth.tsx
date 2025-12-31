import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BookOpen, Sparkles } from 'lucide-react';

interface AuthProps {
  onSuccess: () => void;
}

export function Auth({ onSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          onSuccess();
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onSuccess();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#688837] to-[#688837]/80 flex items-center justify-center p-4">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-pattern)" />
        </svg>
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-[#FFFDF6] rounded-3xl shadow-2xl p-8 border-2 border-[#C8A560]">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#688837] to-[#C8A560] mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-4xl text-[#2D2A26] mb-2"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              El-Bayan
            </h1>
            <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Master Arabic Grammar with AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="name" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required={isSignUp}
                  className="mt-1 bg-white border-[#E1CB98] focus:border-[#688837]"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1 bg-white border-[#E1CB98] focus:border-[#688837]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>

            <div>
              <Label htmlFor="password" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                className="mt-1 bg-white border-[#E1CB98] focus:border-[#688837]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#688837] to-[#688837]/90 hover:from-[#688837]/90 hover:to-[#688837]/80 text-white py-6 rounded-xl"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </Button>
          </form>

          {/* Toggle Sign In/Sign Up */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-[#688837] hover:text-[#688837]/80 transition-colors"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {isSignUp ? (
                <span>
                  Already have an account? <span className="underline">Sign In</span>
                </span>
              ) : (
                <span>
                  Don't have an account? <span className="underline">Sign Up</span>
                </span>
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl bg-[#E1CB98]/20 border border-[#E1CB98]">
            <p className="text-sm text-[#2D2A26]/70 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              <strong>Demo Account:</strong>
            </p>
            <p className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Email: demo@elbayan.com<br />
              Password: demo123
            </p>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
            ✨ Islamic aesthetics meets modern EdTech
          </p>
        </div>
      </div>
    </div>
  );
}

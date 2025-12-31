import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log('Attempting login...');
    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      console.log('Login successful!');
      onSuccess();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setNeedsEmailConfirmation(false);
    setLoading(true);

    console.log('Attempting registration...');
    const { error } = await signUp(registerEmail, registerPassword, registerName);

    if (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to create account');
      setLoading(false);
    } else {
      console.log('Registration successful!');
      
      // Check if we need to wait for email confirmation
      // If no session was created, email confirmation is likely required
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session = email confirmation required
        setNeedsEmailConfirmation(true);
        setSuccessMessage(`Account created! Please check your email (${registerEmail}) and click the confirmation link to sign in.`);
        setLoading(false);
      } else {
        // Session exists = auto sign-in worked!
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
      onSuccess();
        }, 1000);
      }
    }
  };

  // Reset messages when modal closes or opens
  const handleModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      setError(null);
      setSuccessMessage(null);
      setNeedsEmailConfirmation(false);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleModalChange}>
      <DialogContent className="sm:max-w-md bg-[#FFFDF6]">
        <DialogHeader>
          <DialogTitle 
            className="text-2xl text-[#2D2A26]" 
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Welcome to El-Bayan
          </DialogTitle>
          <DialogDescription style={{ fontFamily: 'Cairo, sans-serif' }}>
            Start your journey to master Arabic grammar
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#E1CB98]/20">
            <TabsTrigger 
              value="login"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="border-[#E1CB98]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="border-[#E1CB98]"
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
                className="w-full bg-[#688837] hover:bg-[#688837]/90 text-white"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Full Name
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Ahmed Ali"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                  className="border-[#E1CB98]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  className="border-[#E1CB98]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Password
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-[#E1CB98]"
                />
                <p className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Minimum 6 characters
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {error}
                  </p>
                </div>
              )}

              {successMessage && (
                <div className={`p-3 rounded-lg border ${
                  needsEmailConfirmation 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <p className={`text-sm ${
                    needsEmailConfirmation ? 'text-blue-700' : 'text-green-700'
                  }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {successMessage}
                  </p>
                  {needsEmailConfirmation && (
                    <div className="mt-2 text-xs text-blue-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      💡 <strong>Tip:</strong> To disable email confirmation for testing, go to Supabase Dashboard → Authentication → Settings → Email Auth → Uncheck "Enable email confirmations"
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !!successMessage}
                className="w-full bg-[#688837] hover:bg-[#688837]/90 text-white"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {loading ? 'Creating account...' : successMessage ? 'Check Your Email' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-3 rounded-lg bg-[#688837]/10 border border-[#688837]/20">
          <p className="text-xs text-[#2D2A26]/70 text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

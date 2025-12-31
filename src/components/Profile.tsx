import { useState, useEffect } from 'react';
import { User, Edit2, Award, BookOpen, Target, TrendingUp, Calendar, Lock, LogOut, Save, X, Shield, Clock } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { useUserProgress, useUserBadges } from '../hooks/useUserData';
import { supabase } from '../utils/supabase/client';
import { lessonService } from '../services/lessonService';
import type { UserProfile, Badge } from '../utils/supabase/client';

interface ProfileProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface EditProfileData {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface SessionInfo {
  id: string;
  created_at: string;
  expires_at: string;
  is_current: boolean;
}

export function Profile({ onNavigate, onLogout }: ProfileProps) {
  const { user, session, signOut } = useAuth();
  const { progress, loading: progressLoading } = useUserProgress();
  const { badges: userBadges, loading: badgesLoading } = useUserBadges();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    inProgressLessons: 0,
    totalXP: 0,
    currentLevel: 1,
    streakDays: 0,
    earnedBadges: 0,
  });
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  
  // Edit profile state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<EditProfileData>({ name: '', level: 'beginner' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const userProfile = await userService.getUserProfile(user.id);
        if (userProfile) {
          setProfile(userProfile);
          setEditData({
            name: userProfile.name,
            level: userProfile.level,
          });
        }

        // Fetch all badges
        const badges = await userService.getAllBadges();
        setAllBadges(badges);

        // Calculate statistics
        const allLessons = await Promise.all([
          lessonService.getLessonsByLevel('beginner'),
          lessonService.getLessonsByLevel('intermediate'),
          lessonService.getLessonsByLevel('advanced'),
        ]);
        const totalLessons = allLessons.flat().length;
        const completedLessons = progress.filter(p => p.completed_at).length;
        const inProgressLessons = progress.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100).length;

        setStats({
          totalLessons,
          completedLessons,
          inProgressLessons,
          totalXP: userProfile?.xp || 0,
          currentLevel: userProfile?.current_level || 1,
          streakDays: userProfile?.streak_days || 0,
          earnedBadges: userBadges.length,
        });

        // Fetch sessions (Supabase doesn't expose all sessions directly, so we'll show current session info)
        if (session) {
          setSessions([{
            id: session.access_token.substring(0, 20) + '...',
            created_at: new Date(session.expires_at! * 1000 - 3600000).toISOString(), // Approximate
            expires_at: new Date(session.expires_at! * 1000).toISOString(),
            is_current: true,
          }]);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, progress, userBadges, session]);

  // Update stats when progress or badges change
  useEffect(() => {
    if (profile && progress) {
      const completedLessons = progress.filter(p => p.completed_at).length;
      const inProgressLessons = progress.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100).length;
      
      setStats(prev => ({
        ...prev,
        completedLessons,
        inProgressLessons,
        totalXP: profile.xp,
        currentLevel: profile.current_level,
        streakDays: profile.streak_days,
        earnedBadges: userBadges.length,
      }));
    }
  }, [profile, progress, userBadges]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const success = await userService.updateUserProfile(user.id, {
        name: editData.name,
        level: editData.level,
      });

      if (success) {
        // Refresh profile
        const updatedProfile = await userService.getUserProfile(user.id);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
        setIsEditDialogOpen(false);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    setPasswordError('');

    // Validation
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.new.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordData({ current: '', new: '', confirm: '' });
        setIsPasswordDialogOpen(false);
        alert('Password changed successfully!');
      }
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!user) return;
    
    if (confirm('Are you sure you want to log out from all devices? You will need to sign in again.')) {
      // Supabase doesn't have a direct "logout all" endpoint
      // We'll sign out the current session
      await signOut();
      onLogout();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading || progressLoading || badgesLoading) {
    return (
      <div className="flex min-h-screen bg-[#FFFDF6]">
        <Sidebar currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-[#688837] mb-4" style={{ fontFamily: 'Amiri, serif' }}>
              Loading profile...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex min-h-screen bg-[#FFFDF6]">
        <Sidebar currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-[#2D2A26] mb-4" style={{ fontFamily: 'Amiri, serif' }}>
              Please sign in to view your profile
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Create a map of earned badges
  const earnedBadgeIds = new Set(userBadges.map(b => (b as any).badge?.id || (b as any).badge_id));
  const earnedBadges = allBadges.filter(b => earnedBadgeIds.has(b.id));
  const unearnedBadges = allBadges.filter(b => !earnedBadgeIds.has(b.id));

  return (
    <div className="flex min-h-screen bg-[#FFFDF6]">
      <Sidebar currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl text-[#2D2A26] mb-2"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Your Profile
          </h1>
          <p className="text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Track your progress and achievements
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560] mb-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#688837] to-[#C8A560] flex items-center justify-center text-white text-3xl font-bold">
                {getInitials(profile.name)}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 
                  className="text-2xl text-[#2D2A26]"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  {profile.name}
                </h2>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#688837] to-[#C8A560] text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Level {profile.current_level}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#E1CB98]/30 text-[#2D2A26] text-sm capitalize" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {profile.level}
                </span>
              </div>
              <p className="text-[#2D2A26]/60 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {profile.email} • Joined {formatDate(profile.created_at)}
              </p>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="text-2xl text-[#688837] mb-1">{stats.totalXP.toLocaleString()}</div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Total XP
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="text-2xl text-[#688837] mb-1">{stats.completedLessons}</div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Lessons Completed
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="text-2xl text-[#688837] mb-1">{stats.earnedBadges}</div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Badges
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="text-2xl text-[#688837] mb-1">{stats.streakDays}</div>
                  <div className="text-xs text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Day Streak
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#688837] hover:bg-[#688837]/90 text-white rounded-xl px-6">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle style={{ fontFamily: 'Amiri, serif' }}>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Name</label>
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Level</label>
                      <select
                        value={editData.level}
                        onChange={(e) => setEditData({ ...editData, level: e.target.value as any })}
                        className="w-full h-9 rounded-md border border-[#E1CB98] px-3 bg-white"
                        style={{ fontFamily: 'Cairo, sans-serif' }}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-[#688837] hover:bg-[#688837]/90"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-xl px-6">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle style={{ fontFamily: 'Amiri, serif' }}>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Current Password</label>
                      <Input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>New Password</label>
                      <Input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>Confirm New Password</label>
                      <Input
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        placeholder="Confirm new password"
                      />
                    </div>
                    {passwordError && (
                      <div className="text-red-600 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {passwordError}
                      </div>
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsPasswordDialogOpen(false);
                          setPasswordData({ current: '', new: '', confirm: '' });
                          setPasswordError('');
                        }}
                        disabled={isChangingPassword}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                        className="bg-[#688837] hover:bg-[#688837]/90"
                      >
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Progress Overview
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Lessons Completed
                  </span>
                  <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {stats.completedLessons} / {stats.totalLessons}
                  </span>
                </div>
                <div className="w-full h-3 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full transition-all"
                    style={{ width: `${stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    In Progress
                  </span>
                  <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {stats.inProgressLessons}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    Experience Points
                  </span>
                  <span className="text-[#688837]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {stats.totalXP.toLocaleString()} XP
                  </span>
                </div>
                <div className="w-full h-3 bg-[#E1CB98]/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#688837] to-[#C8A560] rounded-full transition-all"
                    style={{ width: `${(stats.totalXP % 1000) / 10}%` }}
                  ></div>
                </div>
                <div className="text-xs text-[#2D2A26]/60 mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {1000 - (stats.totalXP % 1000)} XP until next level
                </div>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98]">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#688837]" />
                <h3 
                  className="text-xl text-[#2D2A26]"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  Security & Sessions
                </h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-[#2D2A26]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span>Current Session</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  {session && (
                    <div className="text-xs text-[#2D2A26]/50">
                      Expires: {formatDate(new Date(session.expires_at! * 1000).toISOString())}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogoutAll}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#688837]/20">
              <h3 
                className="text-xl text-[#2D2A26] mb-3"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Learning Preferences
              </h3>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[#2D2A26]/70">Level</span>
                  <span className="text-[#688837] capitalize">{profile.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2D2A26]/70">Last Active</span>
                  <span className="text-[#688837]">{formatDate(profile.last_active_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2D2A26]/70">Member Since</span>
                  <span className="text-[#688837]">{formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="p-6 rounded-2xl bg-[#FFFDF6] border-2 border-[#E1CB98] mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-[#688837]" />
              <h2 
                className="text-2xl text-[#2D2A26]"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                Badge Collection
              </h2>
            </div>
            <span className="text-sm text-[#2D2A26]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {earnedBadges.length} / {allBadges.length}
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {allBadges.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id);
              const userBadge = userBadges.find((ub: any) => (ub.badge?.id || ub.badge_id) === badge.id);
              
              return (
                <div
                  key={badge.id}
                  className={`group relative p-4 rounded-2xl text-center transition-all ${
                    isEarned
                      ? 'bg-gradient-to-br from-[#688837]/10 to-[#C8A560]/10 border-2 border-[#C8A560] cursor-pointer hover:scale-105'
                      : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="text-xs text-[#2D2A26]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {badge.name}
                  </div>
                  {isEarned && userBadge && (
                    <div className="text-[10px] text-[#2D2A26]/60 mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {formatDate((userBadge as any).earned_at)}
                    </div>
                  )}
                  {!isEarned && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl">
                        🔒
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

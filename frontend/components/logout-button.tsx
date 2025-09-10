'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createClient } from '../lib/supabase';

interface LogoutButtonProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export default function LogoutButton({ variant = 'icon', className = '' }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Logout failed');
        console.error('Logout error:', error);
        return;
      }

      // Clear any demo data
      localStorage.removeItem('demo-user');
      
      toast.success('Logged out successfully');
      router.push('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
        title="Sign out"
      >
        <LogOut className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`text-gray-600 hover:text-gray-900 transition-colors ${className}`}
      >
        {isLoggingOut ? 'Signing out...' : 'Sign out'}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isLoggingOut ? 'Signing out...' : 'Sign out'}
    </button>
  );
}

'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../../hooks/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { token, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [router, token]);

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header onLogout={handleLogout} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

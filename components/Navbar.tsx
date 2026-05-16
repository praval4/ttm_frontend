"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiLayout } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading || !user) return null;

  return (
    <nav className="glass sticky top-4 z-50 mx-auto container p-4 mb-8 flex justify-between items-center" style={{ width: 'calc(100% - 3rem)' }}>
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
          <FiLayout size={20} />
        </div>
        <span className="text-xl font-black text-white">TeamFlow</span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-text-secondary">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <Link href="/tasks" className="hover:text-primary transition-colors">Tasks</Link>
        </div>
        
        <div className="w-px h-6 bg-white/10"></div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:flex flex-col">
            <span className="text-sm font-black text-white leading-none mb-1">{user.name}</span>
            <span className="text-[10px] uppercase tracking-widest text-primary font-black">{user.role}</span>
          </div>
          <button 
            onClick={logout} 
            className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-xl hover:text-danger transition-all"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

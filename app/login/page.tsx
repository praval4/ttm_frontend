"use client";

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center py-20 min-h-[80vh]">
      <div className="glass p-10 w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-text-secondary">Enter your credentials to continue</p>
        </div>
        
        {error && <div className="mb-6 p-3 bg-danger/10 border border-danger/20 text-danger text-center text-sm rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" autoComplete="off">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <FiMail size={14} className="text-primary" /> Email Address
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="name@company.com"
              value={email}
              autoComplete="new-email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <FiLock size={14} className="text-primary" /> Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center py-4 mt-2">
            Sign In <FiArrowRight />
          </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-text-secondary">
          Don&apos;t have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

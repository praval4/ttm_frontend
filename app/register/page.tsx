"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiShield, FiArrowRight } from 'react-icons/fi';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) router.push('/login');
      else setError(data.message || 'Registration failed');
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center py-20 min-h-[80vh]">
      <div className="glass p-10 w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
          <p className="text-text-secondary">Join your team and start tracking</p>
        </div>
        
        {error && <div className="mb-6 p-3 bg-danger/10 border border-danger/20 text-danger text-center text-sm rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <FiUser size={14} className="text-primary" /> Full Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <FiMail size={14} className="text-primary" /> Email Address
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="name@company.com"
              value={email}
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <FiShield size={14} className="text-primary" /> Assign Role
            </label>
            <select
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', cursor: 'pointer' }}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center py-4 mt-2">
            Create Account <FiArrowRight />
          </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

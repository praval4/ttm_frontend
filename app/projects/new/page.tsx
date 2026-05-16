"use client";

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NewProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        router.push('/projects');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create project');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  if (!user || user.role !== 'Admin') {
    return <div className="text-center mt-8">Not authorized</div>;
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Create New Project</h2>
        {error && <div className="mb-4" style={{ color: 'var(--danger)' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Project Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-between items-center mt-6">
            <button type="button" onClick={() => router.back()} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

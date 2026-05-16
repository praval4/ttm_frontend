"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';

export default function NewTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const [projects, setProjects] = useState<{_id: string, name: string}[]>([]);
  const [members, setMembers] = useState<{_id: string, name: string, email: string}[]>([]);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === 'Admin') {
      const headers = { 'Authorization': `Bearer ${user.token}` };

      Promise.all([
        fetch('http://localhost:5000/api/projects', { headers }).then(res => res.json()),
        fetch('http://localhost:5000/api/auth/users', { headers }).then(res => res.json())
      ])
        .then(([projectsData, membersData]) => {
          const projectList = Array.isArray(projectsData) ? projectsData : [];
          const memberList = Array.isArray(membersData) ? membersData : [];

          setProjects(projectList);
          setMembers(memberList);
          if (projectList.length > 0) setProjectId(projectList[0]._id);
          if (memberList.length > 0) setAssigneeId(memberList[0]._id);
        })
        .catch(() => setError('Failed to load task form data'));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ title, description, project: projectId, assignee: assigneeId, deadline }),
      });

      if (res.ok) {
        router.push('/tasks');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create task');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  if (!user || user.role !== 'Admin') {
    return <div className="text-center mt-8">Not authorized</div>;
  }

  return (
    <div className="flex justify-center mt-8 animate-fade-in">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
        <div className="flex items-center gap-3 mb-8 pb-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>
          <FiPlusCircle className="text-primary text-3xl" />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Create New Task</h2>
            <p className="text-sm text-muted">Add a new task to an existing project.</p>
          </div>
        </div>
        
        {error && <div className="mb-6 p-3 bg-danger/20 text-danger rounded border border-danger/30 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="input-group">
            <label className="font-semibold mb-1 text-sm">Task Title</label>
            <input
              type="text"
              className="input-field w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Landing Page"
              required
            />
          </div>
          
          <div className="input-group">
            <label className="font-semibold mb-1 text-sm">Project</label>
            <select
              className="input-field w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none transition-colors appearance-none"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
            >
              {projects.length === 0 && <option value="">No projects available</option>}
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="font-semibold mb-1 text-sm">Assign To</label>
            <select
              className="input-field w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none transition-colors appearance-none"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
            >
              {members.length === 0 && <option value="">No members available</option>}
              {members.map(member => (
                <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label className="font-semibold mb-1 text-sm">Deadline</label>
            <input
              type="date"
              className="input-field w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none transition-colors"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              style={{ colorScheme: 'dark' }}
            />
          </div>
          
          <div className="input-group">
            <label className="font-semibold mb-1 text-sm">Description (Optional)</label>
            <textarea
              className="input-field w-full p-3 rounded bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none transition-colors resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task details..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-6" style={{ borderTop: '1px solid var(--glass-border)' }}>
            <button type="button" onClick={() => router.back()} className="btn flex items-center gap-2 hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <FiArrowLeft /> Cancel
            </button>
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <FiPlusCircle /> Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

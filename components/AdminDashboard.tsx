"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { FiFileText, FiTrello, FiFolder, FiActivity, FiArrowRight } from 'react-icons/fi';

interface Project {
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  title: string;
  progress: number;
  assignee: { name: string };
  project: { name: string };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user) return;
      try {
        const headers = { 'Authorization': `Bearer ${user.token}` };
        const [projRes, taskRes] = await Promise.all([
          fetch('http://localhost:5000/api/projects', { headers }),
          fetch('http://localhost:5000/api/tasks', { headers })
        ]);
        if (projRes.ok) {
          const projectsData = await projRes.json();
          setProjects(Array.isArray(projectsData) ? projectsData : []);
        }
        if (taskRes.ok) {
          const tasksData = await taskRes.json();
          setTasks(Array.isArray(tasksData) ? tasksData : []);
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user]);

  if (loading) return <div className="p-20 text-center"><FiActivity className="animate-spin inline text-primary" size={40}/></div>;

  return (
    <div className="animate-fade-in container">
      <div className="mb-12">
        <h1 className="text-5xl font-black mb-2 text-white tracking-tighter">Command Center</h1>
        <p className="text-text-secondary text-xl font-medium">Manage projects, track tasks, and oversee team performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/projects" className="glass p-8 flex flex-col group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <FiFolder size={28} />
            </div>
            <FiArrowRight size={24} className="text-text-secondary group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Projects</h3>
          <p className="text-text-secondary mb-8 text-sm font-medium">Manage workspaces and team project structures.</p>
          <div className="flex items-end gap-2 mt-auto">
             <span className="text-3xl font-black text-white">{projects.length}</span>
             <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Active</span>
          </div>
        </Link>

        <Link href="/tasks" className="glass p-8 flex flex-col group" style={{ borderTop: '4px solid #10b981' }}>
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-success rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: '#10b981' }}>
              <FiFileText size={28} />
            </div>
            <FiArrowRight size={24} className="text-text-secondary group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Tasks</h3>
          <p className="text-text-secondary mb-8 text-sm font-medium">Review, update, and assign work across the team.</p>
          <div className="flex items-end gap-2 mt-auto">
             <span className="text-3xl font-black text-white">{tasks.length}</span>
             <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total</span>
          </div>
        </Link>

        <Link href="/tasks/board" className="glass p-8 flex flex-col group" style={{ borderTop: '4px solid #f59e0b' }}>
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-warning rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: '#f59e0b' }}>
              <FiTrello size={28} />
            </div>
            <FiArrowRight size={24} className="text-text-secondary group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Task Status</h3>
          <p className="text-text-secondary mb-8 text-sm font-medium">Visual Kanban workflow for real-time status tracking.</p>
          <div className="flex items-end gap-2 mt-auto">
             <span className="text-3xl font-black text-white">Board</span>
             <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Live</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

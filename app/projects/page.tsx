"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { FiFolder, FiPlusCircle, FiUsers, FiArrowRight, FiActivity } from 'react-icons/fi';

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: { name: string; email: string };
  members: Array<{ _id?: string; name?: string; email?: string }>;
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/projects', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          setProjects(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user || loading) return <div className="p-20 text-center"><FiActivity className="animate-spin inline text-primary" size={40}/></div>;

  return (
    <div className="animate-fade-in container">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Projects</h1>
          <p className="text-text-secondary text-xl font-medium">Workspaces and team project management.</p>
        </div>
        {user.role === 'Admin' && (
          <Link href="/projects/new" className="btn btn-primary px-6 py-3">
            <FiPlusCircle /> New Project
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project._id} className="glass p-8 flex flex-col group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <FiFolder size={24} />
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-full text-text-secondary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <FiUsers size={12} /> {project.members?.length || 0}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
            <p className="text-text-secondary text-sm font-medium line-clamp-2 mb-8">{project.description || 'No description provided.'}</p>
            
            <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white uppercase">
                  {project.owner?.name?.charAt(0)}
                </div>
                <span className="text-xs font-bold text-white">{project.owner?.name}</span>
              </div>
              <Link href="/tasks/board" className="text-primary hover:text-white transition-colors">
                <FiArrowRight size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

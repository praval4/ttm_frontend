"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiFolder, FiActivity } from 'react-icons/fi';

interface Project {
  _id: string;
  name: string;
  description: string;
}

export default function MemberDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const headers = { 'Authorization': `Bearer ${user.token}` };
        const projRes = await fetch('http://localhost:5000/api/projects', { headers });
        if (projRes.ok) {
          const projectsData = await projRes.json();
          setProjects(Array.isArray(projectsData) ? projectsData : []);
        }
      } catch (err) {
        console.error("Failed to fetch member data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="p-20 text-center"><FiActivity className="animate-spin inline text-primary" size={40}/></div>;

  return (
    <div className="animate-fade-in container">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-text-secondary text-xl font-medium">Here are your active projects.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-12">
        <div className="glass p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FiFolder className="text-primary" /> Active Projects
          </h2>
          <div className="flex flex-col gap-4">
            {projects.length === 0 ? (
              <p className="text-text-secondary text-sm font-medium">No projects assigned.</p>
            ) : (
              projects.map(project => (
                <div key={project._id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-bold text-white">{project.name}</div>
                  <div className="text-xs text-text-secondary mt-1">{project.description}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

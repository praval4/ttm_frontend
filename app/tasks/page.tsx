"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { FiClock, FiUser, FiFolder, FiPlusCircle, FiActivity } from 'react-icons/fi';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  project: { _id: string; name: string };
  assignee: { _id: string; name: string };
  deadline: string;
}

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'Review' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Not Done', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
];

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/tasks', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          setTasks(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    let progressUpdate = undefined;
    if (newStatus === 'Completed') progressUpdate = 100;
    if (newStatus === 'Todo') progressUpdate = 0;

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status: newStatus, progress: progressUpdate })
      });
      if (res.ok) {
        setTasks(currentTasks => currentTasks.map(t => t._id === taskId ? { 
          ...t, 
          status: newStatus, 
          progress: progressUpdate !== undefined ? progressUpdate : t.progress 
        } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || loading) return <div className="p-20 text-center"><FiActivity className="animate-spin inline text-primary" size={40}/></div>;

  return (
    <div className="animate-fade-in container">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Tasks</h1>
          <p className="text-text-secondary text-xl font-medium">Manage team workload and track progress.</p>
        </div>
        {user.role === 'Admin' && (
          <Link href="/tasks/new" className="btn btn-primary px-6 py-3">
            <FiPlusCircle /> New Task
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {tasks.map(task => (
          <div key={task._id} className="glass p-6 flex flex-col md:flex-row justify-between items-center group">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
                <span className="flex items-center gap-1.5"><FiFolder className="text-primary"/> {task.project?.name}</span>
                <span className="flex items-center gap-1.5"><FiUser className="text-primary"/> {task.assignee?.name}</span>
                <span className="flex items-center gap-1.5"><FiClock className="text-primary"/> {new Date(task.deadline).toLocaleDateString()}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{task.title}</h3>
              <div className="flex items-center gap-4 max-w-sm">
                <span className="text-[10px] font-black text-primary w-8">{task.progress || 0}%</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${task.progress || 0}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto mt-6 md:mt-0">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white border border-white/10 cursor-pointer"
                disabled={user.role !== 'Admin' && task.assignee?._id !== user._id}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

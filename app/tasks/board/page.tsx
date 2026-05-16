"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { FiPlusCircle, FiClock, FiActivity } from 'react-icons/fi';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  estimatedHours: number;
  tags: string[];
  deadline?: string;
  assignee?: { name: string; email: string; _id: string };
  project?: { name: string; _id: string };
}

const COLUMNS = ['Todo', 'In Progress', 'Review', 'Completed'] as const;
type TaskStatus = typeof COLUMNS[number];

export default function KanbanBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tasks', {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus as TaskStatus } : t));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = tasks.find(t => t._id === taskId);
      if (task && task.status !== status) {
        updateTaskStatus(taskId, status);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#94a3b8';
    }
  };

  if (!user || loading) return <div className="p-20 text-center"><FiActivity className="animate-spin inline text-primary" size={40}/></div>;

  return (
    <div className="animate-fade-in container">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Task Status</h1>
          <p className="text-text-secondary text-xl font-medium">Drag and drop workflow tracking.</p>
        </div>
        <Link href="/tasks/new" className="btn btn-primary px-6 py-3">
          <FiPlusCircle /> New Task
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar items-start">
        {COLUMNS.map(column => (
          <div 
            key={column} 
            className="glass bg-white/[0.02] p-6 flex flex-col min-w-[300px]"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column)}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">{column}</h3>
              <div className="w-8 h-8 rounded-full bg-white/5 text-xs font-bold flex items-center justify-center text-primary">
                {tasks.filter(t => (t.status || 'Todo') === column).length}
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {tasks.filter(t => (t.status || 'Todo') === column).map(task => (
                <div 
                  key={task._id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, task._id)}
                  className="glass p-4 cursor-grab active:cursor-grabbing hover:border-primary/50"
                  style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}`, borderRadius: '12px' }}
                >
                  <h4 className="font-bold text-sm text-white mb-2">{task.title}</h4>
                  <div className="text-[10px] text-primary font-black mb-4 uppercase tracking-widest">{task.project?.name}</div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.tags?.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                        {task.assignee?.name?.charAt(0)}
                      </div>
                      <span className="text-[10px] font-bold text-text-secondary uppercase">
                        {task.assignee?.name?.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-secondary font-bold flex items-center gap-1">
                       <FiClock size={10} /> {task.deadline && new Date().toLocaleDateString() === new Date(task.deadline).toLocaleDateString() ? 'Today' : 'Soon'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

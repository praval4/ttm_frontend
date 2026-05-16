"use client";

import { useAuth } from '../../context/AuthContext';
import AdminDashboard from '../../components/AdminDashboard';
import MemberDashboard from '../../components/MemberDashboard';

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-[50vh]">Loading dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      {user.role === 'Admin' ? <AdminDashboard /> : <MemberDashboard />}
    </div>
  );
}

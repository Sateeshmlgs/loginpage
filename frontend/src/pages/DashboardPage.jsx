import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ShieldCheck, Mail } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="glass-card animate-fade-in" style={{ maxWidth: '600px' }}>
      <h1 style={{ color: '#818cf8', fontSize: '3rem', margin: '2rem 0' }}>Hello Welcome My World</h1>
      
      <button onClick={logout} className="btn-primary" style={{ background: '#ef4444', marginTop: '1rem' }}>
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};

export default DashboardPage;

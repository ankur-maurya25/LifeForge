import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Cinematic RPG Header */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

// ============================================================
// InvestGuard — Main Application Component
// Orchestrates client-side routing, global state, layout framing,
// and compliance presentation across all 10 modules.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { BehaviorAnalysisPage } from './pages/BehaviorAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { JournalPage } from './pages/JournalPage';
import { PlannerPage } from './pages/PlannerPage';
import { LearnPage } from './pages/LearnPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const { isAuthenticated, isDemoMode } = useStore();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Default to landing page if not authenticated and not in demo mode
  const isLanding = currentPage === 'landing' || (!isAuthenticated && !isDemoMode);

  // Sync title
  useEffect(() => {
    document.title = `InvestGuard — ${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}`;
  }, [currentPage]);

  if (isLanding) {
    return <LandingPage onEnterApp={() => setCurrentPage('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'behavior':
        return <BehaviorAnalysisPage onNavigate={setCurrentPage} />;
      case 'alerts':
        return <AlertsPage onNavigate={setCurrentPage} />;
      case 'portfolio':
        return <PortfolioPage onNavigate={setCurrentPage} />;
      case 'transactions':
        return <TransactionsPage onNavigate={setCurrentPage} />;
      case 'journal':
        return <JournalPage onNavigate={setCurrentPage} />;
      case 'planner':
        return <PlannerPage onNavigate={setCurrentPage} />;
      case 'learn':
        return <LearnPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile drawer */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Page View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>

        {/* Mandatory Regulatory Compliance Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;

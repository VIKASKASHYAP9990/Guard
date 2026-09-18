import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { PortfolioPage } from './pages/PortfolioPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BehaviorAnalysisPage } from './pages/BehaviorAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { JournalPage } from './pages/JournalPage';
import { PlannerPage } from './pages/PlannerPage';
import { LearnPage } from './pages/LearnPage';
import { DocsPage } from './pages/DocsPage';

import {
  fetchPortfolio,
  fetchHoldings,
  fetchTransactions,
  addTransaction as apiAddTransaction,
  fetchBehaviorAnalysis,
  runBehaviorAnalysis as apiRunBehaviorAnalysis,
  fetchAlerts,
  updateAlertStatus as apiUpdateAlertStatus,
  fetchJournal,
  addJournal as apiAddJournal,
  fetchPlanner,
  savePlanner as apiSavePlanner,
  resetDemo as apiResetDemo
} from './services/api';

import { PortfolioSummary, Holding, Transaction, BehaviorAnalysisResult, Alert, JournalEntry, PlannerData } from './types';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Application Data States
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analysis, setAnalysis] = useState<BehaviorAnalysisResult | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [planner, setPlanner] = useState<PlannerData | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Load
  const loadAllData = async () => {
    try {
      const [pData, hData, tData, bData, aData, jData, plData] = await Promise.all([
        fetchPortfolio(),
        fetchHoldings(),
        fetchTransactions(),
        fetchBehaviorAnalysis(),
        fetchAlerts(),
        fetchJournal(),
        fetchPlanner(),
      ]);
      setPortfolio(pData);
      setHoldings(hData);
      setTransactions(tData);
      setAnalysis(bData);
      setAlerts(aData);
      setJournals(jData);
      setPlanner(plData);
    } catch (err) {
      console.error('Error loading data', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await apiRunBehaviorAnalysis();
      await loadAllData();
      addToast('success', `Pipeline completed: ${res.alerts_generated || '0'} alerts generated.`);
    } catch (err) {
      addToast('error', 'Pipeline execution failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTransaction = async (txData: {
    symbol: string;
    company: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    reason?: string;
    expected_holding_period?: string;
  }) => {
    try {
      await apiAddTransaction(txData);
      await loadAllData();
      addToast('success', `Trade execution saved for ${txData.symbol}. Behavior pipeline triggered.`);
    } catch (err) {
      addToast('error', 'Failed to save transaction.');
    }
  };

  const handleUpdateAlertStatus = async (id: number, status: 'Unread' | 'Reviewed' | 'Dismissed') => {
    try {
      await apiUpdateAlertStatus(id, status);
      await loadAllData();
      addToast('info', `Alert status updated to ${status}.`);
    } catch (err) {
      addToast('error', 'Failed to update alert.');
    }
  };

  const handleAddJournal = async (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>) => {
    try {
      await apiAddJournal(entry);
      await loadAllData();
      addToast('success', `Journal thesis saved for ${entry.symbol}.`);
    } catch (err) {
      addToast('error', 'Failed to save journal entry.');
    }
  };

  const handleSavePlanner = async (plannerData: {
    monthly_income: number;
    monthly_expenses: number;
    existing_savings: number;
    desired_contribution: number;
    horizon_years: number;
  }) => {
    try {
      const updated = await apiSavePlanner(plannerData);
      setPlanner(updated);
      addToast('success', 'Planner configuration updated.');
    } catch (err) {
      addToast('error', 'Failed to update planner.');
    }
  };

  const handleResetDemo = async () => {
    try {
      await apiResetDemo();
      await loadAllData();
      addToast('info', 'Demo environment reset to baseline state.');
    } catch (err) {
      addToast('error', 'Failed to reset demo environment.');
    }
  };

  if (currentRoute === 'landing') {
    return (
      <LandingPage
        onNavigate={(route) => setCurrentRoute(route)}
        onResetDemo={handleResetDemo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100 flex flex-col font-sans">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={(route) => setCurrentRoute(route)}
        alertsCount={alerts.filter((a) => a.status === 'Unread').length}
        transactionsCount={transactions.length}
        onResetDemo={handleResetDemo}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 flex flex-col">
        <Header
          currentRoute={currentRoute}
          onNavigate={(route) => setCurrentRoute(route)}
          onRunAnalysis={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentRoute === 'dashboard' && (
            <Dashboard
              portfolio={portfolio}
              analysis={analysis}
              alerts={alerts}
              transactions={transactions}
              onNavigate={(route) => setCurrentRoute(route)}
            />
          )}

          {currentRoute === 'portfolio' && (
            <PortfolioPage holdings={holdings} />
          )}

          {currentRoute === 'transactions' && (
            <TransactionsPage
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {currentRoute === 'analysis' && (
            <BehaviorAnalysisPage
              analysis={analysis}
              transactions={transactions}
              onRunAnalysis={handleRunAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}

          {currentRoute === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onUpdateStatus={handleUpdateAlertStatus}
              onNavigate={(route) => setCurrentRoute(route)}
            />
          )}

          {currentRoute === 'journal' && (
            <JournalPage
              journals={journals}
              onAddJournal={handleAddJournal}
            />
          )}

          {currentRoute === 'planner' && (
            <PlannerPage
              planner={planner}
              onSavePlanner={handleSavePlanner}
            />
          )}

          {currentRoute === 'learn' && (
            <LearnPage />
          )}

          {currentRoute === 'docs' && (
            <DocsPage />
          )}
        </main>

        <Footer onNavigate={(route) => setCurrentRoute(route)} />
      </div>
    </div>
  );
};

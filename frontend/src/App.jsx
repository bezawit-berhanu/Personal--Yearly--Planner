import { Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlannerContext } from './context/PlannerContext';
import { usePlanner } from './hooks/usePlanner';

import LoginRegister from './auth/LoginRegister';
import TopNavbar from './components/layout/TopNavbar';

import Dashboard from './components/views/Dashboard';
import GoalTracker from './components/views/GoalTracker';
import HabitTracker from './components/views/HabitTracker';
import HealthDashboard from './components/views/HealthDashboard';
import KpiDashboard from './components/views/KpiDashboard';
import GenericSection from './components/views/GenericSection';
import Journal from './components/views/Journal';
import Notes from './components/views/Notes';

import Files from './pages/Files';
import Cashflow from './pages/Finance/Cashflow';
import Budget from './pages/Finance/Budget';
import Appearance from './pages/Settings/Appearance';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in Bezawit's Planner OS:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      const displayMessage = typeof err === 'string'
        ? err
        : err?.message && typeof err.message === 'string'
          ? err.message
          : JSON.stringify(err || 'Unknown error occurred.');

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white border border-rose-200 p-8 rounded-sm shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900">Something went wrong</h2>
            <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-3 rounded-sm border border-rose-100 font-mono text-left overflow-auto max-h-32">
              {displayMessage}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn-primary text-xs w-full justify-center"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ActiveView({ tab }) {
  switch (tab) {
    case 'dashboard':       return <Dashboard />;
    case 'files':           return <Files />;
    case 'financeCashflow': return <Cashflow />;
    case 'financeBudget':   return <Budget />;
    case 'habits':          return <HabitTracker />;
    case 'goals':           return <GoalTracker />;
    case 'healthDashboard': return <HealthDashboard />;
    case 'kpiDashboard':    return <KpiDashboard />;
    case 'appearance':      return <Appearance />;
    case 'journal':
    case 'reflectionJournal':
    case 'journalingIdeas': return <Journal />;
    case 'notes':           return <Notes />;
    default:                return <GenericSection sectionId={tab} />;
  }
}

function MainAppContent() {
  const { user, loading } = useAuth();
  const planner = usePlanner(user);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
        Loading Planner OS...
      </div>
    );
  }

  if (!user) {
    return <LoginRegister />;
  }

  return (
    <PlannerContext.Provider value={planner}>
      <div className="min-h-screen flex flex-col app-wallpaper">
        <TopNavbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          <ActiveView tab={planner.activeTab} />
        </main>
        <footer className="py-4 text-center text-xs font-semibold text-slate-500 bg-white/60 backdrop-blur-md">
          {user?.name ? `${user.name}'s` : 'Personal'} 2027 Planner OS
        </footer>
      </div>
    </PlannerContext.Provider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <MainAppContent />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

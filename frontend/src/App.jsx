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

import Files from './pages/Files';
import Cashflow from './pages/Finance/Cashflow';
import Budget from './pages/Finance/Budget';
import Appearance from './pages/Settings/Appearance';

const SPECIAL_VIEWS = {
  dashboard:       <Dashboard />,
  files:           <Files />,
  financeCashflow: <Cashflow />,
  financeBudget:   <Budget />,
  habits:          <HabitTracker />,
  goals:           <GoalTracker />,
  healthDashboard: <HealthDashboard />,
  kpiDashboard:    <KpiDashboard />,
  appearance:      <Appearance />
};

function ActiveView({ tab }) {
  if (SPECIAL_VIEWS[tab]) return SPECIAL_VIEWS[tab];
  return <GenericSection sectionId={tab} />;
}

function MainAppContent() {
  const { user, loading } = useAuth();
  const planner = usePlanner();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
        Loading Bezawit's Planner OS...
      </div>
    );
  }

  if (!user) {
    return <LoginRegister />;
  }

  return (
    <PlannerContext.Provider value={planner}>
      <div className="min-h-screen flex flex-col bg-white app-wallpaper">
        <TopNavbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          <ActiveView tab={planner.activeTab} />
        </main>
        <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/80">
          Bezawit's 2027 Planner OS · Connected to TiDB Cloud Serverless Database
        </footer>
      </div>
    </PlannerContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainAppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

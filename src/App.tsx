import { useState, useEffect } from 'react'; // <-- useEffect එක මෙතනට එකතු කළා
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Pages & Components
import { HomePage } from './pages/HomePage'; 
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage'; 
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ClaimsPage } from './pages/ClaimsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// ── Protected Route Helper ────────────────────────────────
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { auth } = useApp();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── App Router ────────────────────────────────────────────
function InternalAppRouter() {
  const { auth } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const isAdmin = auth.user?.role === 'admin';

  const navigate = (page: string) => {
    // ── වෙනස 1: 'payments' එක මේ ලිස්ට් එකෙන් අයින් කළා (දැන් කස්ටමර්ටත් අවසර තියෙනවා) ──
    if (!isAdmin && ['customers', 'reports'].includes(page)) return;
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={navigate} />;
      case 'customers': return isAdmin ? <CustomersPage /> : <DashboardPage onNavigate={navigate} />;
      case 'vehicles': return <VehiclesPage />;
      case 'policies': return <PoliciesPage />;
      
      // ── වෙනස 2: මෙතන තිබ්බ බ්ලොක් එක අයින් කරලා හැමෝටම PaymentsPage පේන්න හැදුවා ──
      case 'payments': return <PaymentsPage />;
      
      case 'claims': return <ClaimsPage />;
      case 'reports': return isAdmin ? <ReportsPage /> : <DashboardPage onNavigate={navigate} />;
      case 'notifications': return <NotificationsPage />;
      case 'profile': return <ProfilePage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onNavigate={navigate}>
      {renderPage()}
    </MainLayout>
  );
}

// ── Root App ──────────────────────────────────────────────
export default function App() {

  // ── 🔒 බ්‍රව්සර් ටැබ් එකට ලෝගෝ එක ඉබේම දාන කෝඩ් එක මෙතනට දැම්මා ──
  useEffect(() => {
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <rect width="24" height="24" rx="5" fill="#1d4ed8"/>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(255,255,255,0.15)" stroke="#ffffff" stroke-width="1.2"/>
        <path d="M9 12l2 2 4-4" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const blob = new Blob([svgIcon], { type: 'image/svg+xml' });
    const iconUrl = URL.createObjectURL(blob);

    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = iconUrl;
    
    document.title = "MotorShield LK — Motor Insurance";
  }, []);
  // ────────────────────────────────────────────────────────

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* සාමාන්‍ය අයට බලන්න පුළුවන් Home Page එක */}
          <Route path="/" element={<HomePage />} />
          
          {/* Login Page එක */}
          <Route path="/login" element={<LoginPage />} />

          {/* Register Page එක */}
          <Route path="/register" element={<RegisterPage />} />

          {/* ලොග් වුනාට පස්සේ යන ප්‍රධාන App එක */}
          <Route 
            path="/app" 
            element = {
              <ProtectedRoute>
                <InternalAppRouter />
              </ProtectedRoute>
            } 
          />

          {/* වැරදි URL එකක් ගැහුවොත් Home එකට යවනවා */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
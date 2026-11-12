import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MapsSection } from './components/MapsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ControlsModal } from './components/ControlsModal';
import { SupportModal } from './components/SupportModal';
import { AdminMailboxModal } from './components/AdminMailboxModal';
import { AuthGate, AuthUser } from './components/AuthGate';
import { Footer } from './components/Footer';
import { useDevToolsBlocker } from './hooks/useDevToolsBlocker';
import { ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('surfplay_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('surfplay_token');
    } catch {
      return null;
    }
  });

  const [controlsOpen, setControlsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [adminMailboxOpen, setAdminMailboxOpen] = useState(false);
  const [unreadAdminCount, setUnreadAdminCount] = useState(0);

  // F12 & DevTools protection hook
  const { warningMessage, clearWarning } = useDevToolsBlocker();

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('surfplay_favorites');
      return saved ? JSON.parse(saved) : ['barcelona'];
    } catch {
      return ['barcelona'];
    }
  });

  // Keep track of admin messages if current user is Ratão (using signed JWT authorization)
  useEffect(() => {
    if (currentUser?.role === 'admin' && authToken) {
      const checkMessages = async () => {
        try {
          const res = await fetch('/api/admin/messages', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            const unread = (data.messages || []).filter((m: any) => !m.isRead).length;
            setUnreadAdminCount(unread);
          }
        } catch (e) {
          console.warn('Failed to fetch admin unread count', e);
        }
      };

      checkMessages();
      const interval = setInterval(checkMessages, 25000);
      return () => clearInterval(interval);
    } else {
      setUnreadAdminCount(0);
    }
  }, [currentUser, authToken]);

  useEffect(() => {
    try {
      localStorage.setItem('surfplay_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const handleLoginSuccess = (user: AuthUser, token?: string) => {
    setCurrentUser(user);
    if (token) {
      setAuthToken(token);
      try {
        localStorage.setItem('surfplay_token', token);
      } catch (e) {
        console.warn('Failed to save auth token', e);
      }
    }
    try {
      localStorage.setItem('surfplay_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user session', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    try {
      localStorage.removeItem('surfplay_user');
      localStorage.removeItem('surfplay_token');
    } catch (e) {
      console.warn('Failed to remove user session', e);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* DevTools / F12 Warning Banner */}
      {warningMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] bg-rose-950/95 border border-rose-500/80 text-rose-200 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <ShieldAlert size={20} className="text-rose-400 shrink-0" />
            <span>{warningMessage}</span>
          </div>
          <button
            onClick={clearWarning}
            className="text-rose-300 hover:text-white p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Mandatory Auth Gate: If not logged in, cannot enter the site */}
      {!currentUser ? (
        <AuthGate onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* Navbar Header */}
          <Navbar
            onOpenControls={() => setControlsOpen(true)}
            onOpenSupport={() => setSupportOpen(true)}
            onOpenAdminMailbox={() => setAdminMailboxOpen(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
            unreadAdminCount={unreadAdminCount}
          />

          {/* Main Content */}
          <main className="flex-1">
            {/* Hero Section */}
            <Hero
              onOpenControls={() => setControlsOpen(true)}
              onOpenSupport={() => setSupportOpen(true)}
            />

            {/* Maps Section */}
            <MapsSection
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            {/* Features / Advantages Section */}
            <FeaturesSection />
          </main>

          {/* Footer */}
          <Footer onOpenControls={() => setControlsOpen(true)} />

          {/* Subway Surfers Controls Modal */}
          <ControlsModal
            isOpen={controlsOpen}
            onClose={() => setControlsOpen(false)}
          />

          {/* Support Modal */}
          <SupportModal
            isOpen={supportOpen}
            onClose={() => setSupportOpen(false)}
            currentUser={currentUser}
            authToken={authToken}
          />

          {/* Admin Mailbox Modal (Exclusive to authenticated admin) */}
          {currentUser?.role === 'admin' && authToken && (
            <AdminMailboxModal
              isOpen={adminMailboxOpen}
              onClose={() => setAdminMailboxOpen(false)}
              currentUser={currentUser}
              authToken={authToken}
              onUnreadChange={(count) => setUnreadAdminCount(count)}
            />
          )}
        </>
      )}
    </div>
  );
}

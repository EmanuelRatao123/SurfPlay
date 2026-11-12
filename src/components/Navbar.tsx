import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
  Menu,
  X,
  Compass,
  Gamepad2,
  Sparkles,
  MessageSquare,
  Inbox,
  LogOut,
  User,
  ShieldAlert,
  Crown,
} from 'lucide-react';
import { AuthUser } from './AuthGate';

interface NavbarProps {
  onOpenControls: () => void;
  onOpenSupport: () => void;
  onOpenAdminMailbox: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  unreadAdminCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenControls,
  onOpenSupport,
  onOpenAdminMailbox,
  currentUser,
  onLogout,
  unreadAdminCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Mapas', href: '#mapas' },
    { label: 'Vantagens', href: '#vantagens' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0e17]/90 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-black/40 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#inicio');
            }}
            className="group flex items-center transition-transform hover:scale-[1.02]"
            aria-label="SurfPlay - Página Inicial"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white rounded-full transition-colors hover:bg-slate-800/80"
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={onOpenControls}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200 rounded-full transition-colors hover:bg-cyan-950/40 cursor-pointer"
              aria-label="Abrir guia de controles"
            >
              <Gamepad2 size={16} />
              <span>Controles</span>
            </button>

            {/* Suporte Button */}
            <button
              onClick={onOpenSupport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-sky-300 hover:text-white rounded-full transition-colors hover:bg-sky-950/40 cursor-pointer"
              aria-label="Falar com o suporte"
            >
              <MessageSquare size={15} />
              <span>Suporte</span>
            </button>

            {/* Admin Exclusive Mailbox Button */}
            {isAdmin && (
              <button
                onClick={onOpenAdminMailbox}
                className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold text-purple-300 bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/60 rounded-full transition-colors cursor-pointer"
                aria-label="Abrir caixa postal do administrador"
              >
                <Inbox size={15} className="text-purple-400" />
                <span>Caixa Postal ADM</span>
                {unreadAdminCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-[10px] font-black flex items-center justify-center animate-pulse">
                    {unreadAdminCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Desktop User Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                {isAdmin ? (
                  <div className="flex items-center gap-1 text-purple-300 font-bold">
                    <Crown size={14} className="text-yellow-400" />
                    <span>ADM {currentUser.username}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-cyan-300 font-bold">
                    <User size={14} />
                    <span>{currentUser.username}</span>
                  </div>
                )}

                <button
                  onClick={onLogout}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                  title="Sair da conta"
                  aria-label="Sair da conta"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}

            <a
              href="#mapas"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#mapas');
              }}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 ring-1 ring-cyan-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass size={17} />
              <span>JOGAR AGORA</span>
            </a>
          </div>

          {/* Mobile Action Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSupport}
              className="p-2 text-sky-400 bg-slate-900/80 border border-slate-800 rounded-lg hover:bg-slate-800"
              aria-label="Abrir suporte"
              title="Suporte"
            >
              <MessageSquare size={19} />
            </button>

            {isAdmin && (
              <button
                onClick={onOpenAdminMailbox}
                className="relative p-2 text-purple-400 bg-purple-950/60 border border-purple-500/40 rounded-lg"
                aria-label="Caixa postal ADM"
                title="Caixa postal"
              >
                <Inbox size={19} />
                {unreadAdminCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-black text-[9px] font-black flex items-center justify-center">
                    {unreadAdminCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b0e17]/95 border-b border-slate-800 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 mt-2">
          {currentUser && (
            <div className="p-3 mb-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isAdmin ? <Crown size={16} className="text-yellow-400" /> : <User size={16} className="text-cyan-400" />}
                <span className="text-sm font-bold text-white">
                  {isAdmin ? `ADM ${currentUser.username}` : currentUser.username}
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs text-rose-400 font-semibold flex items-center gap-1"
              >
                <LogOut size={13} />
                Sair
              </button>
            </div>
          )}

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="block px-4 py-2.5 text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSupport();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-base font-medium text-sky-300 hover:bg-sky-950/40 rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <MessageSquare size={18} />
              Enviar Mensagem de Suporte
            </span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminMailbox();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-base font-bold text-purple-300 hover:bg-purple-950/50 rounded-xl transition-colors"
            >
              <span className="flex items-center gap-2">
                <Inbox size={18} />
                Caixa Postal do ADM
              </span>
              {unreadAdminCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-black text-xs font-black">
                  {unreadAdminCount} novas
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenControls();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-base font-medium text-cyan-300 hover:bg-cyan-950/40 rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <Gamepad2 size={18} />
              Como Jogar (Controles)
            </span>
            <Sparkles size={16} />
          </button>

          <div className="pt-2">
            <a
              href="#mapas"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#mapas');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 shadow-lg shadow-cyan-500/20"
            >
              <Compass size={18} />
              EXPLORAR MAPAS
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

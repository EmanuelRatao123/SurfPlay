import React, { useState } from 'react';
import { Logo } from './Logo';
import { User, Sparkles, AlertCircle, ArrowRight, UserPlus, LogIn, KeyRound } from 'lucide-react';

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

interface AuthGateProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setError('Por favor, digite seu nome de jogador exclusivo para entrar.');
      return;
    }

    if (!password) {
      setError('Por favor, informe a senha.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha na autenticação.');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090f] overflow-y-auto">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 backdrop-blur-xl z-10">
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" className="mb-3" />
          <h2 className="font-display text-2xl font-black uppercase text-white tracking-tight">
            Acesso Obrigatório
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Escolha um nome exclusivo de jogador para entrar no SurfPlay
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn size={16} />
            <span>Já Tenho Conta</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus size={16} />
            <span>Nome Exclusivo</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm animate-shake">
            <AlertCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Nome de Jogador</span>
              {mode === 'register' && (
                <span className="text-[11px] text-cyan-400 normal-case font-medium">
                  Deve ser exclusivo
                </span>
              )}
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: SurfMaster ou Runner"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <KeyRound
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-300/40 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Verificando...</span>
            ) : mode === 'login' ? (
              <>
                <span>ENTRAR NA PLATAFORMA</span>
                <ArrowRight size={17} />
              </>
            ) : (
              <>
                <span>CRIAR CONTA & ENTRAR</span>
                <Sparkles size={17} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

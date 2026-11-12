import React, { useState, useEffect } from 'react';
import { X, Mail, Inbox, Trash2, CheckCircle, RefreshCw, Clock, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { AuthUser } from './AuthGate';

interface SupportMessageItem {
  id: number;
  senderName: string;
  senderUserId?: number;
  subject: string;
  message: string;
  isRead: boolean;
  status: string;
  createdAt: string;
}

interface AdminMailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onUnreadChange?: (unreadCount: number) => void;
}

export const AdminMailboxModal: React.FC<AdminMailboxModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUnreadChange,
}) => {
  const [messages, setMessages] = useState<SupportMessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessageItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchMessages = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/messages', {
        headers: {
          'x-admin-user': currentUser.username,
          'x-admin-role': currentUser.role,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao carregar mensagens.');
      }

      setMessages(data.messages || []);
      const unreadCount = (data.messages || []).filter((m: SupportMessageItem) => !m.isRead).length;
      if (onUnreadChange) onUnreadChange(unreadCount);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar mensagens do servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          'x-admin-user': currentUser?.username || '',
          'x-admin-role': currentUser?.role || '',
        },
      });

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
      );

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isRead: true } : null));
      }

      const newUnread = messages.filter((m) => m.id !== id && !m.isRead).length;
      if (onUnreadChange) onUnreadChange(newUnread);
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente apagar esta mensagem da caixa postal?')) return;

    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-user': currentUser?.username || '',
          'x-admin-role': currentUser?.role || '',
        },
      });

      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (e) {
      console.error('Failed to delete message', e);
    }
  };

  if (!isOpen) return null;

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return !m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Inbox size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Caixa Postal do Administrador
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <ShieldCheck size={13} />
                  {currentUser?.username || 'ADM'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Acesso exclusivo: mensagens enviadas pelos usuários via suporte
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMessages}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Atualizar caixa postal"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              aria-label="Fechar caixa postal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                filter === 'unread'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Não lidas</span>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-black text-[10px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <span className="text-slate-500 text-xs hidden sm:inline">
            Clique na mensagem para abrir os detalhes
          </span>
        </div>

        {/* Body (Split View) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Message List */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/60 bg-slate-950/20">
            {loading && messages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Carregando caixa postal...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">
                <Mail size={32} className="mx-auto mb-2 opacity-40" />
                <p>Nenhuma mensagem nesta caixa.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.isRead) handleMarkAsRead(msg.id);
                  }}
                  className={`p-4 cursor-pointer transition-colors relative hover:bg-slate-800/50 ${
                    selectedMessage?.id === msg.id ? 'bg-slate-800/80 border-l-4 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-white flex items-center gap-1.5">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                      {msg.senderName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-cyan-300 mb-1 truncate">
                    {msg.subject}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="md:col-span-7 flex flex-col h-full overflow-y-auto p-5 sm:p-6 bg-slate-900/60">
            {selectedMessage ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h4 className="font-display text-xl font-bold text-white mb-1">
                      {selectedMessage.subject}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <User size={14} className="text-cyan-400" />
                        Remetente: <strong className="text-white">{selectedMessage.senderName}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(selectedMessage.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900 rounded-xl transition-colors cursor-pointer"
                    title="Excluir mensagem"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>

                <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Status: {selectedMessage.isRead ? 'Visualizada pelo ADM' : 'Não visualizada'}</span>
                  {!selectedMessage.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      <CheckCircle size={14} />
                      Marcar como Lida
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Inbox size={48} className="mb-3 opacity-30 text-purple-400" />
                <h4 className="font-display text-base font-bold text-slate-400">
                  Selecione uma mensagem
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Selecione qualquer mensagem da lista ao lado para ler o conteúdo enviado pelo jogador.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

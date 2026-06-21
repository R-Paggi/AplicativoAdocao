import { supabase } from '@/lib/supabase';

export interface Notificacao {
  notificacao_id: string;
  user_id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  solicitacao_id: string | null;
  lida: boolean;
  dt_criacao: string;
}

export async function listarNotificacoes(): Promise<Notificacao[]> {
  const { data: usuario } = await supabase.auth.getUser();
  const userId = usuario.user?.id;
  if (!userId) throw new Error('Você precisa estar logado.');

  const { data, error } = await supabase
    .from('notificacoes')
    .select('*')
    .eq('user_id', userId)
    .order('dt_criacao', { ascending: false });

  if (error) throw new Error('Erro ao buscar notificações: ' + error.message);
  return data ?? [];
}

export async function contarNaoLidas(): Promise<number> {
  const { data: usuario } = await supabase.auth.getUser();
  const userId = usuario.user?.id;
  if (!userId) return 0;

  const { count, error } = await supabase
    .from('notificacoes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('lida', false);

  if (error) throw new Error('Erro ao contar notificações: ' + error.message);
  return count ?? 0;
}

export async function marcarComoLida(notificacaoId: string) {
  const { error } = await supabase
    .from('notificacoes')
    .update({ lida: true })
    .eq('notificacao_id', notificacaoId);
  if (error) throw new Error('Erro ao marcar notificação: ' + error.message);
}

export async function marcarTodasComoLidas() {
  const { data: usuario } = await supabase.auth.getUser();
  const userId = usuario.user?.id;
  if (!userId) return;

  const { error } = await supabase
    .from('notificacoes')
    .update({ lida: true })
    .eq('user_id', userId)
    .eq('lida', false);
  if (error) throw new Error('Erro ao marcar notificações: ' + error.message);
}

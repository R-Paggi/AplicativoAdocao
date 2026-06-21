import { supabase } from '@/lib/supabase';
import type { SolicitacaoAdocao, StatusSolicitacao } from '@/types/database';

export async function criarSolicitacao(animalId: string, mensagem: string) {
  const { data: usuario } = await supabase.auth.getUser();
  const solicitanteId = usuario.user?.id;
  if (!solicitanteId) {
    throw new Error('Você precisa estar logado para solicitar uma adoção.');
  }

  const { data: existente } = await supabase
    .from('solicitacoes_adocao')
    .select('solicitacao_id, status')
    .eq('animal_id', animalId)
    .eq('solicitante_id', solicitanteId)
    .in('status', ['pendente', 'em_analise'])
    .maybeSingle();

  if (existente) {
    throw new Error('Você já tem uma solicitação em andamento para este pet.');
  }

  const { data, error } = await supabase
    .from('solicitacoes_adocao')
    .insert({
      animal_id: animalId,
      solicitante_id: solicitanteId,
      mensagem: mensagem.trim() || null,
      status: 'pendente',
    })
    .select()
    .single();

  if (error) throw new Error('Erro ao enviar solicitação: ' + error.message);
  return data;
}

export async function listarMinhasSolicitacoes() {
  const { data: usuario } = await supabase.auth.getUser();
  const solicitanteId = usuario.user?.id;
  if (!solicitanteId) throw new Error('Você precisa estar logado.');

  const { data, error } = await supabase
    .from('solicitacoes_adocao')
    .select('*, animais(*)')
    .eq('solicitante_id', solicitanteId)
    .order('dt_criacao', { ascending: false });

  if (error) throw new Error('Erro ao buscar suas solicitações: ' + error.message);
  return data ?? [];
}

export async function listarSolicitacoesRecebidas() {
  const { data: usuario } = await supabase.auth.getUser();
  const doadorId = usuario.user?.id;
  if (!doadorId) throw new Error('Você precisa estar logado.');

  const { data: meusAnimais, error: erroAnimais } = await supabase
    .from('animais')
    .select('animal_id')
    .eq('doador_id', doadorId);

  if (erroAnimais) throw new Error('Erro ao buscar seus pets: ' + erroAnimais.message);
  if (!meusAnimais || meusAnimais.length === 0) return [];

  const idsAnimais = meusAnimais.map((a) => a.animal_id);

  const { data, error } = await supabase
    .from('solicitacoes_adocao')
    .select('*, animais(*)')
    .in('animal_id', idsAnimais)
    .order('dt_criacao', { ascending: false });

  if (error) throw new Error('Erro ao buscar solicitações recebidas: ' + error.message);
  if (!data) return [];

  const idsSolicitantes = [...new Set(data.map((s) => s.solicitante_id))];
  const { data: solicitantes } = await supabase
    .from('profiles')
    .select('id, nome, telefone')
    .in('id', idsSolicitantes);

  const mapaSolicitantes = new Map((solicitantes ?? []).map((p) => [p.id, p]));

  return data.map((solicitacao) => ({
    ...solicitacao,
    solicitante: mapaSolicitantes.get(solicitacao.solicitante_id) ?? null,
  }));
}

export async function atualizarStatusSolicitacao(
  solicitacaoId: string,
  status: StatusSolicitacao
): Promise<SolicitacaoAdocao> {
  const { data, error } = await supabase
    .from('solicitacoes_adocao')
    .update({ status })
    .eq('solicitacao_id', solicitacaoId)
    .select()
    .single();

  if (error) throw new Error('Erro ao atualizar solicitação: ' + error.message);

  if (status === 'aprovada' && data) {
    await supabase.from('animais').update({ status: 'em_processo' }).eq('animal_id', data.animal_id);
  }

  return data;
}

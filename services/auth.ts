import { supabase } from '@/lib/supabase';
import type { PerfilRole } from '@/types/database';

export interface CadastroInput {
  nome: string;
  email: string;
  senha: string;
  tipo: PerfilRole;
  telefone?: string;
  cidade?: string;
  estado?: string;
}

export async function login(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  });
  if (error) throw new Error(traduzErroAuth(error.message));
  return data;
}

export async function cadastrar(input: CadastroInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.senha,
    options: {
      data: {
        nome: input.nome.trim(),
      },
    },
  });
  if (error) throw new Error(traduzErroAuth(error.message));

  const userId = data.user?.id;
  if (!userId) {
    throw new Error('Não foi possível criar a conta. Tente novamente.');
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      tipo: input.tipo,
      telefone: input.telefone ?? null,
      cidade: input.cidade ?? null,
      estado: input.estado ?? null,
    })
    .eq('id', userId);

  if (profileError) {
    throw new Error('Conta criada, mas houve um erro ao salvar seu perfil: ' + profileError.message);
  }

  if (input.tipo === 'ong') {
    const { error: ongError } = await supabase.from('ongs').insert({
      perfil_id: userId,
    });
    if (ongError && ongError.code !== '23505') {
      throw new Error('Perfil criado, mas houve um erro ao registrar a ONG: ' + ongError.message);
    }
  }

  return data;
}

export interface AtualizarPerfilInput {
  nome: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  foto_url?: string;
  bio?: string;
}

export async function atualizarPerfil(input: AtualizarPerfilInput) {
  const { data: usuario } = await supabase.auth.getUser();
  const userId = usuario.user?.id;
  if (!userId) throw new Error('Você precisa estar logado.');

  const { data, error } = await supabase
    .from('profiles')
    .update({
      nome: input.nome.trim(),
      telefone: input.telefone?.trim() || null,
      cidade: input.cidade?.trim() || null,
      estado: input.estado?.trim().toUpperCase() || null,
      foto_url: input.foto_url?.trim() || null,
      bio: input.bio?.trim() || null,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error('Erro ao atualizar perfil: ' + error.message);
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getUsuarioAtual() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data.user;
}

export async function getSessao() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

function traduzErroAuth(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('user already registered')) return 'Já existe uma conta com esse e-mail.';
  if (m.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (m.includes('unable to validate email')) return 'E-mail inválido.';
  return mensagem;
}

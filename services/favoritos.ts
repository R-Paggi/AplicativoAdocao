import { supabase } from '@/lib/supabase';

export async function listarIdsFavoritos(): Promise<Set<string>> {
  const { data: usuario } = await supabase.auth.getUser();
  const userId = usuario.user?.id;
  if (!userId) return new Set();

  const { data, error } = await supabase.from('favoritos').select('animal_id').eq('user_id', userId);
  if (error) throw new Error('Erro ao buscar favoritos: ' + error.message);

  return new Set((data ?? []).map((f) => f.animal_id));
}

export async function favoritar(animalId: string) {
  const { data: usuario } = await supabase.auth.getUser();
  const userId = usuario.user?.id;
  if (!userId) throw new Error('Você precisa estar logado para favoritar.');

  const { error } = await supabase.from('favoritos').insert({
    user_id: userId,
    animal_id: animalId,
  });
  if (error && error.code !== '23505') {
    throw new Error('Erro ao favoritar: ' + error.message);
  }
}

export async function desfavoritar(animalId: string) {
  const { data: usuario } = await supabase.auth.getUser();
  const userId = usuario.user?.id;
  if (!userId) throw new Error('Você precisa estar logado.');

  const { error } = await supabase
    .from('favoritos')
    .delete()
    .eq('user_id', userId)
    .eq('animal_id', animalId);
  if (error) throw new Error('Erro ao remover favorito: ' + error.message);
}

export async function listarAnimaisFavoritados() {
  const { data: usuario } = await supabase.auth.getUser();
  const userId = usuario.user?.id;
  if (!userId) throw new Error('Você precisa estar logado.');

  const { data, error } = await supabase
    .from('favoritos')
    .select('favorito_id, dt_criacao, animais(*, fotos_animal(*))')
    .eq('user_id', userId)
    .order('dt_criacao', { ascending: false });

  if (error) throw new Error('Erro ao buscar favoritos: ' + error.message);
  return data ?? [];
}

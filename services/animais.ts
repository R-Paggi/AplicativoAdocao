import { supabase } from '@/lib/supabase';
import type { Animal, AnimalComFotos, EspecieAnimal, PorteAnimal, SexoAnimal } from '@/types/database';

export interface NovoAnimalInput {
  nome: string;
  especie: EspecieAnimal;
  raca?: string;
  porte: PorteAnimal;
  sexo: SexoAnimal;
  idade_meses?: number;
  descricao?: string;
  vacinado: boolean;
  castrado: boolean;
  vermifugado: boolean;
  cidade?: string;
  estado?: string;
}

export async function criarAnimal(input: NovoAnimalInput): Promise<Animal> {
  const { data: usuario } = await supabase.auth.getUser();
  const doadorId = usuario.user?.id;
  if (!doadorId) {
    throw new Error('Você precisa estar logado para cadastrar um pet.');
  }

  const { data, error } = await supabase
    .from('animais')
    .insert({
      doador_id: doadorId,
      nome: input.nome.trim(),
      especie: input.especie,
      raca: input.raca?.trim() || null,
      porte: input.porte,
      sexo: input.sexo,
      idade_meses: input.idade_meses ?? null,
      descricao: input.descricao?.trim() || null,
      vacinado: input.vacinado,
      castrado: input.castrado,
      vermifugado: input.vermifugado,
      cidade: input.cidade?.trim() || null,
      estado: input.estado?.trim().toUpperCase() || null,
      status: 'disponivel',
    })
    .select()
    .single();

  if (error) throw new Error('Erro ao cadastrar pet: ' + error.message);
  return data;
}

export async function adicionarFotoAnimal(animalId: string, url: string, principal: boolean) {
  const { error } = await supabase.from('fotos_animal').insert({
    animal_id: animalId,
    url,
    principal,
    ordem: 0,
  });
  if (error) throw new Error('Erro ao salvar foto do pet: ' + error.message);
}

export interface FiltrosAnimais {
  porte?: PorteAnimal;
  sexo?: SexoAnimal;
  idade?: 'filhote' | 'adulto';
}

export async function listarAnimaisDisponiveis(filtros?: FiltrosAnimais): Promise<AnimalComFotos[]> {
  let query = supabase.from('animais').select('*, fotos_animal(*)').eq('status', 'disponivel');

  if (filtros?.porte) {
    query = query.eq('porte', filtros.porte);
  }
  if (filtros?.sexo) {
    query = query.eq('sexo', filtros.sexo);
  }
  if (filtros?.idade === 'filhote') {
    query = query.lte('idade_meses', 12);
  } else if (filtros?.idade === 'adulto') {
    query = query.gt('idade_meses', 12);
  }

  const { data, error } = await query.order('dt_criacao', { ascending: false });

  if (error) throw new Error('Erro ao buscar pets: ' + error.message);
  return data ?? [];
}

export async function buscarAnimalPorId(animalId: string): Promise<AnimalComFotos | null> {
  const { data, error } = await supabase
    .from('animais')
    .select('*, fotos_animal(*)')
    .eq('animal_id', animalId)
    .single();

  if (error) throw new Error('Erro ao buscar pet: ' + error.message);
  return data;
}

export async function listarMeusAnimais(): Promise<AnimalComFotos[]> {
  const { data: usuario } = await supabase.auth.getUser();
  const doadorId = usuario.user?.id;
  if (!doadorId) throw new Error('Você precisa estar logado.');

  const { data, error } = await supabase
    .from('animais')
    .select('*, fotos_animal(*)')
    .eq('doador_id', doadorId)
    .order('dt_criacao', { ascending: false });

  if (error) throw new Error('Erro ao buscar seus pets: ' + error.message);
  return data ?? [];
}

export type PerfilRole = 'usuario' | 'ong';
export type EspecieAnimal = 'cao' | 'gato' | 'outro';
export type PorteAnimal = 'pequeno' | 'medio' | 'grande';
export type SexoAnimal = 'macho' | 'femea';
export type StatusAnimal = 'disponivel' | 'em_processo' | 'adotado' | 'inativo';
export type StatusSolicitacao =
  | 'pendente'
  | 'em_analise'
  | 'aprovada'
  | 'recusada'
  | 'cancelada';

export interface Profile {
  id: string; // uuid, igual ao auth.users.id
  nome: string;
  telefone: string | null;
  cidade: string | null;
  estado: string | null; // character (sigla, ex: "PR")
  foto_url: string | null;
  bio: string | null;
  tipo: PerfilRole;
  dt_criacao: string;
  dt_atualizacao: string;
}

export interface Ong {
  ong_id: string;
  perfil_id: string;
  cnpj: string | null;
  site: string | null;
  descricao: string | null;
  verificada: boolean;
  dt_criacao: string;
  dt_atualizacao: string;
}

export interface Animal {
  animal_id: string;
  doador_id: string;
  nome: string;
  especie: EspecieAnimal;
  raca: string | null;
  porte: PorteAnimal;
  sexo: SexoAnimal;
  idade_meses: number | null;
  descricao: string | null;
  vacinado: boolean;
  castrado: boolean;
  vermifugado: boolean;
  status: StatusAnimal;
  cidade: string | null;
  estado: string | null;
  dt_criacao: string;
  dt_atualizacao: string;
}

export interface FotoAnimal {
  foto_id: string;
  animal_id: string;
  url: string;
  principal: boolean;
  ordem: number;
  dt_criacao: string;
}

export interface Favorito {
  favorito_id: string;
  user_id: string;
  animal_id: string;
  dt_criacao: string;
}

export interface SolicitacaoAdocao {
  solicitacao_id: string;
  animal_id: string;
  solicitante_id: string;
  mensagem: string | null;
  status: StatusSolicitacao;
  dt_criacao: string;
  dt_atualizacao: string;
}

export interface AnimalComFotos extends Animal {
  fotos_animal?: FotoAnimal[];
}

export interface SolicitacaoComAnimal extends SolicitacaoAdocao {
  animais?: Animal;
}

export interface SolicitacaoComSolicitante extends SolicitacaoAdocao {
  profiles?: Profile;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; nome: string; tipo: PerfilRole };
        Update: Partial<Profile>;
      };
      ongs: {
        Row: Ong;
        Insert: Partial<Ong> & { perfil_id: string };
        Update: Partial<Ong>;
      };
      animais: {
        Row: Animal;
        Insert: Partial<Animal> & {
          doador_id: string;
          nome: string;
          especie: EspecieAnimal;
          porte: PorteAnimal;
          sexo: SexoAnimal;
        };
        Update: Partial<Animal>;
      };
      fotos_animal: {
        Row: FotoAnimal;
        Insert: Partial<FotoAnimal> & { animal_id: string; url: string };
        Update: Partial<FotoAnimal>;
      };
      favoritos: {
        Row: Favorito;
        Insert: Partial<Favorito> & { user_id: string; animal_id: string };
        Update: Partial<Favorito>;
      };
      solicitacoes_adocao: {
        Row: SolicitacaoAdocao;
        Insert: Partial<SolicitacaoAdocao> & { animal_id: string; solicitante_id: string };
        Update: Partial<SolicitacaoAdocao>;
      };
    };
  };
}

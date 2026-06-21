import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { listarAnimaisDisponiveis } from '@/services/animais';
import { getUsuarioAtual } from '@/services/auth';
import { desfavoritar, favoritar, listarIdsFavoritos } from '@/services/favoritos';
import { contarNaoLidas } from '@/services/notificacoes';
import { supabase } from '@/lib/supabase';
import type { AnimalComFotos } from '@/types/database';
import BottomMenu from './components/BottomMenu';

function fotoPrincipal(animal: AnimalComFotos): string {
  const principal = animal.fotos_animal?.find((f) => f.principal);
  const primeira = animal.fotos_animal?.[0];
  return (
    principal?.url ??
    primeira?.url ??
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=500'
  );
}

function rotuloEspecie(especie: AnimalComFotos['especie']): string {
  if (especie === 'cao') return 'Cão';
  if (especie === 'gato') return 'Gato';
  return 'Outro';
}

function rotuloStatus(status: AnimalComFotos['status']): { texto: string; cor: string } {
  switch (status) {
    case 'disponivel':
      return { texto: 'DISPONÍVEL', cor: '#B0C4DE' };
    case 'em_processo':
      return { texto: 'EM PROCESSO', cor: '#FFE4E1' };
    case 'adotado':
      return { texto: 'ADOTADO', cor: '#D3D3D3' };
    default:
      return { texto: 'INATIVO', cor: '#D3D3D3' };
  }
}

const PetCard = ({
  animal,
  favorito,
  onPress,
  onToggleFavorito,
}: {
  animal: AnimalComFotos;
  favorito: boolean;
  onPress: () => void;
  onToggleFavorito: () => void;
}) => {
  const status = rotuloStatus(animal.status);

  return (
    <TouchableOpacity style={styles.petCard} onPress={onPress}>
      <Image source={{ uri: fotoPrincipal(animal) }} style={styles.petImage} />
      <TouchableOpacity style={styles.favIcon} onPress={onToggleFavorito}>
        <Ionicons
          name={favorito ? 'heart' : 'heart-outline'}
          size={28}
          color={favorito ? '#FF4B4B' : 'white'}
        />
      </TouchableOpacity>
      <View style={styles.petInfo}>
        <View style={styles.petNameRow}>
          <Text style={styles.petName}>{animal.nome}</Text>
          <View style={[styles.statusTag, { backgroundColor: status.cor }]}>
            <Text style={styles.statusText}>{status.texto}</Text>
          </View>
        </View>
        <Text style={styles.petDetail}>
          <Ionicons name="location" /> {animal.cidade ? `${animal.cidade}, ${animal.estado}` : 'Local não informado'}
        </Text>
        <Text style={styles.petDetail}>
          <Ionicons name="paw" color="#2E8B57" /> {rotuloEspecie(animal.especie)} · {animal.raca || 'SRD'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function FeedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ porte?: string; sexo?: string; idade?: string }>();
  const [animais, setAnimais] = useState<AnimalComFotos[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState<'usuario' | 'ong' | null>(null);
  const [favoritosIds, setFavoritosIds] = useState<Set<string>>(new Set());
  const [naoLidas, setNaoLidas] = useState(0);

  const filtrosAtivos = Boolean(params.porte || params.sexo || params.idade);

  async function carregarAnimais() {
    try {
      const dados = await listarAnimaisDisponiveis({
        porte: params.porte as any,
        sexo: params.sexo as any,
        idade: params.idade as any,
      });
      setAnimais(dados);
    } catch (err) {
      console.error(err);
    }
  }

  async function carregarFavoritos() {
    try {
      const ids = await listarIdsFavoritos();
      setFavoritosIds(ids);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleToggleFavorito(animalId: string) {
    const jaFavoritado = favoritosIds.has(animalId);
    setFavoritosIds((prev) => {
      const novo = new Set(prev);
      if (jaFavoritado) {
        novo.delete(animalId);
      } else {
        novo.add(animalId);
      }
      return novo;
    });

    try {
      if (jaFavoritado) {
        await desfavoritar(animalId);
      } else {
        await favoritar(animalId);
      }
    } catch (err) {
      setFavoritosIds((prev) => {
        const novo = new Set(prev);
        if (jaFavoritado) {
          novo.add(animalId);
        } else {
          novo.delete(animalId);
        }
        return novo;
      });
      console.error(err);
    }
  }

  async function carregarPerfil() {
    const usuario = await getUsuarioAtual();
    if (!usuario) return;
    const { data } = await supabase.from('profiles').select('foto_url, tipo').eq('id', usuario.id).single();
    setFotoPerfil(data?.foto_url ?? null);
    setTipoUsuario(data?.tipo ?? null);
  }

  async function carregarNotificacoes() {
    try {
      const total = await contarNaoLidas();
      setNaoLidas(total);
    } catch (err) {
      console.error(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      Promise.all([
        carregarAnimais(),
        carregarPerfil(),
        carregarFavoritos(),
        carregarNotificacoes(),
      ]).finally(() => setCarregando(false));
    }, [params.porte, params.sexo, params.idade])
  );

  async function handleRefresh() {
    setAtualizando(true);
    await carregarAnimais();
    setAtualizando(false);
  }

  const animaisFiltrados = busca.trim()
    ? animais.filter((a) => a.nome.toLowerCase().includes(busca.trim().toLowerCase()))
    : animais;

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={handleRefresh} />}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/notificacoes')} style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={26} color="#1A3626" />
            {naoLidas > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{naoLidas > 9 ? '9+' : naoLidas}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seu Novo Amigo</Text>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image
              source={{
                uri: fotoPerfil ?? 'https://api.dicebear.com/7.x/initials/png?seed=user',
              }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#A0A0A0" />
          <TextInput
            placeholder="Encontre seu novo melhor amigo..."
            style={styles.searchInput}
            value={busca}
            onChangeText={setBusca}
          />
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Ionicons name="options-outline" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pets disponíveis</Text>
          {filtrosAtivos && (
            <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
              <Text style={styles.limparFiltrosText}>Limpar filtros</Text>
            </TouchableOpacity>
          )}
        </View>

        {carregando ? (
          <ActivityIndicator color="#2E8B57" style={{ marginTop: 40 }} />
        ) : animaisFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={48} color="#A0A0A0" />
            <Text style={styles.emptyText}>
              {busca ? 'Nenhum pet encontrado com esse nome.' : 'Ainda não há pets disponíveis.'}
            </Text>
          </View>
        ) : (
          animaisFiltrados.map((animal) => (
            <PetCard
              key={animal.animal_id}
              animal={animal}
              favorito={favoritosIds.has(animal.animal_id)}
              onPress={() => router.push(`/detalhes?id=${animal.animal_id}`)}
              onToggleFavorito={() => handleToggleFavorito(animal.animal_id)}
            />
          ))
        )}
      </ScrollView>

      {tipoUsuario === 'ong' && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/pet-novo')}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5FAF6' },
  scrollContent: { padding: 20, paddingBottom: 100 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  bellBtn: { position: 'relative' },
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF4B4B',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  bellBadgeText: { color: 'white', fontSize: 10, fontWeight: '700' },
  searchBar: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 15, marginTop: 25, alignItems: 'center' },
  searchInput: { flex: 1, marginLeft: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  limparFiltrosText: { color: '#2E8B57', fontWeight: '700', fontSize: 14 },
  petCard: { backgroundColor: 'white', borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 3 },
  petImage: { width: '100%', height: 250 },
  favIcon: { position: 'absolute', top: 15, right: 15 },
  petInfo: { padding: 20 },
  petNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { fontSize: 22, fontWeight: '800' },
  statusTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '700' },
  petDetail: { color: '#666', marginTop: 5 },

  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 12, fontSize: 15 },

  fab: {
    position: 'absolute',
    bottom: 90,
    right: 25,
    backgroundColor: '#1E6F42',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

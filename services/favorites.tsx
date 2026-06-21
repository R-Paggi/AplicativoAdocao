import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { desfavoritar, listarAnimaisFavoritados } from '@/services/favoritos';
import type { Animal, FotoAnimal } from '@/types/database';
import BottomMenu from './components/BottomMenu';

interface FavoritoComAnimal {
  favorito_id: string;
  dt_criacao: string;
  animais: (Animal & { fotos_animal?: FotoAnimal[] }) | null;
}

function fotoPrincipal(animal: Animal & { fotos_animal?: FotoAnimal[] }): string {
  const principal = animal.fotos_animal?.find((f) => f.principal);
  const primeira = animal.fotos_animal?.[0];
  return (
    principal?.url ??
    primeira?.url ??
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=500'
  );
}

function indisponivel(status: Animal['status']): boolean {
  return status === 'adotado' || status === 'inativo';
}

function rotuloStatus(status: Animal['status']): string {
  if (status === 'adotado') return 'ADOTADO';
  if (status === 'em_processo') return 'EM PROCESSO';
  if (status === 'inativo') return 'INDISPONÍVEL';
  return 'DISPONÍVEL';
}

export default function FavoritesScreen() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<FavoritoComAnimal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [removendoId, setRemovendoId] = useState<string | null>(null);

  async function carregar() {
    try {
      const dados = await listarAnimaisFavoritados();
      setFavoritos(dados as unknown as FavoritoComAnimal[]);
    } catch (err) {
      console.error(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      carregar().finally(() => setCarregando(false));
    }, [])
  );

  function confirmarRemover(animalId: string, nome: string) {
    Alert.alert('Remover dos favoritos', `Remover ${nome} da sua lista de favoritos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => handleRemover(animalId) },
    ]);
  }

  async function handleRemover(animalId: string) {
    setRemovendoId(animalId);
    try {
      await desfavoritar(animalId);
      setFavoritos((prev) => prev.filter((f) => f.animais?.animal_id !== animalId));
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível remover o favorito.';
      Alert.alert('Erro', mensagem);
    } finally {
      setRemovendoId(null);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#1E6F42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Favoritos</Text>
          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.subtitle}>Aqui estão os amiguinhos que ganharam seu coração! ❤️</Text>

        {carregando ? (
          <ActivityIndicator color="#2E8B57" style={{ marginTop: 40 }} />
        ) : favoritos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={48} color="#A0A0A0" />
            <Text style={styles.emptyText}>Você ainda não favoritou nenhum pet.</Text>
          </View>
        ) : (
          favoritos.map((favorito) => {
            const animal = favorito.animais;
            if (!animal) return null;
            const bloqueado = indisponivel(animal.status);

            return (
              <TouchableOpacity
                key={favorito.favorito_id}
                style={styles.petCard}
                onPress={() => router.push(`/detalhes?id=${animal.animal_id}`)}
                disabled={bloqueado}
              >
                <Image
                  source={{ uri: fotoPrincipal(animal) }}
                  style={[styles.petImage, bloqueado && styles.petImageOpaca]}
                />

                <TouchableOpacity
                  style={styles.removerBtn}
                  onPress={() => confirmarRemover(animal.animal_id, animal.nome)}
                  disabled={removendoId === animal.animal_id}
                >
                  {removendoId === animal.animal_id ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Ionicons name="heart-dislike" size={16} color="white" />
                      <Text style={styles.removerBtnText}>Remover</Text>
                    </>
                  )}
                </TouchableOpacity>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: bloqueado ? '#9E9E9E' : '#B0C4DE' },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{rotuloStatus(animal.status)}</Text>
                </View>

                <View style={styles.petInfo}>
                  <Text style={[styles.petName, bloqueado && styles.petNameOpaca]}>{animal.nome}</Text>
                  <Text style={styles.petDetail}>
                    <Ionicons name="location" />{' '}
                    {animal.cidade ? `${animal.cidade}, ${animal.estado}` : 'Local não informado'}
                  </Text>
                  {bloqueado && (
                    <Text style={styles.avisoIndisponivel}>
                      Este pet não está mais disponível para adoção.
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5FAF6' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E6F42' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 25 },

  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 12, fontSize: 15 },

  petCard: { backgroundColor: 'white', borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 3 },
  petImage: { width: '100%', height: 250 },
  petImageOpaca: { opacity: 0.5 },
  statusBadge: { position: 'absolute', top: 15, left: 15, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusBadgeText: { fontSize: 10, fontWeight: '700', color: 'white' },
  removerBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(220,53,69,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  removerBtnText: { color: 'white', fontWeight: '700', fontSize: 13 },
  petInfo: { padding: 20 },
  petName: { fontSize: 22, fontWeight: '800' },
  petNameOpaca: { color: '#888' },
  petDetail: { color: '#666', marginTop: 5 },
  avisoIndisponivel: { color: '#999', marginTop: 8, fontSize: 13, fontStyle: 'italic' },
});

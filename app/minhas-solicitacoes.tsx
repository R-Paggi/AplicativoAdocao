import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { listarMinhasSolicitacoes } from '@/services/solicitacoes';
import type { Animal, FotoAnimal, SolicitacaoAdocao } from '@/types/database';

interface SolicitacaoComAnimal extends SolicitacaoAdocao {
  animais?: (Animal & { fotos_animal?: FotoAnimal[] }) | null;
}

function fotoPrincipal(animal?: Animal & { fotos_animal?: FotoAnimal[] }): string {
  if (!animal) return 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=300';
  const principal = animal.fotos_animal?.find((f) => f.principal);
  const primeira = animal.fotos_animal?.[0];
  return (
    principal?.url ??
    primeira?.url ??
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=300'
  );
}

function corStatus(status: SolicitacaoAdocao['status']): string {
  switch (status) {
    case 'pendente':
      return '#FFB74D';
    case 'em_analise':
      return '#64B5F6';
    case 'aprovada':
      return '#81C784';
    case 'recusada':
      return '#E57373';
    default:
      return '#BDBDBD';
  }
}

function rotuloStatus(status: SolicitacaoAdocao['status']): string {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'em_analise':
      return 'Em análise';
    case 'aprovada':
      return 'Aprovada';
    case 'recusada':
      return 'Recusada';
    default:
      return 'Cancelada';
  }
}

function descricaoStatus(status: SolicitacaoAdocao['status']): string {
  switch (status) {
    case 'pendente':
      return 'Aguardando análise do responsável.';
    case 'em_analise':
      return 'O responsável está avaliando seu pedido.';
    case 'aprovada':
      return 'Parabéns! Entre em contato para os próximos passos.';
    case 'recusada':
      return 'Essa solicitação não foi aprovada desta vez.';
    default:
      return 'Esta solicitação foi cancelada.';
  }
}

export default function MinhasSolicitacoesScreen() {
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoComAnimal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  async function carregar() {
    try {
      const dados = await listarMinhasSolicitacoes();
      setSolicitacoes(dados as SolicitacaoComAnimal[]);
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

  async function handleRefresh() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A3626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas solicitações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={handleRefresh} />}
      >
        {carregando ? (
          <ActivityIndicator color="#2E8B57" style={{ marginTop: 40 }} />
        ) : solicitacoes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={48} color="#A0A0A0" />
            <Text style={styles.emptyText}>Você ainda não solicitou nenhuma adoção.</Text>
          </View>
        ) : (
          solicitacoes.map((solicitacao) => (
            <TouchableOpacity
              key={solicitacao.solicitacao_id}
              style={styles.card}
              onPress={() =>
                solicitacao.animais && router.push(`/detalhes?id=${solicitacao.animais.animal_id}`)
              }
            >
              <Image source={{ uri: fotoPrincipal(solicitacao.animais) }} style={styles.petImage} />
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <Text style={styles.petNome}>{solicitacao.animais?.nome ?? 'Pet'}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: corStatus(solicitacao.status) }]}>
                    <Text style={styles.statusBadgeText}>{rotuloStatus(solicitacao.status)}</Text>
                  </View>
                </View>
                <Text style={styles.descricaoStatus}>{descricaoStatus(solicitacao.status)}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8FAF8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A3626' },
  scrollContent: { padding: 20, paddingBottom: 60 },

  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 12, fontSize: 15 },

  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 18, padding: 14, marginBottom: 14, gap: 14, elevation: 2 },
  petImage: { width: 70, height: 70, borderRadius: 14 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petNome: { fontSize: 16, fontWeight: '800', color: '#1A3626' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusBadgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  descricaoStatus: { fontSize: 13, color: '#666', marginTop: 6, lineHeight: 18 },
});

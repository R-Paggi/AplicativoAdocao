import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { atualizarStatusSolicitacao, listarSolicitacoesRecebidas } from '@/services/solicitacoes';
import type { Animal, Profile, SolicitacaoAdocao } from '@/types/database';

type SolicitacaoComDados = SolicitacaoAdocao & {
  animais?: Animal;
  solicitante?: Pick<Profile, 'id' | 'nome' | 'telefone'> | null;
};

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

export default function SolicitacoesRecebidasScreen() {
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoComDados[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  async function carregar() {
    try {
      const dados = await listarSolicitacoesRecebidas();
      setSolicitacoes(dados as SolicitacaoComDados[]);
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

  async function responder(solicitacaoId: string, status: 'aprovada' | 'recusada') {
    setProcessandoId(solicitacaoId);
    try {
      await atualizarStatusSolicitacao(solicitacaoId, status);
      await carregar();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível atualizar a solicitação.';
      Alert.alert('Erro', mensagem);
    } finally {
      setProcessandoId(null);
    }
  }

  function confirmarResposta(solicitacaoId: string, status: 'aprovada' | 'recusada', nomePet: string) {
    const acao = status === 'aprovada' ? 'aprovar' : 'recusar';
    Alert.alert(
      `Confirmar ${acao}`,
      `Tem certeza que deseja ${acao} esta solicitação para ${nomePet}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => responder(solicitacaoId, status) },
      ]
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A3626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitações recebidas</Text>
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
            <Ionicons name="mail-outline" size={48} color="#A0A0A0" />
            <Text style={styles.emptyText}>Você ainda não recebeu nenhuma solicitação de adoção.</Text>
          </View>
        ) : (
          solicitacoes.map((solicitacao) => (
            <View key={solicitacao.solicitacao_id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Image
                  source={{
                    uri: 'https://api.dicebear.com/7.x/initials/png?seed=' + (solicitacao.animais?.nome ?? 'Pet'),
                  }}
                  style={styles.petAvatar}
                />
                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.petNome}>{solicitacao.animais?.nome ?? 'Pet'}</Text>
                  <Text style={styles.solicitanteNome}>
                    {solicitacao.solicitante?.nome ?? 'Solicitante'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: corStatus(solicitacao.status) }]}>
                  <Text style={styles.statusBadgeText}>{rotuloStatus(solicitacao.status)}</Text>
                </View>
              </View>

              {solicitacao.mensagem && (
                <Text style={styles.mensagem}>"{solicitacao.mensagem}"</Text>
              )}

              {solicitacao.solicitante?.telefone && (
                <View style={styles.telefoneRow}>
                  <Ionicons name="call-outline" size={14} color="#666" />
                  <Text style={styles.telefoneTexto}>{solicitacao.solicitante.telefone}</Text>
                </View>
              )}

              {solicitacao.status === 'pendente' && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.recusarBtn}
                    disabled={processandoId === solicitacao.solicitacao_id}
                    onPress={() =>
                      confirmarResposta(solicitacao.solicitacao_id, 'recusada', solicitacao.animais?.nome ?? 'este pet')
                    }
                  >
                    {processandoId === solicitacao.solicitacao_id ? (
                      <ActivityIndicator color="#E57373" size="small" />
                    ) : (
                      <Text style={styles.recusarBtnText}>Recusar</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.aprovarBtn}
                    disabled={processandoId === solicitacao.solicitacao_id}
                    onPress={() =>
                      confirmarResposta(solicitacao.solicitacao_id, 'aprovada', solicitacao.animais?.nome ?? 'este pet')
                    }
                  >
                    {processandoId === solicitacao.solicitacao_id ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.aprovarBtnText}>Aprovar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
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

  card: { backgroundColor: 'white', borderRadius: 20, padding: 18, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  petAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0F2E9' },
  cardHeaderInfo: { flex: 1 },
  petNome: { fontSize: 16, fontWeight: '800', color: '#1A3626' },
  solicitanteNome: { fontSize: 13, color: '#666', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusBadgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  mensagem: { color: '#555', fontStyle: 'italic', marginTop: 14, lineHeight: 20 },
  telefoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  telefoneTexto: { color: '#666', fontSize: 13 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  recusarBtn: { flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#E57373' },
  recusarBtnText: { color: '#E57373', fontWeight: '700' },
  aprovarBtn: { flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center', backgroundColor: '#2E8B57' },
  aprovarBtnText: { color: 'white', fontWeight: '700' },
});

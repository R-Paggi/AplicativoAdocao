import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { listarNotificacoes, marcarComoLida, marcarTodasComoLidas, type Notificacao } from '@/services/notificacoes';

function iconePorTipo(tipo: string): keyof typeof Ionicons.glyphMap {
  if (tipo === 'nova_solicitacao') return 'mail-unread-outline';
  if (tipo === 'status_solicitacao') return 'paw-outline';
  return 'notifications-outline';
}

function tempoRelativo(dataIso: string): string {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas}h`;
  const dias = Math.floor(horas / 24);
  return `há ${dias}d`;
}

export default function NotificacoesScreen() {
  const router = useRouter();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  async function carregar() {
    try {
      const dados = await listarNotificacoes();
      setNotificacoes(dados);
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

  async function handleTocarNotificacao(notificacao: Notificacao) {
    if (!notificacao.lida) {
      setNotificacoes((prev) =>
        prev.map((n) => (n.notificacao_id === notificacao.notificacao_id ? { ...n, lida: true } : n))
      );
      try {
        await marcarComoLida(notificacao.notificacao_id);
      } catch (err) {
        console.error(err);
      }
    }

    if (notificacao.tipo === 'nova_solicitacao') {
      router.push('/solicitacoes-recebidas');
    } else if (notificacao.tipo === 'status_solicitacao') {
      router.push('/minhas-solicitacoes');
    }
  }

  async function handleMarcarTodas() {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
    try {
      await marcarTodasComoLidas();
    } catch (err) {
      console.error(err);
    }
  }

  const temNaoLidas = notificacoes.some((n) => !n.lida);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A3626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        {temNaoLidas ? (
          <TouchableOpacity onPress={handleMarcarTodas}>
            <Text style={styles.marcarTodasText}>Marcar todas</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={handleRefresh} />}
      >
        {carregando ? (
          <ActivityIndicator color="#2E8B57" style={{ marginTop: 40 }} />
        ) : notificacoes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color="#A0A0A0" />
            <Text style={styles.emptyText}>Você não tem notificações por aqui ainda.</Text>
          </View>
        ) : (
          notificacoes.map((notificacao) => (
            <TouchableOpacity
              key={notificacao.notificacao_id}
              style={[styles.card, !notificacao.lida && styles.cardNaoLido]}
              onPress={() => handleTocarNotificacao(notificacao)}
            >
              <View style={[styles.iconCircle, !notificacao.lida && styles.iconCircleNaoLido]}>
                <Ionicons
                  name={iconePorTipo(notificacao.tipo)}
                  size={20}
                  color={!notificacao.lida ? '#2E8B57' : '#A0A0A0'}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{notificacao.titulo}</Text>
                <Text style={styles.cardMensagem}>{notificacao.mensagem}</Text>
                <Text style={styles.cardTempo}>{tempoRelativo(notificacao.dt_criacao)}</Text>
              </View>
              {!notificacao.lida && <View style={styles.pontoNaoLido} />}
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
  marcarTodasText: { color: '#2E8B57', fontWeight: '700', fontSize: 13 },
  scrollContent: { padding: 20, paddingBottom: 60 },

  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 12, fontSize: 15 },

  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 18, padding: 16, marginBottom: 12, alignItems: 'flex-start', gap: 12 },
  cardNaoLido: { backgroundColor: '#F0FAF3' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  iconCircleNaoLido: { backgroundColor: '#E0F2E9' },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#1A3626' },
  cardMensagem: { fontSize: 13, color: '#666', marginTop: 3, lineHeight: 18 },
  cardTempo: { fontSize: 11, color: '#999', marginTop: 6 },
  pontoNaoLido: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E8B57', marginTop: 4 },
});

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { getUsuarioAtual, logout } from '@/services/auth';
import type { Profile } from '@/types/database';
import BottomMenu from './components/BottomMenu';

interface MenuButtonProps {
  icon: any;
  label: string;
  onPress?: () => void;
  isLogout?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onPress, isLogout }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.iconContainer, isLogout && styles.logoutIconContainer]}>
      <Ionicons name={icon} size={22} color={isLogout ? '#FF4B4B' : '#1E6F42'} />
    </View>
    <Text style={[styles.menuLabel, isLogout && styles.logoutLabel]}>{label}</Text>
    {!isLogout && <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Profile | null>(null);
  const [favoritosCount, setFavoritosCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  async function carregarPerfil() {
    const usuario = await getUsuarioAtual();
    if (!usuario) return;

    const { data } = await supabase.from('profiles').select('*').eq('id', usuario.id).single();
    setPerfil(data);

    const { count } = await supabase
      .from('favoritos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', usuario.id);
    setFavoritosCount(count ?? 0);
  }

  async function handleLogout() {
    try {
      await logout();
      router.replace('/');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: perfil?.foto_url ?? 'https://api.dicebear.com/7.x/initials/png?seed=' + (perfil?.nome ?? 'U'),
              }}
              style={styles.profilePic}
            />
            <TouchableOpacity style={styles.editBadge} onPress={() => router.push('/editar-perfil')}>
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{perfil?.nome ?? 'Carregando...'}</Text>
          <Text style={styles.userLocation}>
            {perfil?.cidade ? `${perfil.cidade}, ${perfil.estado}` : 'Localização não informada'}
          </Text>
          {perfil?.tipo === 'ong' && (
            <View style={styles.ongBadge}>
              <Ionicons name="ribbon-outline" size={14} color="#2E8B57" />
              <Text style={styles.ongBadgeText}>Conta ONG / Doador</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{favoritosCount}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>

        {perfil?.tipo === 'ong' && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Gerenciar</Text>
            <MenuButton
              icon="paw-outline"
              label="Cadastrar novo pet"
              onPress={() => router.push('/pet-novo')}
            />
            <MenuButton
              icon="mail-outline"
              label="Solicitações recebidas"
              onPress={() => router.push('/solicitacoes-recebidas')}
            />
          </View>
        )}

        {perfil?.tipo === 'usuario' && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Adoções</Text>
            <MenuButton
              icon="paw-outline"
              label="Minhas solicitações"
              onPress={() => router.push('/minhas-solicitacoes')}
            />
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <MenuButton icon="person-outline" label="Editar Perfil" onPress={() => router.push('/editar-perfil')} />
          <MenuButton icon="notifications-outline" label="Notificações" onPress={() => router.push('/notificacoes')} />
          <MenuButton icon="log-out-outline" label="Sair da Conta" isLogout onPress={handleLogout} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8FAF8' },
  scrollContent: { padding: 25 },
  profileHeader: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  imageWrapper: { position: 'relative' },
  profilePic: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'white' },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#1E6F42', width: 34, height: 34,
    borderRadius: 17, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#F8FAF8',
  },
  userName: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginTop: 15 },
  userLocation: { fontSize: 16, color: '#666', marginTop: 2 },
  ongBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, marginTop: 10 },
  ongBadgeText: { fontSize: 12, fontWeight: '700', color: '#2E8B57' },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: {
    flex: 1, backgroundColor: 'white', padding: 20,
    borderRadius: 20, alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
  },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#1E6F42' },
  statLabel: { fontSize: 14, color: '#666', fontWeight: '600', marginTop: 5 },
  menuSection: { backgroundColor: 'white', borderRadius: 25, padding: 10, elevation: 2, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginLeft: 15, marginTop: 15, marginBottom: 10, color: '#111' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F5F1' },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF4EF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  logoutIconContainer: { backgroundColor: '#FFEBEB' },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  logoutLabel: { color: '#FF4B4B' },
});

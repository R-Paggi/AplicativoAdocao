import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomMenu from './components/BottomMenu'; // Ajustado para o caminho relativo correto

interface MenuButtonProps {
  icon: any;
  label: string;
  onPress?: () => void;
  isLogout?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onPress, isLogout }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.iconContainer, isLogout && styles.logoutIconContainer]}>
      <Ionicons name={icon} size={22} color={isLogout ? "#FF4B4B" : "#1E6F42"} />
    </View>
    <Text style={[styles.menuLabel, isLogout && styles.logoutLabel]}>{label}</Text>
    {!isLogout && <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();

  // Função de Logout atualizada para o index.tsx
  const handleLogout = () => {
    // O '/' aponta diretamente para o teu ficheiro index.tsx
    router.replace('/'); 
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeader}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.profilePic} 
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Ricardo Almeida</Text>
          <Text style={styles.userLocation}>São Paulo, SP</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>02</Text>
            <Text style={styles.statLabel}>Adotados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <MenuButton icon="person-outline" label="Editar Perfil" />
          <MenuButton icon="notifications-outline" label="Notificações" />
          <MenuButton icon="shield-checkmark-outline" label="Privacidade" />
          <MenuButton icon="help-circle-outline" label="Central de Ajuda" />
          
          <MenuButton 
            icon="log-out-outline" 
            label="Sair da Conta" 
            isLogout={true} 
            onPress={handleLogout} 
          />
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
    borderWidth: 3, borderColor: '#F8FAF8'
  },
  userName: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginTop: 15 },
  userLocation: { fontSize: 16, color: '#666', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: { 
    flex: 1, backgroundColor: 'white', padding: 20, 
    borderRadius: 20, alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5
  },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#1E6F42' },
  statLabel: { fontSize: 14, color: '#666', fontWeight: '600', marginTop: 5 },
  menuSection: { backgroundColor: 'white', borderRadius: 25, padding: 10, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginLeft: 15, marginTop: 15, marginBottom: 10, color: '#111' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F5F1' },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF4EF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  logoutIconContainer: { backgroundColor: '#FFEBEB' },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  logoutLabel: { color: '#FF4B4B' },
});
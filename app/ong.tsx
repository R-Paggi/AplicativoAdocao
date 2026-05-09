import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Dados fictícios para os pets da ONG
const ONG_PETS = [
  { id: '1', name: 'Dionísio', image: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=300' },
  { id: '2', name: 'Mel', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=300' },
  { id: '3', name: 'Pipoca', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=300' },
];

export default function OngProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Banner e Botão Voltar */}
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000' }} 
            style={styles.bannerImage} 
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Informações da ONG */}
        <View style={styles.content}>
          <View style={styles.logoRow}>
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png' }} 
                style={styles.logo} 
              />
            </View>
            <View style={styles.titleInfo}>
              <Text style={styles.ongName}>Refúgio do Coração</Text>
              <Text style={styles.location}>
                <Ionicons name="location" size={14} color="#2E8B57" /> Dois Vizinhos, PR
              </Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Seguir</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>120</Text>
              <Text style={styles.statLabel}>Adotados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Para Adoção</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Voluntários</Text>
            </View>
          </View>

          {/* Sobre */}
          <Text style={styles.sectionTitle}>Sobre a ONG</Text>
          <Text style={styles.description}>
            Nossa missão é resgatar animais em situação de risco, proporcionar tratamento veterinário adequado e encontrar lares amorosos. Atuamos há mais de 5 anos na região sudoeste, focando no bem-estar animal e na conscientização sobre a posse responsável.
          </Text>

          {/* Pets Disponíveis na ONG */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pets no Refúgio</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Ver todos</Text></TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={ONG_PETS}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.miniPetCard} onPress={() => router.push('/detalhes')}>
                <Image source={{ uri: item.image }} style={styles.miniPetImage} />
                <Text style={styles.miniPetName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Botões de Contato */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.messageBtn}>
              <Ionicons name="chatbubble-ellipses" size={20} color="white" />
              <Text style={styles.btnText}>Mensagem</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.donateBtn}>
              <FontAwesome5 name="hand-holding-heart" size={18} color="#2E8B57" />
              <Text style={[styles.btnText, { color: '#2E8B57' }]}>Doar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { position: 'relative' },
  bannerImage: { width: '100%', height: 200 },
  backButton: { 
    position: 'absolute', 
    top: 40, 
    left: 20, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    padding: 8, 
    borderRadius: 20 
  },
  content: { padding: 24, marginTop: -30, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  logoContainer: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: '#E0F2E9', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white'
  },
  logo: { width: 40, height: 40 },
  titleInfo: { flex: 1, marginLeft: 15 },
  ongName: { fontSize: 22, fontWeight: '800', color: '#1A3626' },
  location: { color: '#666', fontSize: 14, marginTop: 4 },
  followBtn: { backgroundColor: '#2E8B57', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  followBtnText: { color: 'white', fontWeight: '700' },
  statsRow: { 
    flexDirection: 'row', 
    backgroundColor: '#F5FAF6', 
    borderRadius: 20, 
    padding: 20, 
    justifyContent: 'space-around',
    marginBottom: 30
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#1A3626' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  statDivider: { width: 1, height: '100%', backgroundColor: '#DDE6DF' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A3626', marginBottom: 15 },
  description: { color: '#666', lineHeight: 22, marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAll: { color: '#2E8B57', fontWeight: '700' },
  miniPetCard: { marginRight: 15, alignItems: 'center' },
  miniPetImage: { width: 100, height: 100, borderRadius: 20 },
  miniPetName: { marginTop: 8, fontWeight: '600', color: '#1A3626' },
  actionRow: { flexDirection: 'row', marginTop: 35, gap: 15 },
  messageBtn: { flex: 1, backgroundColor: '#2E8B57', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 20 },
  donateBtn: { flex: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 2, borderColor: '#2E8B57' },
  btnText: { color: 'white', fontWeight: '700', fontSize: 16, marginLeft: 10 }
});
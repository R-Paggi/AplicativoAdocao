import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function DetalhesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Imagem do Pet e Botões no Header */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=600' }} 
            style={styles.petImage} 
          />
          <SafeAreaView style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#1A3626" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="heart-outline" size={24} color="#1A3626" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Informações Principais */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.petName}>Dionísio</Text>
            <Ionicons name="male" size={24} color="#3498db" />
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#2E8B57" />
            <Text style={styles.locationText}>Refúgio do Coração • A 2,5km de você</Text>
          </View>

          {/* Cards de Características */}
          <View style={styles.traitsRow}>
            <View style={styles.traitCard}>
              <Text style={styles.traitValue}>1.5</Text>
              <Text style={styles.traitLabel}>Anos</Text>
            </View>
            <View style={styles.traitCard}>
              <Text style={styles.traitValue}>Médio</Text>
              <Text style={styles.traitLabel}>Porte</Text>
            </View>
            <View style={styles.traitCard}>
              <Text style={styles.traitValue}>14</Text>
              <Text style={styles.traitLabel}>Kg</Text>
            </View>
          </View>

          {/* Perfil da ONG/Doador */}
          <TouchableOpacity style={styles.ongCard} onPress={() => router.push('/ong')}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png' }} 
              style={styles.ongLogo} 
            />
            <View style={styles.ongInfo}>
              <Text style={styles.ongName}>Refúgio do Coração</Text>
              <Text style={styles.ongSub}>ONG Protetora</Text>
            </View>
            <Ionicons name="chatbubble-ellipses" size={24} color="#2E8B57" />
          </TouchableOpacity>

          {/* Sobre o Pet */}
          <Text style={styles.sectionTitle}>Sobre o Dionísio</Text>
          <Text style={styles.description}>
            Dionísio é um cãozinho muito enérgico e brincalhão. Ele foi resgatado das ruas há cerca de 3 meses e já está castrado, vacinado e vermifugado. Ele se dá muito bem com outros cachorros e adora correr no quintal. Precisa de uma família que tenha espaço e tempo para gastar a energia dele!
          </Text>
        </View>
      </ScrollView>

      {/* Botão Fixo de Adoção */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.adoptBtn}>
          <FontAwesome5 name="paw" size={18} color="white" />
          <Text style={styles.adoptBtnText}>Quero Adotar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  imageContainer: { position: 'relative', height: 400 },
  petImage: { width: '100%', height: '100%' },
  headerButtons: { position: 'absolute', top: 40, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.8)', padding: 10, borderRadius: 20 },
  content: { padding: 24, marginTop: -30, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { fontSize: 32, fontWeight: '800', color: '#1A3626' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 25 },
  locationText: { color: '#666', marginLeft: 5, fontSize: 14 },
  traitsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  traitCard: { backgroundColor: '#E0F2E9', paddingVertical: 15, borderRadius: 20, width: '30%', alignItems: 'center' },
  traitValue: { fontSize: 18, fontWeight: '800', color: '#2E8B57' },
  traitLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  ongCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5FAF6', padding: 15, borderRadius: 20, marginBottom: 30 },
  ongLogo: { width: 45, height: 45, borderRadius: 22.5 },
  ongInfo: { flex: 1, marginLeft: 15 },
  ongName: { fontSize: 16, fontWeight: '700', color: '#1A3626' },
  ongSub: { fontSize: 12, color: '#666' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1A3626', marginBottom: 15 },
  description: { color: '#666', lineHeight: 24, fontSize: 15 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, paddingBottom: 35, borderTopWidth: 1, borderColor: '#F0F0F0' },
  adoptBtn: { backgroundColor: '#2E8B57', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 25 },
  adoptBtnText: { color: 'white', fontSize: 18, fontWeight: '700', marginLeft: 10 }
});
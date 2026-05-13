import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomMenu from './components/BottomMenu'; // IMPORTANDO O MENU AQUI!

// Reutilizamos o PetCard, mas você pode movê-lo para uma pasta "components" no futuro para não repetir código!
const PetCard = ({ name, distance, match, type, image, status, color, startsFavorited = false }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(startsFavorited);

  return (
    <TouchableOpacity style={styles.petCard} onPress={() => router.push('/detalhes')}>
      <Image source={{ uri: image }} style={styles.petImage} />
      <TouchableOpacity style={styles.favIcon} onPress={() => setIsFavorite(!isFavorite)}>
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={28} 
          color={isFavorite ? "#FF4B4B" : "white"} 
        />
      </TouchableOpacity>
      <View style={styles.matchBadge}><Text style={styles.matchText}>⭐ {match} MATCH</Text></View>
      <View style={styles.petInfo}>
        <View style={styles.petNameRow}>
          <Text style={styles.petName}>{name}</Text>
          <View style={[styles.statusTag, {backgroundColor: color}]}><Text style={styles.statusText}>{status}</Text></View>
        </View>
        <Text style={styles.petDetail}><Ionicons name="location" /> {distance}</Text>
        <Text style={styles.petDetail}><Ionicons name="heart" color="#2E8B57" /> {type}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header simplificado para a tela de favoritos */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={28} color="#1E6F42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Favoritos</Text>
          <View style={{ width: 28 }} /> {/* Espaçador para centralizar o título */}
        </View>

        <Text style={styles.subtitle}>Aqui estão os amiguinhos que ganharam seu coração! ❤️</Text>

        {/* Cards simulando os favoritos (startsFavorited={true}) */}
        <PetCard 
          name="Leoncio" distance="A 12km de você" match="85%" type="Amigo Fiel" 
          image="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=500"
          status="URGENTE" color="#FFE4E1"
          startsFavorited={true}
        />
        <PetCard 
          name="Berenice" distance="A 5km de você" match="95%" type="ONG Patas Livres" 
          image="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=500"
          status="PRONTO" color="#B0C4DE"
          startsFavorited={true} 
        />

        <PetCard 
          name="Dionísio" distance="A 15km de você" match="95%" type="Refúgio do Coração" 
          image="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=300"
          status="PRONTO" color="#B0C4DE"
          startsFavorited={true} 

        />
      </ScrollView>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
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
  
  petCard: { backgroundColor: 'white', borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 3 },
  petImage: { width: '100%', height: 250 },
  favIcon: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.2)', padding: 5, borderRadius: 20 },
  matchBadge: { position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 15 },
  matchText: { fontWeight: '700', fontSize: 12 },
  petInfo: { padding: 20 },
  petNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { fontSize: 22, fontWeight: '800' },
  statusTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '700' },
  petDetail: { color: '#666', marginTop: 5 },

  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: 'white', paddingVertical: 12, paddingBottom: 25,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    elevation: 15, position: 'absolute', bottom: 0, width: '100%',
  },
  navItem: { alignItems: 'center', padding: 10 },
  navItemActive: { alignItems: 'center', backgroundColor: '#E8F5E9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  navText: { fontSize: 10, color: '#A0A0A0', marginTop: 4, fontWeight: '500' },
  navTextActive: { fontSize: 10, color: '#1E6F42', fontWeight: '700', marginTop: 4 },
});
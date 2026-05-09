import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PetCard = ({ name, distance, match, type, image, status, color }) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.petCard} onPress={() => router.push('/detalhes')}>
      <Image source={{ uri: image }} style={styles.petImage} />
      <TouchableOpacity style={styles.favIcon}><Ionicons name="heart-outline" size={24} color="white" /></TouchableOpacity>
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

export default function FeedScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={28} />
        <Text style={styles.headerTitle}>Seu Novo Amigo</Text>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.profilePic} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#A0A0A0" />
        <TextInput placeholder="Encontre seu novo melhor amigo..." style={styles.searchInput} />
        <Ionicons name="options-outline" size={20} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Amigos Perto de Você</Text>
        <TouchableOpacity><Text style={styles.seeAll}>Ver todos</Text></TouchableOpacity>
      </View>

      <PetCard 
        name="Berenice" distance="A 5km de você" match="95%" type="ONG Patas Livres" 
        image="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=500"
        status="PRONTO" color="#B0C4DE"
      />
      <PetCard 
        name="Leoncio" distance="A 12km de você" match="85%" type="Amigo Fiel" 
        image="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=500"
        status="URGENTE" color="#FFE4E1"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FAF6', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  searchBar: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 15, marginTop: 25, alignItems: 'center' },
  searchInput: { flex: 1, marginLeft: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  seeAll: { color: '#666' },
  petCard: { backgroundColor: 'white', borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 3 },
  petImage: { width: '100%', height: 250 },
  favIcon: { position: 'absolute', top: 15, right: 15 },
  matchBadge: { position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 15 },
  matchText: { fontWeight: '700', fontSize: 12 },
  petInfo: { padding: 20 },
  petNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { fontSize: 22, fontWeight: '800' },
  statusTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '700' },
  petDetail: { color: '#666', marginTop: 5 }
});
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react'; // Adicione o useState aqui!
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomMenu from './components/BottomMenu'; // IMPORTANDO O MENU AQUI!

const PetCard = ({ name, distance, match, type, image, status, color, startsFavorited = false }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(startsFavorited);

  return (
    <TouchableOpacity style={styles.petCard} onPress={() => router.push('/detalhes')}>
      <Image source={{ uri: image }} style={styles.petImage} />
      
      <TouchableOpacity 
        style={styles.favIcon} 
        onPress={() => setIsFavorite(!isFavorite)} // Inverte o valor ao clicar
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} // Muda o ícone
          size={28} 
          color={isFavorite ? "#FF4B4B" : "white"} // Fica vermelho se favoritado
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



export default function FeedScreen() {
  const router = useRouter();
  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="menu" size={28} />
          <Text style={styles.headerTitle}>Seu Novo Amigo</Text>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.profilePic} 
            />
          </TouchableOpacity>
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

        <PetCard 
          name="Dionísio" distance="A 15km de você" match="95%" type="Refúgio do Coração" 
          image="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=300"
                    

          status="PRONTO" color="#B0C4DE"
        />
      </ScrollView>

      {/* Botão Flutuante (+) */}
{/* Botão Flutuante (+) */}


      {/* Menu de Navegação Inferior */}
           <BottomMenu />

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5FAF6' },
  scrollContent: { padding: 20, paddingBottom: 100 }, // paddingBottom garante que o último card não fique escondido atrás do menu
  
  /* --- Seus Estilos Antigos --- */
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
  petDetail: { color: '#666', marginTop: 5 },

  /* --- Novos Estilos Adicionados --- */
  fab: {
    position: 'absolute',
    bottom: 90, // Posicionado logo acima da barra inferior
    right: 25,
    backgroundColor: '#1E6F42', // Verde escuro da imagem
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingBottom: 25, // Espaço extra para a área segura do iPhone (safe area)
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9', // Fundo verdinho no botão ativo (Home)
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  navText: {
    fontSize: 10,
    color: '#A0A0A0',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    fontSize: 10,
    color: '#1E6F42',
    fontWeight: '700',
    marginTop: 4,
  },
});
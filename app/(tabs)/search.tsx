import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomMenu from './components/BottomMenu'; // IMPORTANDO O MENU AQUI!

export default function SearchScreen() {
  const router = useRouter();
  
  const [raio, setRaio] = useState('10km');
  const [porte, setPorte] = useState('pequeno');
  const [sexo, setSexo] = useState('macho');
  const [idade, setIdade] = useState('adulto');

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="menu" size={28} color="#1E6F42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seu Novo Amigo</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profilePic} 
          />
        </TouchableOpacity>
        </View>

        <Text style={styles.mainTitle}>Encontre seu novo amigo</Text>
        <Text style={styles.subtitle}>Personalize sua busca para encontrar o companheiro ideal.</Text>

        {/* --- BLOCO VERDE CLARO --- */}
        <View style={styles.lightBackgroundBlock}>
          <View style={styles.labelRow}>
            <Ionicons name="location" size={20} color="#0A361A" />
            <Text style={styles.sectionLabel}>Localização</Text>
          </View>
          
          <Text style={styles.inputLabel}>CEP</Text>
          <TextInput placeholder="00000-000" style={styles.cepInput} placeholderTextColor="#A0A0A0" />
          
          <TouchableOpacity style={styles.locationButton}>
            <Ionicons name="locate-outline" size={20} color="#1E6F42" />
            <Text style={styles.locationButtonText}>Usar minha localização</Text>
          </TouchableOpacity>

          <Text style={styles.inputLabelMarginTop}>Raio de busca</Text>
          <View style={styles.pillsRow}>
            {['10km', '20km', '50km', 'Estado todo'].map((item) => (
              <TouchableOpacity key={item} onPress={() => setRaio(item)} style={[styles.raioPill, raio === item && styles.raioPillActive]}>
                <Text style={[styles.raioPillText, raio === item && styles.raioPillTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Porte */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Ionicons name="tablet-landscape-outline" size={20} color="#0A361A" />
            <Text style={styles.sectionLabel}>Porte</Text>
          </View>
          <View style={styles.porteRow}>
            <TouchableOpacity onPress={() => setPorte('pequeno')} style={[styles.porteCard, porte === 'pequeno' && styles.porteCardActive]}>
              <Ionicons name="paw" size={24} color={porte === 'pequeno' ? "#0A361A" : "#888"} />
              <Text style={[styles.porteText, porte === 'pequeno' && styles.porteTextActive]}>Pequeno</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPorte('medio')} style={[styles.porteCard, porte === 'medio' && styles.porteCardActive]}>
              <Ionicons name="paw" size={30} color={porte === 'medio' ? "#0A361A" : "#888"} />
              <Text style={[styles.porteText, porte === 'medio' && styles.porteTextActive]}>Médio</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setPorte('grande')} style={[styles.porteCardLarge, porte === 'grande' && styles.porteCardActive]}>
            <Ionicons name="paw" size={38} color={porte === 'grande' ? "#0A361A" : "#888"} />
            <Text style={[styles.porteText, porte === 'grande' && styles.porteTextActive]}>Grande</Text>
          </TouchableOpacity>
        </View>

        {/* Sexo */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Ionicons name="male-female-outline" size={20} color="#0A361A" />
            <Text style={styles.sectionLabel}>Sexo</Text>
          </View>
          <View style={styles.segmentControl}>
            <TouchableOpacity onPress={() => setSexo('macho')} style={[styles.segmentBtn, sexo === 'macho' && styles.segmentBtnActive]}>
              <Text style={[styles.segmentText, sexo === 'macho' && styles.segmentTextActive]}>Macho</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSexo('femea')} style={[styles.segmentBtn, sexo === 'femea' && styles.segmentBtnActive]}>
              <Text style={[styles.segmentText, sexo === 'femea' && styles.segmentTextActive]}>Fêmea</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Idade */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Ionicons name="calendar-outline" size={20} color="#0A361A" />
            <Text style={styles.sectionLabel}>Idade</Text>
          </View>
          <View style={styles.pillsRow}>
            {['Filhote', 'Adulto'].map((item) => (
              <TouchableOpacity key={item} onPress={() => setIdade(item.toLowerCase())} style={[styles.idadePill, idade === item.toLowerCase() && styles.idadePillActive]}>
                <Text style={[styles.idadePillText, idade === item.toLowerCase() && styles.idadePillTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpar todos os filtros</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* A MÁGICA ACONTECE AQUI: UMA ÚNICA LINHA! */}
      <BottomMenu />

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8FAF8' },
  container: { flex: 1, padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0A361A' },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  
  mainTitle: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', marginTop: 10, lineHeight: 36 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 10, marginBottom: 25, lineHeight: 22 },

  lightBackgroundBlock: { backgroundColor: '#F0F5F1', padding: 20, borderRadius: 25, marginBottom: 25 },
  
  section: { marginBottom: 25 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { fontSize: 18, fontWeight: '700', marginLeft: 8, color: '#111' },
  
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputLabelMarginTop: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 12, marginTop: 25 },
  cepInput: { backgroundColor: '#E2E8E4', padding: 15, borderRadius: 10, fontSize: 16 },
  
  locationButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 10, padding: 15, marginTop: 15 },
  locationButtonText: { color: '#0A361A', fontWeight: '700', marginLeft: 8 },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  
  raioPill: { backgroundColor: '#E2E8E4', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20, minWidth: 80, alignItems: 'center', flex: 1 },
  raioPillActive: { backgroundColor: '#E8F5E9', borderWidth: 1.5, borderColor: '#1E6F42' },
  raioPillText: { color: '#555', fontWeight: '600' },
  raioPillTextActive: { color: '#0A361A', fontWeight: '700' },

  porteRow: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  porteCard: { flex: 1, backgroundColor: '#F0F5F1', borderRadius: 25, padding: 20, alignItems: 'center', justifyContent: 'center', height: 110 },
  porteCardLarge: { backgroundColor: '#F0F5F1', borderRadius: 25, padding: 20, alignItems: 'center', justifyContent: 'center', height: 110 },
  porteCardActive: { borderWidth: 1.5, borderColor: '#1E6F42', backgroundColor: '#E8F5E9' },
  porteText: { marginTop: 10, fontWeight: '700', color: '#111' },
  porteTextActive: { color: '#0A361A' },

  segmentControl: { flexDirection: 'row', backgroundColor: '#F0F5F1', borderRadius: 25, padding: 5 },
  segmentBtn: { flex: 1, paddingVertical: 15, alignItems: 'center', borderRadius: 20 },
  segmentBtnActive: { backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  segmentText: { color: '#555', fontWeight: '600' },
  segmentTextActive: { color: '#0A361A', fontWeight: '700' },

  idadePill: { backgroundColor: '#E2E8E4', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 20, alignItems: 'center' },
  idadePillActive: { backgroundColor: '#3BAA54' }, 
  idadePillText: { color: '#555', fontWeight: '600' },
  idadePillTextActive: { color: 'white', fontWeight: '700' },

  applyButton: { backgroundColor: '#3BAA54', padding: 20, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  applyButtonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  
  clearButton: { alignItems: 'center', marginTop: 20 },
  clearButtonText: { color: '#888', fontWeight: '600', fontSize: 16 },
});
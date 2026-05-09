import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function FilterScreen() {
  const [radius, setRadius] = useState('10km');
  const [size, setSize] = useState('Pequeno');
  const [gender, setGender] = useState('Macho');
  const [age, setAge] = useState('Adulto');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.mainTitle}>Encontre seu novo amigo</Text>
        <Text style={styles.subtitle}>Personalize sua busca para encontrar o companheiro ideal.</Text>

        {/* Card Principal - Filtros */}
        <View style={styles.filterCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#1A3626" />
            <Text style={styles.sectionTitle}>Localização</Text>
          </View>
          
          <Text style={styles.label}>CEP</Text>
          <TextInput 
            style={styles.input} 
            placeholder="00000-000" 
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
          />
          
          <TouchableOpacity style={styles.locationBtn}>
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#2E8B57" />
            <Text style={styles.locationBtnText}>Usar minha localização</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Raio de busca</Text>
          <View style={styles.rowGrid}>
            {['10km', '20km', '50km', 'Estado todo'].map((item) => (
              <TouchableOpacity 
                key={item} 
                style={[styles.optionBtn, radius === item && styles.optionBtnActive]}
                onPress={() => setRadius(item)}
              >
                <Text style={[styles.optionText, radius === item && styles.optionTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Porte */}
        <View style={styles.sectionHeaderSpacing}>
          <FontAwesome5 name="ruler-horizontal" size={18} color="#1A3626" />
          <Text style={styles.sectionTitle}>Porte</Text>
        </View>
        <View style={styles.rowSpacing}>
          <TouchableOpacity 
            style={[styles.sizeBtn, size === 'Pequeno' && styles.sizeBtnActive]}
            onPress={() => setSize('Pequeno')}
          >
            <FontAwesome5 name="paw" size={20} color={size === 'Pequeno' ? '#1A3626' : '#666'} />
            <Text style={[styles.optionText, size === 'Pequeno' && styles.optionTextActive]}>Pequeno</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sizeBtn, size === 'Médio' && styles.sizeBtnActive]}
            onPress={() => setSize('Médio')}
          >
            <FontAwesome5 name="paw" size={24} color={size === 'Médio' ? '#1A3626' : '#666'} />
            <Text style={[styles.optionText, size === 'Médio' && styles.optionTextActive]}>Médio</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.sizeBtnLarge, size === 'Grande' && styles.sizeBtnActive]}
          onPress={() => setSize('Grande')}
        >
          <FontAwesome5 name="paw" size={28} color={size === 'Grande' ? '#1A3626' : '#666'} />
          <Text style={[styles.optionText, size === 'Grande' && styles.optionTextActive]}>Grande</Text>
        </TouchableOpacity>

        {/* Sexo */}
        <View style={styles.sectionHeaderSpacing}>
          <Ionicons name="male-female" size={20} color="#1A3626" />
          <Text style={styles.sectionTitle}>Sexo</Text>
        </View>
        <View style={styles.toggleRow}>
          <TouchableOpacity 
            style={[styles.toggleBtn, gender === 'Macho' && styles.toggleBtnActive]}
            onPress={() => setGender('Macho')}
          >
            <Text style={[styles.optionText, gender === 'Macho' && styles.optionTextActive]}>Macho</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, gender === 'Fêmea' && styles.toggleBtnActive]}
            onPress={() => setGender('Fêmea')}
          >
            <Text style={[styles.optionText, gender === 'Fêmea' && styles.optionTextActive]}>Fêmea</Text>
          </TouchableOpacity>
        </View>

        {/* Idade */}
        <View style={styles.sectionHeaderSpacing}>
          <Ionicons name="calendar" size={20} color="#1A3626" />
          <Text style={styles.sectionTitle}>Idade</Text>
        </View>
        <View style={styles.rowSpacing}>
          <TouchableOpacity 
            style={[styles.ageBtn, age === 'Filhote' && styles.ageBtnActive]}
            onPress={() => setAge('Filhote')}
          >
            <Text style={[styles.optionText, age === 'Filhote' && styles.ageTextActive]}>Filhote</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.ageBtn, age === 'Adulto' && styles.ageBtnActive]}
            onPress={() => setAge('Adulto')}
          >
            <Text style={[styles.optionText, age === 'Adulto' && styles.ageTextActive]}>Adulto</Text>
          </TouchableOpacity>
        </View>

        {/* Botões de Ação */}
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyBtnText}>Aplicar Filtros</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Limpar todos os filtros</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FAF6' },
  scrollContent: { padding: 24, paddingTop: 50 },
  mainTitle: { fontSize: 32, fontWeight: '800', color: '#1A3626', lineHeight: 38, marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, lineHeight: 22 },
  filterCard: { backgroundColor: '#EBF2ED', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionHeaderSpacing: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A3626', marginLeft: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A3626', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#DDE6DF', borderRadius: 10, padding: 15, fontSize: 16, color: '#1A3626', marginBottom: 15 },
  locationBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 15, marginBottom: 20 },
  locationBtnText: { color: '#2E8B57', fontWeight: '700', fontSize: 16, marginLeft: 8 },
  rowGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  optionBtn: { backgroundColor: '#DDE6DF', borderRadius: 20, paddingVertical: 12, width: '48%', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  optionBtnActive: { backgroundColor: '#E0F2E9', borderColor: '#2E8B57' },
  optionText: { fontSize: 15, color: '#666', fontWeight: '600' },
  optionTextActive: { color: '#1A3626' },
  rowSpacing: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, marginBottom: 15 },
  sizeBtn: { flex: 1, backgroundColor: '#EBF2ED', borderRadius: 20, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  sizeBtnLarge: { backgroundColor: '#EBF2ED', borderRadius: 20, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: 'transparent', marginBottom: 20 },
  sizeBtnActive: { backgroundColor: '#E0F2E9', borderColor: '#2E8B57' },
  toggleRow: { flexDirection: 'row', backgroundColor: '#EBF2ED', borderRadius: 30, padding: 5, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  toggleBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  ageBtn: { backgroundColor: '#DDE6DF', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 25 },
  ageBtnActive: { backgroundColor: '#4CAF50' },
  ageTextActive: { color: '#FFFFFF' },
  applyBtn: { backgroundColor: '#2E8B57', borderRadius: 25, paddingVertical: 18, alignItems: 'center', marginTop: 30, marginBottom: 15 },
  applyBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  clearBtn: { alignItems: 'center', marginBottom: 40 },
  clearBtnText: { color: '#666', fontSize: 16, fontWeight: '600' }
});
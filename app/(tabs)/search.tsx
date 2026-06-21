import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { PorteAnimal, SexoAnimal } from '@/types/database';
import BottomMenu from './components/BottomMenu';

type Idade = 'filhote' | 'adulto' | null;

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ porte?: string; sexo?: string; idade?: string }>();

  const [porte, setPorte] = useState<PorteAnimal | null>((params.porte as PorteAnimal) || null);
  const [sexo, setSexo] = useState<SexoAnimal | null>((params.sexo as SexoAnimal) || null);
  const [idade, setIdade] = useState<Idade>((params.idade as Idade) || null);

  function aplicarFiltros() {
    const query: Record<string, string> = {};
    if (porte) query.porte = porte;
    if (sexo) query.sexo = sexo;
    if (idade) query.idade = idade;

    router.push({ pathname: '/(tabs)/home', params: query });
  }

  function limparFiltros() {
    setPorte(null);
    setSexo(null);
    setIdade(null);
    router.push('/(tabs)/home');
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#1E6F42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seu Novo Amigo</Text>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image
              source={{ uri: 'https://api.dicebear.com/7.x/initials/png?seed=user' }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.mainTitle}>Encontre seu novo amigo</Text>
        <Text style={styles.subtitle}>Personalize sua busca para encontrar o companheiro ideal.</Text>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Ionicons name="tablet-landscape-outline" size={20} color="#0A361A" />
            <Text style={styles.sectionLabel}>Porte</Text>
          </View>
          <View style={styles.porteRow}>
            <TouchableOpacity
              onPress={() => setPorte(porte === 'pequeno' ? null : 'pequeno')}
              style={[styles.porteCard, porte === 'pequeno' && styles.porteCardActive]}
            >
              <Ionicons name="paw" size={24} color={porte === 'pequeno' ? '#0A361A' : '#888'} />
              <Text style={[styles.porteText, porte === 'pequeno' && styles.porteTextActive]}>Pequeno</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPorte(porte === 'medio' ? null : 'medio')}
              style={[styles.porteCard, porte === 'medio' && styles.porteCardActive]}
            >
              <Ionicons name="paw" size={30} color={porte === 'medio' ? '#0A361A' : '#888'} />
              <Text style={[styles.porteText, porte === 'medio' && styles.porteTextActive]}>Médio</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setPorte(porte === 'grande' ? null : 'grande')}
            style={[styles.porteCardLarge, porte === 'grande' && styles.porteCardActive]}
          >
            <Ionicons name="paw" size={38} color={porte === 'grande' ? '#0A361A' : '#888'} />
            <Text style={[styles.porteText, porte === 'grande' && styles.porteTextActive]}>Grande</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Ionicons name="male-female-outline" size={20} color="#0A361A" />
            <Text style={styles.sectionLabel}>Sexo</Text>
          </View>
          <View style={styles.segmentControl}>
            <TouchableOpacity
              onPress={() => setSexo(sexo === 'macho' ? null : 'macho')}
              style={[styles.segmentBtn, sexo === 'macho' && styles.segmentBtnActive]}
            >
              <Text style={[styles.segmentText, sexo === 'macho' && styles.segmentTextActive]}>Macho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSexo(sexo === 'femea' ? null : 'femea')}
              style={[styles.segmentBtn, sexo === 'femea' && styles.segmentBtnActive]}
            >
              <Text style={[styles.segmentText, sexo === 'femea' && styles.segmentTextActive]}>Fêmea</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Ionicons name="calendar-outline" size={20} color="#0A361A" />
            <Text style={styles.sectionLabel}>Idade</Text>
          </View>
          <View style={styles.pillsRow}>
            <TouchableOpacity
              onPress={() => setIdade(idade === 'filhote' ? null : 'filhote')}
              style={[styles.idadePill, idade === 'filhote' && styles.idadePillActive]}
            >
              <Text style={[styles.idadePillText, idade === 'filhote' && styles.idadePillTextActive]}>
                Filhote (até 1 ano)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIdade(idade === 'adulto' ? null : 'adulto')}
              style={[styles.idadePill, idade === 'adulto' && styles.idadePillActive]}
            >
              <Text style={[styles.idadePillText, idade === 'adulto' && styles.idadePillTextActive]}>
                Adulto (mais de 1 ano)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={aplicarFiltros}>
          <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={limparFiltros}>
          <Text style={styles.clearButtonText}>Limpar todos os filtros</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

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

  section: { marginBottom: 25 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { fontSize: 18, fontWeight: '700', marginLeft: 8, color: '#111' },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

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

  idadePill: { backgroundColor: '#E2E8E4', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 20, alignItems: 'center' },
  idadePillActive: { backgroundColor: '#3BAA54' },
  idadePillText: { color: '#555', fontWeight: '600' },
  idadePillTextActive: { color: 'white', fontWeight: '700' },

  applyButton: { backgroundColor: '#3BAA54', padding: 20, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  applyButtonText: { color: 'white', fontSize: 18, fontWeight: '700' },

  clearButton: { alignItems: 'center', marginTop: 20 },
  clearButtonText: { color: '#888', fontWeight: '600', fontSize: 16 },
});

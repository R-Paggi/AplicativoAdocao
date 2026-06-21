import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { buscarAnimalPorId } from '@/services/animais';
import { supabase } from '@/lib/supabase';
import type { AnimalComFotos } from '@/types/database';

function fotoPrincipal(animal: AnimalComFotos): string {
  const principal = animal.fotos_animal?.find((f) => f.principal);
  const primeira = animal.fotos_animal?.[0];
  return (
    principal?.url ??
    primeira?.url ??
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600'
  );
}

function rotuloPorte(porte: AnimalComFotos['porte']): string {
  if (porte === 'pequeno') return 'Pequeno';
  if (porte === 'medio') return 'Médio';
  return 'Grande';
}

function rotuloIdade(meses: number | null): string {
  if (!meses) return '—';
  if (meses < 12) return `${meses} m`;
  const anos = Math.floor(meses / 12);
  const restoMeses = meses % 12;
  return restoMeses > 0 ? `${anos}a ${restoMeses}m` : `${anos}`;
}

export default function DetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [animal, setAnimal] = useState<AnimalComFotos | null>(null);
  const [nomeDoador, setNomeDoador] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) {
      setErro('Pet não encontrado.');
      setCarregando(false);
      return;
    }
    carregarAnimal(id);
  }, [id]);

  async function carregarAnimal(animalId: string) {
    setCarregando(true);
    try {
      const dados = await buscarAnimalPorId(animalId);
      setAnimal(dados);
      if (dados) {
        const { data: doador } = await supabase
          .from('profiles')
          .select('nome')
          .eq('id', dados.doador_id)
          .single();
        setNomeDoador(doador?.nome ?? 'Doador');
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar pet.');
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#2E8B57" size="large" />
      </View>
    );
  }

  if (erro || !animal) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#A0A0A0" />
        <Text style={styles.erroTexto}>{erro || 'Não foi possível encontrar este pet.'}</Text>
        <TouchableOpacity style={styles.voltarBtn} onPress={() => router.back()}>
          <Text style={styles.voltarBtnText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: fotoPrincipal(animal) }} style={styles.petImage} />
          <SafeAreaView style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#1A3626" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="heart-outline" size={24} color="#FF4B4B" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.petName}>{animal.nome}</Text>
            <Ionicons
              name={animal.sexo === 'macho' ? 'male' : 'female'}
              size={24}
              color={animal.sexo === 'macho' ? '#3498db' : '#e91e8c'}
            />
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#2E8B57" />
            <Text style={styles.locationText}>
              {animal.cidade ? `${animal.cidade}, ${animal.estado}` : 'Local não informado'}
            </Text>
          </View>

          <View style={styles.traitsRow}>
            <View style={styles.traitCard}>
              <Text style={styles.traitValue}>{rotuloIdade(animal.idade_meses)}</Text>
              <Text style={styles.traitLabel}>Idade</Text>
            </View>
            <View style={styles.traitCard}>
              <Text style={styles.traitValue}>{rotuloPorte(animal.porte)}</Text>
              <Text style={styles.traitLabel}>Porte</Text>
            </View>
            <View style={styles.traitCard}>
              <Text style={styles.traitValue}>{animal.raca || 'SRD'}</Text>
              <Text style={styles.traitLabel}>Raça</Text>
            </View>
          </View>

          <View style={styles.saudeRow}>
            {animal.vacinado && (
              <View style={styles.saudeBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#2E8B57" />
                <Text style={styles.saudeBadgeText}>Vacinado</Text>
              </View>
            )}
            {animal.castrado && (
              <View style={styles.saudeBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#2E8B57" />
                <Text style={styles.saudeBadgeText}>Castrado</Text>
              </View>
            )}
            {animal.vermifugado && (
              <View style={styles.saudeBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#2E8B57" />
                <Text style={styles.saudeBadgeText}>Vermifugado</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.ongCard}>
            <View style={styles.ongAvatar}>
              <Ionicons name="person" size={22} color="#2E8B57" />
            </View>
            <View style={styles.ongInfo}>
              <Text style={styles.ongName}>{nomeDoador}</Text>
              <Text style={styles.ongSub}>Responsável pelo pet</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Sobre {animal.nome}</Text>
          <Text style={styles.description}>
            {animal.descricao || 'Ainda não há uma descrição detalhada sobre este pet.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.adoptBtn}
          onPress={() => router.push(`/solicitacao-nova?animalId=${animal.animal_id}`)}
        >
          <FontAwesome5 name="paw" size={18} color="white" />
          <Text style={styles.adoptBtnText}>Quero Adotar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 30 },
  erroTexto: { color: '#888', marginTop: 12, fontSize: 15, textAlign: 'center' },
  voltarBtn: { marginTop: 20, backgroundColor: '#2E8B57', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  voltarBtnText: { color: 'white', fontWeight: '700' },
  imageContainer: { position: 'relative', height: 400 },
  petImage: { width: '100%', height: '100%' },
  headerButtons: { position: 'absolute', top: 40, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.8)', padding: 10, borderRadius: 20 },
  content: { padding: 24, marginTop: -30, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { fontSize: 32, fontWeight: '800', color: '#1A3626' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 25 },
  locationText: { color: '#666', marginLeft: 5, fontSize: 14 },
  traitsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  traitCard: { backgroundColor: '#E0F2E9', paddingVertical: 15, borderRadius: 20, width: '30%', alignItems: 'center' },
  traitValue: { fontSize: 16, fontWeight: '800', color: '#2E8B57' },
  traitLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  saudeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 25 },
  saudeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5FAF6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 4 },
  saudeBadgeText: { fontSize: 12, color: '#2E8B57', fontWeight: '600' },
  ongCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5FAF6', padding: 15, borderRadius: 20, marginBottom: 30 },
  ongAvatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E0F2E9', justifyContent: 'center', alignItems: 'center' },
  ongInfo: { flex: 1, marginLeft: 15 },
  ongName: { fontSize: 16, fontWeight: '700', color: '#1A3626' },
  ongSub: { fontSize: 12, color: '#666' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1A3626', marginBottom: 15 },
  description: { color: '#666', lineHeight: 24, fontSize: 15 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, paddingBottom: 35, borderTopWidth: 1, borderColor: '#F0F0F0' },
  adoptBtn: { backgroundColor: '#2E8B57', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 25 },
  adoptBtnText: { color: 'white', fontSize: 18, fontWeight: '700', marginLeft: 10 },
});

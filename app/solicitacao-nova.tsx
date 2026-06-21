import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { buscarAnimalPorId } from '@/services/animais';
import { criarSolicitacao } from '@/services/solicitacoes';
import type { AnimalComFotos } from '@/types/database';

function fotoPrincipal(animal: AnimalComFotos): string {
  const principal = animal.fotos_animal?.find((f) => f.principal);
  const primeira = animal.fotos_animal?.[0];
  return (
    principal?.url ??
    primeira?.url ??
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=300'
  );
}

export default function SolicitacaoNovaScreen() {
  const router = useRouter();
  const { animalId } = useLocalSearchParams<{ animalId: string }>();

  const [animal, setAnimal] = useState<AnimalComFotos | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [carregandoAnimal, setCarregandoAnimal] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!animalId) {
      setCarregandoAnimal(false);
      return;
    }
    buscarAnimalPorId(animalId)
      .then(setAnimal)
      .finally(() => setCarregandoAnimal(false));
  }, [animalId]);

  async function handleEnviar() {
    if (!animalId) return;

    setEnviando(true);
    try {
      await criarSolicitacao(animalId, mensagem);
      Alert.alert(
        'Solicitação enviada!',
        'O responsável pelo pet vai analisar seu pedido. Você pode acompanhar o status na aba de favoritos.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
      );
    } catch (err) {
      const texto = err instanceof Error ? err.message : 'Não foi possível enviar a solicitação.';
      Alert.alert('Erro', texto);
    } finally {
      setEnviando(false);
    }
  }

  if (carregandoAnimal) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#2E8B57" size="large" />
      </View>
    );
  }

  if (!animal) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#A0A0A0" />
        <Text style={styles.erroTexto}>Não foi possível encontrar este pet.</Text>
        <TouchableOpacity style={styles.voltarBtn} onPress={() => router.back()}>
          <Text style={styles.voltarBtnText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A3626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitar adoção</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.petPreview}>
            <Image source={{ uri: fotoPrincipal(animal) }} style={styles.petImage} />
            <View>
              <Text style={styles.petName}>{animal.nome}</Text>
              <Text style={styles.petSub}>
                {animal.cidade ? `${animal.cidade}, ${animal.estado}` : 'Local não informado'}
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Mensagem para o responsável (opcional)</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Conte um pouco sobre você e por que gostaria de adotar este pet..."
              placeholderTextColor="#A0A0A0"
              value={mensagem}
              onChangeText={setMensagem}
              multiline
              numberOfLines={6}
              editable={!enviando}
            />
          </View>

          <TouchableOpacity
            style={[styles.enviarBtn, enviando && styles.enviarBtnDisabled]}
            onPress={handleEnviar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <FontAwesome5 name="paw" size={16} color="white" />
                <Text style={styles.enviarBtnText}>Enviar solicitação</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 30 },
  erroTexto: { color: '#888', marginTop: 12, fontSize: 15, textAlign: 'center' },
  voltarBtn: { marginTop: 20, backgroundColor: '#2E8B57', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  voltarBtnText: { color: 'white', fontWeight: '700' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A3626' },
  content: { padding: 25 },
  petPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20, padding: 15, marginBottom: 25, gap: 15 },
  petImage: { width: 60, height: 60, borderRadius: 16 },
  petName: { fontSize: 18, fontWeight: '800', color: '#1A3626' },
  petSub: { fontSize: 13, color: '#666', marginTop: 2 },
  label: { fontWeight: '700', marginBottom: 10, color: '#1A3626' },
  textAreaContainer: { backgroundColor: 'white', borderRadius: 16, padding: 5 },
  textArea: { minHeight: 140, padding: 15, fontSize: 15, color: '#1A3626', textAlignVertical: 'top' },
  enviarBtn: { backgroundColor: '#2E8B57', borderRadius: 25, padding: 18, alignItems: 'center', marginTop: 25, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  enviarBtnDisabled: { opacity: 0.7 },
  enviarBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
});

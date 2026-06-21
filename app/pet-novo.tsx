import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { adicionarFotoAnimal, criarAnimal } from '@/services/animais';
import { getUsuarioAtual } from '@/services/auth';
import { supabase } from '@/lib/supabase';
import type { EspecieAnimal, PorteAnimal, SexoAnimal } from '@/types/database';

const ESPECIES: { valor: EspecieAnimal; label: string }[] = [
  { valor: 'cao', label: 'Cão' },
  { valor: 'gato', label: 'Gato' },
  { valor: 'outro', label: 'Outro' },
];

const PORTES: { valor: PorteAnimal; label: string }[] = [
  { valor: 'pequeno', label: 'Pequeno' },
  { valor: 'medio', label: 'Médio' },
  { valor: 'grande', label: 'Grande' },
];

const SEXOS: { valor: SexoAnimal; label: string }[] = [
  { valor: 'macho', label: 'Macho' },
  { valor: 'femea', label: 'Fêmea' },
];

export default function NovoPetScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<EspecieAnimal>('cao');
  const [raca, setRaca] = useState('');
  const [porte, setPorte] = useState<PorteAnimal>('medio');
  const [sexo, setSexo] = useState<SexoAnimal>('macho');
  const [idadeMeses, setIdadeMeses] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [vacinado, setVacinado] = useState(false);
  const [castrado, setCastrado] = useState(false);
  const [vermifugado, setVermifugado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [verificandoPermissao, setVerificandoPermissao] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    verificarPermissao();
  }, []);

  async function verificarPermissao() {
    const usuario = await getUsuarioAtual();
    if (!usuario) {
      setVerificandoPermissao(false);
      return;
    }
    const { data } = await supabase.from('profiles').select('tipo').eq('id', usuario.id).single();
    setAutorizado(data?.tipo === 'ong');
    setVerificandoPermissao(false);
  }

  const racaRef = useRef<TextInput>(null);
  const idadeRef = useRef<TextInput>(null);
  const descricaoRef = useRef<TextInput>(null);
  const fotoUrlRef = useRef<TextInput>(null);
  const cidadeRef = useRef<TextInput>(null);
  const estadoRef = useRef<TextInput>(null);

  async function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert('Faltam dados', 'Informe o nome do pet.');
      return;
    }

    setCarregando(true);
    try {
      const animal = await criarAnimal({
        nome,
        especie,
        raca: raca || undefined,
        porte,
        sexo,
        idade_meses: idadeMeses ? parseInt(idadeMeses, 10) : undefined,
        descricao: descricao || undefined,
        vacinado,
        castrado,
        vermifugado,
        cidade: cidade || undefined,
        estado: estado || undefined,
      });

      if (fotoUrl.trim()) {
        await adicionarFotoAnimal(animal.animal_id, fotoUrl.trim(), true);
      }

      Alert.alert('Pet cadastrado', `${animal.nome} já está disponível para adoção!`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível cadastrar o pet.';
      Alert.alert('Erro ao cadastrar', mensagem);
    } finally {
      setCarregando(false);
    }
  }

  if (verificandoPermissao) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#2E8B57" size="large" />
      </View>
    );
  }

  if (!autorizado) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="lock-closed-outline" size={48} color="#A0A0A0" />
        <Text style={styles.erroTexto}>
          Apenas contas de ONG ou doador podem cadastrar pets para adoção.
        </Text>
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
        <Text style={styles.headerTitle}>Cadastrar pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <Text style={styles.label}>Nome do pet</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dionísio"
            placeholderTextColor="#A0A0A0"
            value={nome}
            onChangeText={setNome}
            editable={!carregando}
            returnKeyType="next"
            onSubmitEditing={() => racaRef.current?.focus()}
          />
        </View>

        <Text style={styles.label}>Espécie</Text>
        <View style={styles.pillsRow}>
          {ESPECIES.map((item) => (
            <TouchableOpacity
              key={item.valor}
              style={[styles.pill, especie === item.valor && styles.pillActive]}
              onPress={() => setEspecie(item.valor)}
            >
              <Text style={[styles.pillText, especie === item.valor && styles.pillTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Raça (opcional)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref={racaRef}
            style={styles.input}
            placeholder="Ex: Labrador, SRD..."
            placeholderTextColor="#A0A0A0"
            value={raca}
            onChangeText={setRaca}
            editable={!carregando}
            returnKeyType="next"
            onSubmitEditing={() => idadeRef.current?.focus()}
          />
        </View>

        <Text style={styles.label}>Porte</Text>
        <View style={styles.pillsRow}>
          {PORTES.map((item) => (
            <TouchableOpacity
              key={item.valor}
              style={[styles.pill, porte === item.valor && styles.pillActive]}
              onPress={() => setPorte(item.valor)}
            >
              <Text style={[styles.pillText, porte === item.valor && styles.pillTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Sexo</Text>
        <View style={styles.segmentControl}>
          {SEXOS.map((item) => (
            <TouchableOpacity
              key={item.valor}
              style={[styles.segmentBtn, sexo === item.valor && styles.segmentBtnActive]}
              onPress={() => setSexo(item.valor)}
            >
              <Text style={[styles.segmentText, sexo === item.valor && styles.segmentTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Idade em meses (opcional)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref={idadeRef}
            style={styles.input}
            placeholder="Ex: 18"
            placeholderTextColor="#A0A0A0"
            value={idadeMeses}
            onChangeText={(t) => setIdadeMeses(t.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            editable={!carregando}
            returnKeyType="next"
            onSubmitEditing={() => descricaoRef.current?.focus()}
          />
        </View>

        <Text style={styles.label}>Descrição</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            ref={descricaoRef}
            style={[styles.input, styles.textArea]}
            placeholder="Conte um pouco sobre o temperamento, história e cuidados do pet..."
            placeholderTextColor="#A0A0A0"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            editable={!carregando}
            returnKeyType="next"
            onSubmitEditing={() => fotoUrlRef.current?.focus()}
          />
        </View>

        <Text style={styles.label}>URL da foto (opcional)</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="image-outline" size={18} color="#A0A0A0" />
          <TextInput
            ref={fotoUrlRef}
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor="#A0A0A0"
            value={fotoUrl}
            onChangeText={setFotoUrl}
            autoCapitalize="none"
            keyboardType="url"
            editable={!carregando}
            returnKeyType="next"
            onSubmitEditing={() => cidadeRef.current?.focus()}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputWrapper}>
            <Text style={styles.label}>Cidade</Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref={cidadeRef}
                style={styles.input}
                placeholder="Cidade"
                placeholderTextColor="#A0A0A0"
                value={cidade}
                onChangeText={setCidade}
                editable={!carregando}
                returnKeyType="next"
                onSubmitEditing={() => estadoRef.current?.focus()}
              />
            </View>
          </View>
          <View style={styles.smallInputWrapper}>
            <Text style={styles.label}>UF</Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref={estadoRef}
                style={styles.input}
                placeholder="PR"
                placeholderTextColor="#A0A0A0"
                value={estado}
                onChangeText={setEstado}
                autoCapitalize="characters"
                maxLength={2}
                editable={!carregando}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Saúde</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Vacinado</Text>
          <Switch value={vacinado} onValueChange={setVacinado} trackColor={{ true: '#2E8B57' }} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Castrado</Text>
          <Switch value={castrado} onValueChange={setCastrado} trackColor={{ true: '#2E8B57' }} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Vermifugado</Text>
          <Switch value={vermifugado} onValueChange={setVermifugado} trackColor={{ true: '#2E8B57' }} />
        </View>

        <TouchableOpacity
          style={[styles.salvarBtn, carregando && styles.salvarBtnDisabled]}
          onPress={handleSalvar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <FontAwesome5 name="paw" size={16} color="white" />
              <Text style={styles.salvarBtnText}>Cadastrar pet</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  scrollContent: { paddingHorizontal: 25, paddingBottom: 20 },
  label: { fontWeight: '700', marginBottom: 8, color: '#1A3626', marginTop: 18 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, gap: 8 },
  input: { flex: 1, padding: 15, fontSize: 16, color: '#1A3626' },
  textAreaContainer: { alignItems: 'flex-start' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  halfInputWrapper: { flex: 2 },
  smallInputWrapper: { flex: 1 },
  pillsRow: { flexDirection: 'row', gap: 10 },
  pill: { flex: 1, backgroundColor: 'white', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  pillActive: { backgroundColor: '#E8F5E9', borderWidth: 1.5, borderColor: '#1E6F42' },
  pillText: { color: '#555', fontWeight: '600' },
  pillTextActive: { color: '#0A361A', fontWeight: '700' },
  segmentControl: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 16, padding: 4 },
  segmentBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  segmentBtnActive: { backgroundColor: '#2E8B57' },
  segmentText: { color: '#555', fontWeight: '600' },
  segmentTextActive: { color: 'white', fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A3626', marginTop: 28, marginBottom: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 10 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: '#1A3626' },
  salvarBtn: { backgroundColor: '#2E8B57', borderRadius: 25, padding: 18, alignItems: 'center', marginTop: 28, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  salvarBtnDisabled: { opacity: 0.7 },
  salvarBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
});

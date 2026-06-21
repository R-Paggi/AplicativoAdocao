import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
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
import { supabase } from '@/lib/supabase';
import { atualizarPerfil, getUsuarioAtual } from '@/services/auth';

export default function EditarPerfilScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const telefoneRef = useRef<TextInput>(null);
  const cidadeRef = useRef<TextInput>(null);
  const estadoRef = useRef<TextInput>(null);
  const fotoUrlRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      carregarPerfilAtual();
    }, [])
  );

  async function carregarPerfilAtual() {
    setCarregandoPerfil(true);
    try {
      const usuario = await getUsuarioAtual();
      if (!usuario) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', usuario.id).single();
      if (data) {
        setNome(data.nome ?? '');
        setTelefone(data.telefone ?? '');
        setCidade(data.cidade ?? '');
        setEstado(data.estado ?? '');
        setFotoUrl(data.foto_url ?? '');
        setBio(data.bio ?? '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoPerfil(false);
    }
  }

  async function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert('Faltam dados', 'Informe seu nome.');
      return;
    }

    setSalvando(true);
    try {
      await atualizarPerfil({
        nome,
        telefone: telefone || undefined,
        cidade: cidade || undefined,
        estado: estado || undefined,
        foto_url: fotoUrl || undefined,
        bio: bio || undefined,
      });
      Alert.alert('Perfil atualizado', 'Suas informações foram salvas com sucesso.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível salvar o perfil.';
      Alert.alert('Erro', mensagem);
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoPerfil) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#2E8B57" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A3626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
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
          <View style={styles.avatarPreviewWrapper}>
            <Image
              source={{
                uri: fotoUrl.trim() || 'https://api.dicebear.com/7.x/initials/png?seed=' + (nome || 'U'),
              }}
              style={styles.avatarPreview}
            />
          </View>

          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={18} color="#A0A0A0" />
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#A0A0A0"
              value={nome}
              onChangeText={setNome}
              editable={!salvando}
              returnKeyType="next"
              onSubmitEditing={() => telefoneRef.current?.focus()}
            />
          </View>

          <Text style={styles.label}>Telefone (opcional)</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="phone" size={18} color="#A0A0A0" />
            <TextInput
              ref={telefoneRef}
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#A0A0A0"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              editable={!salvando}
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
                  editable={!salvando}
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
                  editable={!salvando}
                  returnKeyType="next"
                  onSubmitEditing={() => fotoUrlRef.current?.focus()}
                />
              </View>
            </View>
          </View>

          <Text style={styles.label}>URL da foto de perfil (opcional)</Text>
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
              editable={!salvando}
              returnKeyType="next"
              onSubmitEditing={() => bioRef.current?.focus()}
            />
          </View>

          <Text style={styles.label}>Sobre você (opcional)</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              ref={bioRef}
              style={[styles.input, styles.textArea]}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor="#A0A0A0"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              editable={!salvando}
              returnKeyType="done"
              onSubmitEditing={handleSalvar}
            />
          </View>

          <TouchableOpacity
            style={[styles.salvarBtn, salvando && styles.salvarBtnDisabled]}
            onPress={handleSalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.salvarBtnText}>Salvar alterações</Text>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A3626' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 20 },

  avatarPreviewWrapper: { alignItems: 'center', marginVertical: 20 },
  avatarPreview: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'white' },

  label: { fontWeight: '700', marginBottom: 8, color: '#1A3626', marginTop: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, gap: 8 },
  input: { flex: 1, padding: 15, fontSize: 16, color: '#1A3626' },
  textAreaContainer: { alignItems: 'flex-start' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  halfInputWrapper: { flex: 2 },
  smallInputWrapper: { flex: 1 },

  salvarBtn: { backgroundColor: '#2E8B57', borderRadius: 25, padding: 18, alignItems: 'center', marginTop: 28 },
  salvarBtnDisabled: { opacity: 0.7 },
  salvarBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
});

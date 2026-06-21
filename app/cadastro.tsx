import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { cadastrar } from '@/services/auth';
import type { PerfilRole } from '@/types/database';
import SeletorUf from '@/components/SeletorUf';

export default function CadastroScreen() {
  const router = useRouter();

  const [tipo, setTipo] = useState<PerfilRole>('usuario');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const cidadeRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const confirmarSenhaRef = useRef<TextInput>(null);

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert('Faltam dados', 'Preencha nome, e-mail e senha para continuar.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'A senha e a confirmação precisam ser iguais.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha curta', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await cadastrar({
        nome,
        email,
        senha,
        tipo,
        cidade: cidade.trim() || undefined,
        estado: estado.trim().toUpperCase() || undefined,
      });
      Alert.alert('Conta criada', 'Sua conta foi criada com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível criar a conta. Tente novamente.';
      Alert.alert('Erro ao cadastrar', mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1A3626" />
          </TouchableOpacity>
          <View style={styles.logoCircle}>
            <FontAwesome name="paw" size={36} color="#2E8B57" />
          </View>
          <Text style={styles.appName}>Criar conta</Text>
          <Text style={styles.tagline}>Comece a transformar vidas</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Você é</Text>
          <View style={styles.segmentControl}>
            <TouchableOpacity
              style={[styles.segmentBtn, tipo === 'usuario' && styles.segmentBtnActive]}
              onPress={() => setTipo('usuario')}
            >
              <Text style={[styles.segmentText, tipo === 'usuario' && styles.segmentTextActive]}>
                Adotante
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, tipo === 'ong' && styles.segmentBtnActive]}
              onPress={() => setTipo('ong')}
            >
              <Text style={[styles.segmentText, tipo === 'ong' && styles.segmentTextActive]}>
                ONG / Doador
              </Text>
            </TouchableOpacity>
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
              editable={!carregando}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          </View>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="at" size={18} color="#A0A0A0" />
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="nome@exemplo.com"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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
                  onSubmitEditing={() => senhaRef.current?.focus()}
                />
              </View>
            </View>
            <View style={styles.smallInputWrapper}>
              <Text style={styles.label}>UF</Text>
              <View style={styles.inputContainer}>
                <SeletorUf value={estado} onChange={setEstado} disabled={carregando} />
              </View>
            </View>
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={18} color="#A0A0A0" />
            <TextInput
              ref={senhaRef}
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry={!mostrarSenha}
              placeholderTextColor="#A0A0A0"
              value={senha}
              onChangeText={setSenha}
              editable={!carregando}
              returnKeyType="next"
              onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
            />
            <TouchableOpacity onPress={() => setMostrarSenha((v) => !v)}>
              <FontAwesome name={mostrarSenha ? 'eye-slash' : 'eye'} size={18} color="#A0A0A0" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={18} color="#A0A0A0" />
            <TextInput
              ref={confirmarSenhaRef}
              style={styles.input}
              placeholder="Repita a senha"
              secureTextEntry={!mostrarSenha}
              placeholderTextColor="#A0A0A0"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              editable={!carregando}
              returnKeyType="done"
              onSubmitEditing={handleCadastro}
            />
          </View>

          <TouchableOpacity
            style={[styles.cadastrarBtn, carregando && styles.cadastrarBtnDisabled]}
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cadastrarBtnText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Já tem uma conta?{' '}
            <Text style={styles.loginLink} onPress={() => router.back()}>
              Entrar
            </Text>
          </Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7F4' },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 20, marginTop: 10, paddingHorizontal: 20 },
  backBtn: { alignSelf: 'flex-start', padding: 8, marginBottom: 10 },
  logoCircle: { backgroundColor: '#E0F2E9', padding: 18, borderRadius: 50, marginBottom: 12 },
  appName: { fontSize: 26, fontWeight: '800', color: '#1A3626' },
  tagline: { color: '#666', fontSize: 15, marginTop: 4 },
  card: { backgroundColor: 'white', borderRadius: 40, padding: 30, marginHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label: { fontWeight: '700', marginBottom: 8, color: '#1A3626', marginTop: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5FAF6', borderRadius: 12, paddingHorizontal: 15 },
  input: { flex: 1, padding: 15, fontSize: 16, color: '#1A3626' },
  row: { flexDirection: 'row', gap: 12 },
  halfInputWrapper: { flex: 2 },
  smallInputWrapper: { flex: 1 },
  segmentControl: { flexDirection: 'row', backgroundColor: '#F0F5F1', borderRadius: 16, padding: 4 },
  segmentBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  segmentBtnActive: { backgroundColor: '#2E8B57' },
  segmentText: { color: '#555', fontWeight: '600' },
  segmentTextActive: { color: 'white', fontWeight: '700' },
  cadastrarBtn: { backgroundColor: '#2E8B57', borderRadius: 25, padding: 18, alignItems: 'center', marginTop: 28 },
  cadastrarBtnDisabled: { opacity: 0.7 },
  cadastrarBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
  footerText: { textAlign: 'center', marginTop: 24, color: '#666', fontSize: 15 },
  loginLink: { color: '#2E8B57', fontWeight: '800' },
});

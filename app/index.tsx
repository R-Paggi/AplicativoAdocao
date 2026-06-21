import { FontAwesome } from '@expo/vector-icons';
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
import { login } from '@/services/auth';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const senhaRef = useRef<TextInput>(null);

  async function handleLogin() {
    if (!email.trim() || !senha) {
      Alert.alert('Faltam dados', 'Preencha e-mail e senha para continuar.');
      return;
    }

    setCarregando(true);
    try {
      await login(email, senha);
      router.replace('/(tabs)/home');
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível entrar. Tente novamente.';
      Alert.alert('Erro ao entrar', mensagem);
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
            <View style={styles.logoCircle}>
              <FontAwesome name="paw" size={40} color="#2E8B57" />
            </View>
            <Text style={styles.appName}>Seu Novo Amigo</Text>
            <Text style={styles.tagline}>Conectando corações e patas</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.welcomeText}>Bem-vindo de volta</Text>

            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <FontAwesome name="at" size={18} color="#A0A0A0" />
              <TextInput
                style={styles.input}
                placeholder="nome@exemplo.com"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!carregando}
                returnKeyType="next"
                onSubmitEditing={() => senhaRef.current?.focus()}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Senha</Text>
              <TouchableOpacity>
                <Text style={styles.forgotPass}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={18} color="#A0A0A0" />
              <TextInput
                ref={senhaRef}
                style={styles.input}
                placeholder="Sua senha secreta"
                secureTextEntry={!mostrarSenha}
                placeholderTextColor="#A0A0A0"
                value={senha}
                onChangeText={setSenha}
                editable={!carregando}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setMostrarSenha((v) => !v)}>
                <FontAwesome name={mostrarSenha ? 'eye-slash' : 'eye'} size={18} color="#A0A0A0" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, carregando && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginBtnText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Ainda não tem uma conta?{' '}
              <Text style={styles.signUp} onPress={() => router.push('/cadastro')}>
                Cadastre-se
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
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  logoCircle: { backgroundColor: '#E0F2E9', padding: 20, borderRadius: 50, marginBottom: 15 },
  appName: { fontSize: 28, fontWeight: '800', color: '#1A3626' },
  tagline: { color: '#666', fontSize: 16, marginTop: 5 },
  card: { backgroundColor: 'white', borderRadius: 40, padding: 30, marginHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  welcomeText: { fontSize: 24, fontWeight: '700', marginBottom: 25, color: '#1A3626' },
  label: { fontWeight: '700', marginBottom: 8, color: '#1A3626' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5FAF6', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20 },
  input: { flex: 1, padding: 15, fontSize: 16, color: '#1A3626' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  forgotPass: { color: '#2E8B57', fontWeight: '700' },
  loginBtn: { backgroundColor: '#2E8B57', borderRadius: 25, padding: 18, alignItems: 'center', marginTop: 10 },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
  footerText: { textAlign: 'center', marginTop: 30, color: '#666', fontSize: 15 },
  signUp: { color: '#2E8B57', fontWeight: '800' },
});

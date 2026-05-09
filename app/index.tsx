import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho do Login */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <FontAwesome name="paw" size={40} color="#2E8B57" />
        </View>
        <Text style={styles.appName}>Seu Novo Amigo</Text>
        <Text style={styles.tagline}>Conectando corações e patas</Text>
      </View>

      {/* Card Branco Central */}
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Bem-vindo de volta</Text>
        
        <Text style={styles.label}>E-mail ou Usuário</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="at" size={18} color="#A0A0A0" />
          <TextInput style={styles.input} placeholder="nome@exemplo.com" placeholderTextColor="#A0A0A0" />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Senha</Text>
          <TouchableOpacity><Text style={styles.forgotPass}>Esqueceu sua senha?</Text></TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={18} color="#A0A0A0" />
          <TextInput style={styles.input} placeholder="Sua senha secreta" secureTextEntry placeholderTextColor="#A0A0A0" />
          <FontAwesome name="eye" size={18} color="#A0A0A0" />
        </View>

        {/* BOTÃO QUE FAZ A NAVEGAÇÃO PARA O FEED */}
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.replace('/(tabs)/home')}>
            <Text style={styles.loginBtnText}>Entrar</Text>
          </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.line} /><Text style={styles.dividerText}>Ou continue com</Text><View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome name="google" size={20} color="#DB4437" />
            <Text style={styles.socialBtnText}> Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome name="apple" size={20} color="black" />
            <Text style={styles.socialBtnText}> Apple</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Ainda não tem uma conta? <Text style={styles.signUp}>Cadastre-se</Text></Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7F4', justifyContent: 'center' },
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
  loginBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 10, color: '#A0A0A0', fontSize: 14 },
  socialRow: { flexDirection: 'row', gap: 15 },
  socialBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FAF6', padding: 15, borderRadius: 25 },
  socialBtnText: { fontWeight: '600', marginLeft: 8 },
  footerText: { textAlign: 'center', marginTop: 30, color: '#666', fontSize: 15 },
  signUp: { color: '#2E8B57', fontWeight: '800' }
});
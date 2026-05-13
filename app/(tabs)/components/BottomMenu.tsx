import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BottomMenu = () => {
  const router = useRouter();
  const pathname = usePathname(); // Identifica em qual tela o usuário está

  // Função auxiliar para verificar se a rota está ativa
  const isActive = (route: string) => pathname === route;

  const NavItem = ({ route, icon, label }: { route: string, icon: any, label: string }) => {
    const active = isActive(route);
    return (
      <TouchableOpacity 
        style={active ? styles.navItemActive : styles.navItem} 
        onPress={() => router.push(route)}
      >
        <Ionicons 
          name={active ? icon : `${icon}-outline`} 
          size={22} 
          color={active ? "#1E6F42" : "#A0A0A0"} 
        />
        <Text style={active ? styles.navTextActive : styles.navText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bottomBar}>
      <NavItem route="/home" icon="home" label="Home" />
      <NavItem route="/search" icon="search" label="Search" />
      <NavItem route="/favorites" icon="heart" label="Favorites" />
      <NavItem route="/profile" icon="person" label="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: 'white', paddingVertical: 12, paddingBottom: 25,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    elevation: 20, position: 'absolute', bottom: 0, width: '100%',
  },
  navItem: { alignItems: 'center', padding: 10 },
  navItemActive: { 
    alignItems: 'center', backgroundColor: '#E8F5E9', 
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 
  },
  navText: { fontSize: 10, color: '#A0A0A0', marginTop: 4 },
  navTextActive: { fontSize: 10, color: '#1E6F42', fontWeight: '700', marginTop: 4 },
});

export default BottomMenu;
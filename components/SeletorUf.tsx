import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ESTADOS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

interface SeletorUfProps {
  value: string;
  onChange: (sigla: string) => void;
  disabled?: boolean;
}

export default function SeletorUf({ value, onChange, disabled }: SeletorUfProps) {
  const [aberto, setAberto] = useState(false);

  const estadoSelecionado = ESTADOS.find((e) => e.sigla === value);

  return (
    <>
      <TouchableOpacity
        style={styles.campo}
        onPress={() => setAberto(true)}
        disabled={disabled}
      >
        <Text style={value ? styles.valorTexto : styles.placeholderTexto}>
          {value || 'UF'}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#A0A0A0" />
      </TouchableOpacity>

      <Modal visible={aberto} animationType="slide" transparent onRequestClose={() => setAberto(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setAberto(false)}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitulo}>Selecione o estado</Text>
              <TouchableOpacity onPress={() => setAberto(false)}>
                <Ionicons name="close" size={24} color="#1A3626" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={ESTADOS}
              keyExtractor={(item) => item.sigla}
              style={{ maxHeight: 400 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, item.sigla === value && styles.itemSelecionado]}
                  onPress={() => {
                    onChange(item.sigla);
                    setAberto(false);
                  }}
                >
                  <Text style={styles.itemSigla}>{item.sigla}</Text>
                  <Text style={styles.itemNome}>{item.nome}</Text>
                  {item.sigla === value && (
                    <Ionicons name="checkmark" size={20} color="#2E8B57" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  valorTexto: { fontSize: 16, color: '#1A3626' },
  placeholderTexto: { fontSize: 16, color: '#A0A0A0' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetTitulo: { fontSize: 18, fontWeight: '800', color: '#1A3626' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemSelecionado: { backgroundColor: '#F0FAF3' },
  itemSigla: { fontSize: 15, fontWeight: '800', color: '#2E8B57', width: 32 },
  itemNome: { fontSize: 15, color: '#333', flex: 1 },
});

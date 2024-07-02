import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function Tarjeta() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Título de la Tarjeta</Text>
      <Text style={styles.cardContent}>Contenido de la tarjeta. Aquí puedes poner una breve descripción o información relevante.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#333',
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen({ navigation, route }) {
  const { url } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Loading...</Text>
      </View>
      <WebView source={{ uri: url }} style={styles.webview} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#0a2540',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
  title: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  webview: {
    flex: 1,
  },
});

// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AdminHomeScreen from '../../src/screens/AdminHomeScreen';

// export default function Index() {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <AdminHomeScreen />
//     </SafeAreaView>
//   );
// }


// src/screens/AdminHomeScreen.tsx
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { JSX } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  icon: JSX.Element;
  title: string;
  onPress?: () => void;
}

function AdminButton({ icon, title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function AdminHomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Application Admin</Text>
      </View>

      <View style={styles.buttonContainer}>
        <AdminButton
          icon={<MaterialIcons name="access-time" size={24} color="white" />}
          title="Afficher les heures"
        />
        <AdminButton
          icon={<MaterialIcons name="person-add" size={24} color="white" />}
          title="Afficher les utilisateurs"
        />
        <AdminButton
          icon={<MaterialCommunityIcons name="chart-bar" size={24} color="white" />}
          title="Classement"
        />
        <AdminButton
          icon={<Entypo name="cross" size={24} color="white" />}
          title="Erreurs"
        />
      </View>

      <Text style={styles.version}>v: 2.3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    backgroundColor: '#4267B2',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 30,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4267B2',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#999',
  },
});

import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera, useCameraPermissions, CameraType } from 'expo-camera';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Text, SafeAreaView } from 'react-native';

let typeCamera : CameraType = "back"

const Home: React.FC = () => {
  const cameraRef = React.useRef<CameraView>(null);
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
  
      <View style={stylesButton.buttonRow}>
        <TouchableOpacity style={stylesButton.buttonSub} onPress={() => router.push('/Camera')}>
          <Text style={stylesButton.buttonText}>Detech ảnh và video</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={stylesButton.buttonSub} onPress={() => router.push('/Update')}>
          <Text style={stylesButton.buttonText}>Tải ảnh / video</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  const stylesButton = StyleSheet.create({
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
      backgroundColor: '#fff',
    },
    buttonSub: {
      backgroundColor: '#007AFF', // màu xanh iOS
      borderRadius: 10,
      paddingVertical: 10,
      width: '30%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 14,
    },
  });

export default Home;
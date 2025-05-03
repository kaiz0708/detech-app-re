import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera, useCameraPermissions, CameraType } from 'expo-camera';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Text, SafeAreaView } from 'react-native';

let typeCamera : CameraType = "back"

const Home: React.FC = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={stylesButton.buttonContainer}>
        <View style={stylesButton.buttonRow}>
          <TouchableOpacity style={stylesButton.buttonSub} onPress={() => router.push('/Camera')}>
            <Text style={stylesButton.buttonText}>Detech ảnh và stream</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesButton.buttonSub} onPress={() => router.push('/Update')}>
            <Text style={stylesButton.buttonText}>Tải ảnh / video</Text>
          </TouchableOpacity>
        </View>
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
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      paddingBottom: 10,
      paddingTop: 10,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 10,
    },
    buttonSub: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      width: '40%',
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
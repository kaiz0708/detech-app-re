import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { Camera, CameraView, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import detectImage from '../service/detechService';

const cameraType : CameraType = 'back';

const CameraScreen: React.FC = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaStatus === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Image URI:', photo?.uri);

        await detectImage(photo?.uri); 
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
      }
    }
  };

  if (hasCameraPermission === null || hasMediaLibraryPermission === null) {
    return <Text>Đang yêu cầu quyền truy cập...</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>Không có quyền truy cập camera</Text>;
  }
  

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={cameraType}
        onCameraReady={() => setIsCameraReady(true)}
      ></CameraView>
      <View style={styles.buttonContainer}>
        <Button title="Chụp và detect" onPress={takePicture} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
});

export default CameraScreen;

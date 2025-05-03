import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Camera, CameraView, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import detectImage from '../service/detechService';
import fetchSignInfo from '../service/getText';

const cameraType: CameraType = 'back';

const CameraScreen: React.FC = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(true);
  const cameraRef = useRef<CameraView>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');

  const [mediaData, setMediaData] = useState<{
    type: 'image' | 'video' | null;
    uri: string | null;
    signs: string[];
  }>({
    type: null,
    uri: null,
    signs: [],
  });

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaStatus === 'granted');
    })();
  }, []);

  const getText = async (sign: string) => {
    const res = await fetchSignInfo(sign);
    setFullText(res);
    setDisplayedText('');
  };

  useEffect(() => {
    let i = 0;
    let interval: any;

    if (fullText) {
      const chars = Array.from(fullText); // hỗ trợ Unicode đúng cách
      interval = setInterval(() => {
        setDisplayedText((prev) => prev + chars[i]);
        i++;
        if (i >= chars.length) {
          clearInterval(interval);
        }
      }, 20);
    }

    return () => clearInterval(interval);
  }, [fullText]);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        console.log('Image URI:', photo?.uri);

        const result = await detectImage(photo?.uri);
        if (result?.processed_image) {
          setMediaData({
            type: 'image',
            uri: `data:image/jpeg;base64,${result.processed_image}`,
            signs: result.list_traffic_sign_detech || [],
          });
        }
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
        Alert.alert('Lỗi', 'Không thể chụp ảnh hoặc gửi ảnh');
      }
    }
  };

  const handleStream = () => {
    Alert.alert('Stream', 'Chức năng stream đang được phát triển!');
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
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        onCameraReady={() => setIsCameraReady(true)}
      />

      <View style={styles.buttonContainer}>
        <Button title="Chụp và detect" onPress={takePicture} />
        <View style={styles.spacer} />
        <Button title="Bắt đầu stream" onPress={handleStream} />
      </View>

      {mediaData.type === 'image' && mediaData.uri && (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <View style={styles.mediaDisplayContainer}>
            <Image source={{ uri: mediaData.uri }} style={styles.resultImage} />
            {mediaData.signs.length > 0 && (
              <View style={styles.signsContainer}>
                <Text style={styles.signsTitle}>Biển báo phát hiện:</Text>
                {mediaData.signs.map((sign, index) => (
                  <View key={index} style={styles.signRow}>
                    <Text style={styles.signText}>{sign}</Text>
                    <TouchableOpacity style={styles.explainButton} onPress={() => getText(sign)}>
                      <Text style={styles.explainButtonText}>Giải thích</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {displayedText !== '' && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>Giải thích:</Text>
                <Text style={styles.explanationText}>{displayedText}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 20,
  },
  spacer: {
    width: 20,
  },
  mediaDisplayContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  signsContainer: {
    marginTop: 16,
    width: '100%',
  },
  signsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  signRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  signText: {
    fontSize: 14,
    flex: 1,
  },
  explainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  explainButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  explanationContainer: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  explanationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 14,
    color: '#333',
  },
});

export default CameraScreen;
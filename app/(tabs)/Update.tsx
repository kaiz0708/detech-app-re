import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import detectImage from '../service/detechService';
import { useVideoPlayer, VideoPlayer, VideoView, VideoSource } from 'expo-video';
import { useEvent } from 'expo';


const UploadScreen: React.FC = () => {
  const [mediaData, setMediaData] = useState<{
    type: 'image' | 'video' | null;
    uri: string | any | null;
    signs: string[];
  }>({
    type: null,
    uri: null,
    signs: [],
  });
  const player = useVideoPlayer('http://172.16.12.57:5000/static/processed/processed_media.mp4', (player) => {
    console.log('Player initialized');
  });

  useEffect(() => {
    if (player) {
      player.play();
    }
  }, [player]);

  const playerRef = useRef<VideoView>(null);


  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Cần cấp quyền để truy cập thư viện ảnh/video!');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos", "livePhotos"],
      allowsEditing: false,
      quality: 1,
    });

    if (!res.canceled) {
      try {
        const result = await detectImage(res.assets[0].uri);
        if (result) {
          if (result.processed_image) {
            setMediaData({
              type: 'image',
              uri: `data:image/jpeg;base64,${result.processed_image}`,
              signs: result.list_traffic_sign_detech || [],
            });
          } else if (result.processed_video) {

            const videoUrl = `http://172.16.12.57:5000/${result.processed_video}`;
            setMediaData({
              type: 'video',
              uri: videoUrl,
              signs: result.list_traffic_sign_detech || [],
            });
          }
        }
      } catch (err: any) {
        Alert.alert('Lỗi', 'Không thể xử lý tệp: ' + err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mediaData.type === 'image' && mediaData.uri && (
          <View style={styles.mediaFrame}>
            <Image
              source={{ uri: mediaData.uri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}

        
        <View style={styles.mediaFrame}>
         <VideoView 
          style={{ width: '100%', height: "100%" }}
          player={player} allowsFullscreen allowsPictureInPicture/>
        </View>
        

        {mediaData.signs.length > 0 && (
          <View style={styles.signsContainer}>
            <Text style={styles.signsTitle}>Biển báo phát hiện:</Text>
            {mediaData.signs.map((sign, index) => (
              <Text key={index} style={styles.signText}>
                - {sign}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickMedia}>
          <Text style={styles.buttonText}>Chọn ảnh hoặc video từ thư viện</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  mediaFrame: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
    resizeMode: "contain"
  },
  signsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  signsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  signText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});
export default UploadScreen;


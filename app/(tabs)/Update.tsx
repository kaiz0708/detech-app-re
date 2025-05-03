import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import detectImage from '../service/detechService';
import { useVideoPlayer, VideoPlayer, VideoView, VideoSource } from 'expo-video';
import { useEvent } from 'expo';
import fetchSignInfo from '../service/getText';


const UploadScreen: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');
  const [mediaData, setMediaData] = useState<{
    type: 'image' | 'video' | null;
    uri: string | any | null;
    signs: string[];
  }>({
    type: null,
    uri: null,
    signs: [],
  });
  const player = useVideoPlayer("", (player) => {
    console.log(player)
  });

  const getText = async (sign : string) => {
    const res = await fetchSignInfo(sign);
    setFullText(res);
    setDisplayedText('');
  }

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

  const videoSource = useMemo(() => ({ uri: mediaData.uri }), [mediaData.uri]);

  useEffect(() => {
    if (mediaData.type === 'video' && videoSource.uri) {
      player.replace(videoSource);
    }
  }, [videoSource]);

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

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

            const videoUrl = `http://192.168.1.131:5000/${result.processed_video}`;
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

        {mediaData.type === "video" && mediaData.uri && (
            <View style={styles.mediaFrame}>
              <VideoView 
                style={{ width: '100%', height: 400 }}
                player={player} contentFit="contain" nativeControls/>
            </View>
          )}
        

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
  },
  signsContainer: {
    marginTop: 16,
    width : "100%"
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
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  
});
export default UploadScreen;


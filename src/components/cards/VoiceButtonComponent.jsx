import { Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useRef, useEffect} from 'react'

import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useDispatch, useSelector } from 'react-redux';

import { generateSpeech } from '../../api/audio';


export default function VoiceButtonComponent({ text, language }) {


    const [isPlaying, setIsPlaying] = useState(false);

    // Ref to hold our Sound object
    const soundRef = useRef(new Audio.Sound());

    
    const playSound = async (wordText) => {
      if (isPlaying) return;
      setIsPlaying(true);
    
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
    
        // 1. Call the API directly, NOT through Redux
        const audioBlob = await generateSpeech({
          text: wordText,
          language: language,
        });

        if (!audioBlob) {
            setIsPlaying(false);
            return;
        }
        const fileName = `${wordText}_${Date.now()}.mp3`;
        const localUri = `${FileSystem.cacheDirectory}${fileName}`;
    
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        });
    
        await FileSystem.writeAsStringAsync(localUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
    
        await soundRef.current.loadAsync({ uri: localUri });
        await soundRef.current.playAsync();
    
        soundRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
    
      } catch (error) {
        console.error('Failed to play sound', error);
        Alert.alert("Error", "Could not play audio. Please try again.");
        setIsPlaying(false);
      }
    };
    
    
        // Cleanup function stays the same
      useEffect(() => {
        return () => {
          if (soundRef.current) {
            soundRef.current.unloadAsync();
          }
        };
      }, []);
    

    return (
        <TouchableOpacity
            onPress={(e) => {
                e.stopPropagation();
                playSound(text);
            }}
            className="p-2"
            accessibilityLabel="Play pronunciation"
            disabled={isPlaying} // Disable button while playing
        >
            <Ionicons
                name={'volume-medium-outline'}
                size={22}
                color={isPlaying ? '#d1d5db' : '#4B5563'} // Change color when playing
            />
        </TouchableOpacity>

    )
}


// PlaySong.js

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function PlaySong() {
    const route = useRoute();
    const navigation = useNavigation();
    const { song } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const soundRef = useRef(new Audio.Sound());

    const playPauseSong = async () => {
        try {
            if (isPlaying) {
                await soundRef.current.pauseAsync();
            } else {
                if (soundRef.current._loaded) {
                    await soundRef.current.playAsync();
                } else {
                    const { sound } = await Audio.Sound.createAsync(
                        { uri: song.song_url },
                        { shouldPlay: true }
                    );
                    soundRef.current = sound;
                }
            }
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.error('Error playing/pausing sound:', error);
        }
    };

    const skipToPrevious = () => {
        // Functionality for previous song
        console.log('Previous button pressed');
    };

    const skipToNext = () => {
        // Functionality for next song
        console.log('Next button pressed');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={{ uri: song.album_art_url }} style={styles.albumArt} />
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.artist}>{song.artist}</Text>
            <View style={styles.controls}>
                <TouchableOpacity onPress={skipToPrevious} style={styles.controlButton}>
                    <FontAwesome name="step-backward" size={40} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={playPauseSong} style={styles.controlButton}>
                    <FontAwesome
                        name={isPlaying ? "pause-circle" : "play-circle"}
                        size={60}
                        color="white"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={skipToNext} style={styles.controlButton}>
                    <FontAwesome name="step-forward" size={40} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    albumArt: {
        width: 300,
        height: 300,
        borderRadius: 15,
        marginBottom: 20,
    },
    songTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    artist: {
        color: 'white',
        fontSize: 18,
        marginBottom: 30,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlButton: {
        marginHorizontal: 20,
    },
});

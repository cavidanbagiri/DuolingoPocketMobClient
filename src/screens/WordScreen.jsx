
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';


import React, { Component, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';

import WordService from '../services/WordService.js';

import VocabCard from '../components/cards/VocabCard';
import FilterComponent from '../components/wordscreen/FilterComponent.jsx';


export default function WordScreen() {


    const dispatch = useDispatch();

    const { is_auth } = useSelector((state) => state.authSlice);

    const { words, words_pending, is_words_error, is_words_success } = useSelector((state) => state.wordSlice);

    useEffect(() => {
        if (is_auth === false) {
            return;
        }
        dispatch(WordService.fetchWords());
    }, [is_auth]);

    return (

        <SafeAreaView>
            <FilterComponent />

            <ScrollView contentContainerStyle={styles.container}>
                {words_pending && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <ActivityIndicator
                            size="large"
                            color="#0000ff" // Change to your preferred color
                        />
                        <Text style={{ marginTop: 10 }}>Loading words...</Text>
                    </View>
                )}

                {!words_pending && words.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        There is not any starred word
                    </Text>
                )}

                {/* Words list */}
                {!words_pending && words.length > 0 &&
                    words.map((word, index) => (
                        <VocabCard word={word} key={index} />
                    ))
                }
            </ScrollView>
        </SafeAreaView>

        // <SafeAreaView>

        //     <FilterComponent />

        //     <ScrollView contentContainerStyle={styles.container}>

        //         {
        //             words_pending &&
        //             <Text>Fetching Words</Text>
        //         }
        //         {
        //             words.map((word, index) => (
        //                 <VocabCard word={word} key={index} />
        //             ))
        //         }

        //     </ScrollView>

        // </SafeAreaView>

    )
}



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
    },
});
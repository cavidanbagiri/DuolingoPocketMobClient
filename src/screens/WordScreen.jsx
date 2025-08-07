
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';


import React, { Component, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';

import WordService from '../services/WordService.js';

import VocabCard from '../components/cards/VocabCard';


export default function WordScreen() {


    const dispatch = useDispatch();

    const {is_auth} = useSelector((state) => state.authSlice);

    const { words, words_pending, is_words_error, is_words_success } = useSelector((state) => state.wordSlice);

    useEffect(() => {
        if (is_auth === false) {
            return;
        }
        dispatch(WordService.fetchWords());
    }, [is_auth]);

    return (

        <SafeAreaView>


            <ScrollView contentContainerStyle={styles.container}>

                <TouchableOpacity onPress={() => dispatch(WordService.fetchWords())}>
                    <Text>Fetch Words</Text>
                </TouchableOpacity>

                {
                    words_pending &&
                    <Text>Fetching Words</Text>
                }
                {
                    words.map(( word, index) => (
                        <VocabCard word={word}  key={index} />
                    ))
                }

            </ScrollView>

        </SafeAreaView>

    )
}



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
    },
});
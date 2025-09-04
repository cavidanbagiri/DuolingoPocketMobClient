

import { Text, View, FlatList } from 'react-native'
import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';

import { setSelectedLanguage } from '../../store/word_store';

import WordService from '../../services/WordService.js';

import VocabCard from '../cards/VocabCard';

export function WordList({screen}) {

    const dispatch = useDispatch();

    const { words, loading, selectedLanguage } = useSelector((state) => state.wordSlice);

    const [filter, setFilter] = useState('all');


    return (

        <FlatList
            className='bg-white mt-1'
            data={words}
            renderItem={({ item }) => <VocabCard word={item} language={selectedLanguage} />}
            keyExtractor={(item) => item.id.toString()}
            refreshing={loading}
            onRefresh={() => {
                if (screen === 'LearnedScreen') {
                    dispatch(setSelectedLanguage(selectedLanguage));
                    dispatch(WordService.handleLanguageSelect({
                        filter: 'learned',
                        langCode: selectedLanguage
                    }))
                }
                else if (screen === 'WordScreen') {
                    dispatch(setSelectedLanguage(selectedLanguage));
                    dispatch(WordService.handleLanguageSelect({
                        filter,
                        langCode: selectedLanguage
                    }))
                }

                
            }}
        />

    )
}

export default WordList
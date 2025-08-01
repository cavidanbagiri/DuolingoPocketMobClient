import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { Component } from 'react'
import VocabCard from '../components/cards/VocabCard';


import { SafeAreaView } from 'react-native-safe-area-context';


export default function WordScreen() {
    return (

        <SafeAreaView>

            <ScrollView contentContainerStyle={styles.container}>

                <VocabCard />
                <VocabCard />
                <VocabCard />
                <VocabCard />
                <VocabCard />
                <VocabCard />
                <VocabCard />
                <VocabCard />
                <VocabCard />

            </ScrollView>

        </SafeAreaView>

    )
}



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#F5FCFF',
    },
});
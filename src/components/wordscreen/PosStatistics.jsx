

import React, {useEffect} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import WordService from "../../services/WordService";
import {useDispatch, useSelector} from "react-redux";

export default function PosStatistics() {

    const dispatch = useDispatch()

    const pos_statistics = useSelector(state => state.wordSlice.pos_statistics)

    const handlePosClick = (pos) => {
        //dispatch(WordService.fetchWords({ pos }));
        console.log('pos is ', pos);
    };

    // Fetch Word Pos Statistics
    useEffect(() => {
        dispatch(WordService.getPosStatistics());
    }, []);


    return (
        <View className="flex flex-row flex-wrap items-end justify-end mb-4">
            {pos_statistics &&
                pos_statistics.map((item, index) => (
                    <View key={index} className="flex flex-row flex-wrap items-center gap-2">

                        <TouchableOpacity
                            onPress={() => handlePosClick("noun")}
                            className="flex flex-row p-2 bg-gray-100 mx-1 mb-2 rounded-lg"
                        >
                            <Text className="font-bold">Noun </Text>
                            <Text>{item.noun}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handlePosClick("verb")}
                            className="flex flex-row p-2 bg-gray-100 mx-1 mb-2 rounded-lg"
                        >
                            <Text className="font-bold">verb </Text>
                            <Text>{item.verb}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handlePosClick("adj")}
                            className="flex flex-row p-2 bg-gray-100 mx-1 mb-2 rounded-lg"
                        >
                            <Text className="font-bold">adj </Text>
                            <Text>{item.adj}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handlePosClick("adv")}
                            className="flex flex-row p-2 bg-gray-100 mx-1 mb-2 rounded-lg"
                        >
                            <Text className="font-bold">adv </Text>
                            <Text>{item.adv}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handlePosClick("conjunction")}
                            className="flex flex-row p-2 bg-gray-100 mx-1 mb-2 rounded-lg"
                        >
                            <Text className="font-bold">conjunct </Text>
                            <Text>{item.conjunction}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handlePosClick("pronoun")}
                            className="flex flex-row p-2 bg-gray-100 mx-1 mb-2 rounded-lg"
                        >
                            <Text className="font-bold">pronoun </Text>
                            <Text>{item.pronoun}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handlePosClick("preposition")}
                            className="flex flex-row p-2 bg-gray-100 mx-1 mb-2 rounded-lg"
                        >
                            <Text className="font-bold">prep </Text>
                            <Text>{item.preposition}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
        </View>

    )
}
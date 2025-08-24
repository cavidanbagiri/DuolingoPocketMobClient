
import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure this is installed
import Feather from '@expo/vector-icons/Feather';

import { setWordsPendingFalse } from '../../store/word_store';


import WordService from '../../services/WordService';
import PosStatistics from "./PosStatistics";

const FilterComponent = ({screen = 'all'}) => {

    const dispatch = useDispatch();

    const [filter, setFilter] = useState('all'); // 'all' or 'starred'

    const toggleFilter = () => {
        setFilter(prev => prev === 'all' ? 'starred' : 'all');
    };

    useEffect(() => {
        // dispatch(setWordsPendingFalse());
        // dispatch(WordService.fetchWords({ filter }));
    }, [filter]);



    return (
        <View className='flex flex-col px-10 py-5 '>

            {/* Fetch POS Statistics and show it */}

            {
                screen !== 'learned' &&
                    <PosStatistics  />
            }

            {
                screen !== 'learned' &&
                <View className='flex flex-row justify-between'>
                    
                    {/* For starred words */}
                    <TouchableOpacity className='flex flex-row  justify-center items-center'
                    onPress={toggleFilter}>
                        <Ionicons
                            name={filter === 'starred' ? 'star' : 'star-outline'}
                            size={20}
                            color={filter === 'starred' ? '#facc15' : '#6b7280'}
                            style={styles.icon}
                        />
                        <Text className='text-xl text-gray-800 font-medium'>
                            {filter === 'starred' ? 'Starred' : 'All'}
                        </Text>
                    </TouchableOpacity>

                    {/* For Fetch BTN */}
                    <TouchableOpacity className=' p-1'
                    onPress={() => {
                        setFilter('all')
                        dispatch(WordService.fetchWords())
                    }}>
                        <Feather name="refresh-ccw" size={24} color="black" />
                    </TouchableOpacity>

                </View>

            }
            



        </View>
    );
};

export default FilterComponent;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 10,
        alignItems: 'flex-start',
        backgroundColor: '#f3f4f6',
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e5e7eb',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
});



// import React from 'react'
// import { useDispatch } from 'react-redux'

// import { View, Text, TouchableOpacity } from 'react-native'

// import WordService from '../../services/WordService'


// const FilterComponent = () => {

//     const dispatch = useDispatch();

//     return (
//         <View>
//             <TouchableOpacity onPress={() => dispatch(WordService.fetchWords())}>
//                 <Text>Fetch Words</Text>
//             </TouchableOpacity>
//         </View>
//     )

// }

// export default FilterComponent
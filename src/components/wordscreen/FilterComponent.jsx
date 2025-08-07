
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure this is installed

import WordService from '../../services/WordService';

const FilterComponent = () => {

    const dispatch = useDispatch();

    const [filter, setFilter] = useState('all'); // 'all' or 'starred'

    const handleFetch = () => {
        dispatch(WordService.fetchWords({ filter }));
    };

    const toggleFilter = () => {
        const newFilter = filter === 'all' ? 'starred' : 'all';
        setFilter(newFilter);
        console.log('.............new filter is ', filter);
        dispatch(WordService.fetchWords({ filter }));
    };

    return (
        <View style={styles.container}>
            
            {/* For Fetch BTN */}
            <View>
                <TouchableOpacity style={styles.button} onPress={() => dispatch(WordService.fetchWords())}>
                    <Ionicons name="refresh" size={20} color="#1f2937" style={styles.icon} />
                </TouchableOpacity>
            </View>

            {/* For starred words */}
            <TouchableOpacity style={styles.toggleButton} onPress={toggleFilter}>
                <Ionicons
                    name={filter === 'starred' ? 'star' : 'star-outline'}
                    size={18}
                    color={filter === 'starred' ? '#facc15' : '#6b7280'}
                    style={styles.icon}
                />
                <Text style={styles.text}>
                    {filter === 'starred' ? 'Starred' : 'All'}
                </Text>
            </TouchableOpacity>


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
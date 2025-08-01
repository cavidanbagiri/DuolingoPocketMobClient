

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

export default function VocabCard() {

    const navigation = useNavigation();

    const word = {
        en: 'go',
        type: 'verb',
        ru: 'идти',
    }

    const [isStarred, setIsStarred] = useState(false);
    const [isLearned, setIsLearned] = useState(false);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CardDetail', { word })}
        >
            {/* Top right icons */}
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => setIsStarred(!isStarred)}>
                    <Ionicons
                        name={isStarred ? 'star' : 'star-outline'}
                        size={24}
                        color={isStarred ? '#f4c542' : '#888'}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsLearned(!isLearned)}>
                    <Ionicons
                        name={isLearned ? 'checkmark-circle' : 'checkmark-circle-outline'}
                        size={24}
                        color={isLearned ? '#4caf50' : '#888'}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>

            {/* Word content */}
            <View style={styles.textContainer}>
                <Text style={styles.en}>go</Text>
                <Text style={styles.type}>verb</Text>
                <Text style={styles.ru}>идти</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        position: 'relative',
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        top: 10,
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
    },
    textContainer: {
        alignItems: 'flex-start',
    },
    en: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    type: {
        fontSize: 16,
        color: '#666',
        marginVertical: 4,
    },
    ru: {
        fontSize: 20,
        color: '#007acc',
    },
});






// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function VocabCard() {
//   const [isStarred, setIsStarred] = useState(false);
//   const [isLearned, setIsLearned] = useState(false);

//   return (
//     <View style={styles.card}>
//       {/* Top right icons */}
//       <View style={styles.iconContainer}>
//         <TouchableOpacity onPress={() => setIsStarred(!isStarred)}>
//           <Ionicons
//             name={isStarred ? 'star' : 'star-outline'}
//             size={24}
//             color={isStarred ? '#f4c542' : '#888'}
//             style={styles.icon}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setIsLearned(!isLearned)}>
//           <Ionicons
//             name={isLearned ? 'checkmark-circle' : 'checkmark-circle-outline'}
//             size={24}
//             color={isLearned ? '#4caf50' : '#888'}
//             style={styles.icon}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Word content */}
//       <View style={styles.textContainer}>
//         <Text style={styles.en}>go</Text>
//         <Text style={styles.type}>verb</Text>
//         <Text style={styles.ru}>идти</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginVertical: 10,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     position: 'relative',
//   },
//   iconContainer: {
//     position: 'absolute',
//     right: 10,
//     top: 10,
//     flexDirection: 'row',
//   },
//   icon: {
//     marginLeft: 10,
//   },
//   textContainer: {
//     alignItems: 'flex-start',
//   },
//   en: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   type: {
//     fontSize: 16,
//     color: '#666',
//     marginVertical: 4,
//   },
//   ru: {
//     fontSize: 20,
//     color: '#007acc',
//   },
// });



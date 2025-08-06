

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function VocabCard({ word }) {
  const navigation = useNavigation();

  const [isStarred, setIsStarred] = useState(false);
  const [isLearned, setIsLearned] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CardDetail', { word })}
      activeOpacity={0.9}
    >
      {/* Word Text */}
      <View style={styles.header}>
        <Text style={styles.word}>{word.text}</Text>
        <Text style={styles.level}>Level {word.level ?? '-'}</Text>
      </View>

      {/* POS and Translation */}
      <View style={styles.body}>
        <Text style={styles.pos}>{word.pos ?? '-'}</Text>
        <Text style={styles.translation}>{word.translation_to_native ?? '-'}</Text>
      </View>

      {/* Bottom row: freq + icons */}
      <View style={styles.footer}>
        <Text style={styles.frequency}># {word.frequency_rank ?? '-'}</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => setIsStarred(!isStarred)}>
            <Ionicons
              name={isStarred ? 'star' : 'star-outline'}
              size={22}
              color={isStarred ? '#facc15' : '#9ca3af'}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLearned(!isLearned)}>
            <Ionicons
              name={isLearned ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={22}
              color={isLearned ? '#4ade80' : '#9ca3af'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: {
    width: '90%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  word: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  level: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  body: {
    marginVertical: 10,
  },
  pos: {
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '500',
    marginBottom: 4,
  },
  translation: {
    fontSize: 18,
    color: '#2563eb',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequency: {
    fontSize: 12,
    color: '#9ca3af',
  },
  iconGroup: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 12,
  },
});





// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// import { Ionicons } from '@expo/vector-icons';

// export default function VocabCard({word}) {

//     const navigation = useNavigation();


//     const [isStarred, setIsStarred] = useState(false);
//     const [isLearned, setIsLearned] = useState(false);

//     return (
//         <TouchableOpacity
//             style={styles.card}
//             onPress={() => navigation.navigate('CardDetail', { word })}
//         >
//             <View style={styles.iconContainer}>
//                 <TouchableOpacity onPress={() => setIsStarred(!isStarred)}>
//                     <Ionicons
//                         name={isStarred ? 'star' : 'star-outline'}
//                         size={24}
//                         color={isStarred ? '#f4c542' : '#888'}
//                         style={styles.icon}
//                     />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setIsLearned(!isLearned)}>
//                     <Ionicons
//                         name={isLearned ? 'checkmark-circle' : 'checkmark-circle-outline'}
//                         size={24}
//                         color={isLearned ? '#4caf50' : '#888'}
//                         style={styles.icon}
//                     />
//                 </TouchableOpacity>
//             </View>

//             {/* Word content */}
//             <View style={styles.textContainer}>
//                 <Text style={styles.en}>{word.text}</Text>
//                 <Text style={styles.type}>{word.pos}</Text>
//                 <Text style={styles.ru}>{word.translation_to_native}</Text>
//             </View>
//         </TouchableOpacity>
//     );
// }

// const styles = StyleSheet.create({
//     card: {
//         width: '90%',
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginVertical: 10,
//         elevation: 4,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         position: 'relative',
//     },
//     iconContainer: {
//         position: 'absolute',
//         right: 10,
//         top: 10,
//         flexDirection: 'row',
//     },
//     icon: {
//         marginLeft: 10,
//     },
//     textContainer: {
//         alignItems: 'flex-start',
//     },
//     en: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     type: {
//         fontSize: 16,
//         color: '#666',
//         marginVertical: 4,
//     },
//     ru: {
//         fontSize: 20,
//         color: '#007acc',
//     },
// });




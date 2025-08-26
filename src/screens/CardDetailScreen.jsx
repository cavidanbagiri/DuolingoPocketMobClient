
// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';

// import { useSelector, useDispatch } from 'react-redux';

// import { SafeAreaView } from 'react-native-safe-area-context';

// import { clearDetail } from '../store/word_store';

// import WordService from '../services/WordService';

// export default function CardDetailScreen({ route }) {
//   const dispatch = useDispatch();
//   const { word } = route.params;

//   const detail = useSelector((state) => state.wordSlice.detail);
//   const loading = useSelector((state) => state.wordSlice.loading);

//   useEffect(() => {
//     dispatch(WordService.getDetailWord(word.id));
//     return () => {
//       dispatch(clearDetail());
//     };
//   }, [word]);

//   if (loading || !detail || !Array.isArray(detail.meanings)) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <ActivityIndicator size="large" />
//       </SafeAreaView>
//     );
//   }

//   return (


//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scroll}>


//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => {
//             dispatch(WordService.setStatus({
//               word_id: detail?.id,
//               action: 'star',
//             }))

//             dispatch(WordService.getDetailWord(detail.id));
//           }

//           }
//         >
//           <Text style={styles.buttonText}>
//             {detail?.is_starred ? '★ Unstar' : '☆ Star'}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => {
//             dispatch(WordService.setStatus({
//               word_id: detail?.id,
//               action: 'learned',
//             }))
//             dispatch(WordService.getDetailWord(detail.id));
//           }}
//         >
//           <Text style={styles.buttonText}>
//             {detail?.is_learned ? '✅ Unlearn' : '✅ Mark as Learned'}
//           </Text>
//         </TouchableOpacity>

//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.word}>{detail?.text}</Text>
//           <Text style={styles.translation}>
//             {detail?.translations[0]?.translated_text ?? 'No translation'}
//           </Text>
//           <View style={styles.metaRow}>
//             <Text style={styles.metaBadge}>CEFR: {detail?.level}</Text>
//             <Text style={styles.metaBadge}>Rank: {detail?.frequency_rank}</Text>
//           </View>
//           <View style={styles.metaRow}>
//             {detail?.is_starred && <Text style={styles.star}>⭐ Starred</Text>}
//             {detail?.is_learned && <Text style={styles.learned}>✅ Learned</Text>}
//             {!detail?.is_learned && (
//               <Text style={styles.strength}>💪 Strength: {detail?.strength}/100</Text>
//             )}
//           </View>
//         </View>

//         {/* Meanings */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Meanings</Text>
//           {detail?.meanings?.map((m) => (
//             <View key={m.id} style={styles.card}>
//               <Text style={styles.pos}>{m.pos}</Text>
//               <Text style={styles.example}>💬 {m.example}</Text>
//               {m.sentences.length > 0 && (
//                 <View>
//                   <Text style={styles.subTitle}>Sentences:</Text>
//                   {m.sentences.map((s) => (
//                     <View key={s.id} style={styles.sentenceBox}>
//                       <Text>{s.text}</Text>
//                       {s.translations.map((t, i) => (
//                         <Text key={i} style={styles.translationText}>
//                           ↳ {t.language_code}: {t.translated_text}
//                         </Text>
//                       ))}
//                     </View>
//                   ))}
//                 </View>
//               )}
//             </View>
//           ))}
//         </View>

//         {/* Example Sentences */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Example Sentences</Text>
//           {detail?.example_sentences?.map((s) => (
//             <View key={s.id} style={styles.card}>
//               <Text>{s.text}</Text>
//               {s.translations.map((t, i) => (
//                 <Text key={i} style={styles.translationText}>
//                   ↳ {t.language_code}: {t.translated_text}
//                 </Text>
//               ))}
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scroll: {
//     padding: 20,
//     paddingBottom: 100,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   word: {
//     fontSize: 36,
//     fontWeight: 'bold',
//   },
//   translation: {
//     fontSize: 24,
//     color: '#007acc',
//     marginVertical: 5,
//   },
//   metaRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 5,
//   },
//   metaBadge: {
//     fontSize: 14,
//     backgroundColor: '#eee',
//     marginHorizontal: 5,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },
//   star: {
//     color: '#f5a623',
//     fontSize: 14,
//     marginHorizontal: 5,
//   },
//   learned: {
//     color: 'green',
//     fontSize: 14,
//     marginHorizontal: 5,
//   },
//   strength: {
//     color: '#888',
//     fontSize: 14,
//     marginHorizontal: 5,
//   },
//   section: {
//     marginTop: 25,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   card: {
//     backgroundColor: '#f9f9f9',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   pos: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   example: {
//     fontStyle: 'italic',
//     marginBottom: 8,
//   },
//   subTitle: {
//     fontWeight: '600',
//     marginTop: 5,
//     marginBottom: 3,
//   },
//   sentenceBox: {
//     marginLeft: 10,
//     marginBottom: 6,
//   },
//   translationText: {
//     fontSize: 14,
//     color: '#555',
//   },
// });





import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearDetail, setDetail } from '../store/word_store'; // <-- make sure setDetail exists
import WordService from '../services/WordService';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CardDetailScreen({ route }) {
  const dispatch = useDispatch();
  const { word } = route.params;

  const detail = useSelector((state) => state.wordSlice.detail);
  const loading = useSelector((state) => state.wordSlice.loading);

  useEffect(() => {
    dispatch(WordService.getDetailWord(word.id));
    return () => {
      dispatch(clearDetail());
    };
  }, [word]);


  const toggleStatus = (actionKey) => {
    const actionType = actionKey === 'is_starred' ? 'star' : 'learned';
    const value = !detail[actionKey];

    // 1. Optimistic update
    dispatch(setDetail({ actionType, value }));

    // 2. Send request to backend
    dispatch(
      WordService.setStatus({
        word_id: detail?.id,
        action: actionType,
      })
    );
  };



  if (loading || !detail || !Array.isArray(detail.meanings)) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView className="flex-1 bg-gray-50">
  <ScrollView
    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
    showsVerticalScrollIndicator={false}
  >
    {/* Action Buttons - Sticky Feel (Top) */}
    <View className="flex-row space-x-3 mb-5">
      <TouchableOpacity
        onPress={() => toggleStatus('is_starred')}
        className={`flex-1 flex-row items-center justify-center p-4 rounded-2xl border-2 ${
          detail?.is_starred
            ? 'border-yellow-400 bg-yellow-50'
            : 'border-gray-200 bg-white'
        }`}
        style={{ elevation: 1 }}
      >
        <Ionicons
          name={detail?.is_starred ? 'star' : 'star-outline'}
          size={20}
          color={detail?.is_starred ? '#facc15' : '#9ca3af'}
        />
        <Text
          className={`ml-2 font-semibold ${
            detail?.is_starred ? 'text-yellow-700' : 'text-gray-700'
          }`}
          style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
        >
          {detail?.is_starred ? 'Unstar' : 'Star'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => toggleStatus('is_learned')}
        className={`flex-1 flex-row items-center justify-center p-4 rounded-2xl border-2 ${
          detail?.is_learned
            ? 'border-green-400 bg-green-50'
            : 'border-gray-200 bg-white'
        }`}
        style={{ elevation: 1 }}
      >
        <Ionicons
          name={detail?.is_learned ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={20}
          color={detail?.is_learned ? '#4ade80' : '#9ca3af'}
        />
        <Text
          className={`ml-2 font-semibold ${
            detail?.is_learned ? 'text-green-700' : 'text-gray-700'
          }`}
          style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
        >
          {detail?.is_learned ? 'Learned' : 'Learn'}

        </Text>
      </TouchableOpacity>
    </View>

    {/* Word Header */}
    <View className="bg-white p-6 rounded-2xl mb-6 shadow-sm border border-gray-100">
      <Text
        className="text-4xl font-bold text-gray-800 mb-2 tracking-tight"
        style={{ fontFamily: 'Poppins-Bold' }}
      >
        {detail?.text}
      </Text>

      <Text
        className="text-2xl text-indigo-600 mb-3"
        style={{ fontFamily: 'Poppins-Regular' }}
      >
        {detail?.translations[0]?.translated_text ?? 'No translation'}
      </Text>

      {/* Meta Info */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        <View className="bg-blue-100 px-3 py-1 rounded-full">
          <Text
            className="text-sm font-medium text-blue-700"
            style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
          >
            CEFR {detail?.level || 'A1'}
          </Text>
        </View>
        <View className="bg-purple-100 px-3 py-1 rounded-full">
          <Text
            className="text-sm font-medium text-purple-700"
            style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
          >
            # {detail?.frequency_rank || '–'}
          </Text>
        </View>
        {!detail?.is_learned && (
          <View className="bg-orange-100 px-3 py-1 rounded-full">
            <Text
              className="text-sm font-medium text-orange-700"
              style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
            >
              💪 Strength {detail?.strength || 0}/100
            </Text>
          </View>
        )}
      </View>

      {/* Status Badges */}
      <View className="flex-row items-center space-x-3">
        {detail?.is_starred && (
          <View className="flex-row items-center bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200">
            <Ionicons name="star" size={14} color="#facc15" />
            <Text
              className="ml-1 text-xs text-yellow-700 font-medium"
              style={{ fontFamily: 'IBMPlexSans-Regular' }}
            >
              Starred
            </Text>
          </View>
        )}
        {detail?.is_learned && (
          <View className="flex-row items-center bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
            <Text
              className="ml-1 text-xs text-green-700 font-medium"
              style={{ fontFamily: 'IBMPlexSans-Regular' }}
            >
              Learned
            </Text>
          </View>
        )}
      </View>
    </View>

    {/* Meanings Section */}
    <View className="mb-6">
      <Text
        className="text-xl font-bold text-gray-800 mb-4"
        style={{ fontFamily: 'Poppins-SemiBold' }}
      >
        Meanings & Examples
      </Text>

      {detail?.meanings?.map((m) => (
        <View
          key={m.id}
          className="bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-xs"
        >
          {/* POS */}
          <Text
            className="text-sm uppercase tracking-wide text-indigo-600 font-semibold mb-2"
            style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
          >
            {m.pos}
          </Text>

          {/* Example */}
          <Text
            className="text-base text-gray-700 mb-3 leading-relaxed"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            💬 {m.example}
          </Text>

          {/* Sentences */}
          {m.sentences.length > 0 && (
            <View className="mt-2 border-l-2 border-gray-200 pl-3">
              <Text
                className="text-sm font-semibold text-gray-600 mb-2"
                style={{ fontFamily: 'IBMPlexSans-SemiBold' }}
              >
                In context:
              </Text>
              {m.sentences.map((s) => (
                <View key={s.id} className="mb-2">
                  <Text
                    className="text-sm text-gray-800"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    {s.text}
                  </Text>
                  {s.translations.map((t, i) => (
                    <Text
                      key={i}
                      className="text-sm text-gray-500 ml-1"
                      style={{ fontFamily: 'IBMPlexSans-Regular' }}
                    >
                      ↳ {t.language_code.toUpperCase()}: {t.translated_text}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>

    {/* Example Sentences (Standalone) */}
    {detail?.example_sentences?.length > 0 && (
      <View className="mb-6">
        <Text
          className="text-xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Poppins-SemiBold' }}
        >
          More Examples
        </Text>
        {detail?.example_sentences?.map((s) => (
          <View
            key={s.id}
            className="bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-xs"
          >
            <Text
              className="text-base text-gray-800 mb-2"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              {s.text}
            </Text>
            {s.translations.map((t, i) => (
              <Text
                key={i}
                className="text-sm text-gray-500 ml-1"
                style={{ fontFamily: 'IBMPlexSans-Regular' }}
              >
                ↳ {t.language_code.toUpperCase()}: {t.translated_text}
              </Text>
            ))}
          </View>
        ))}
      </View>
    )}

    {/* Spacer at bottom */}
    <View className="h-8" />
  </ScrollView>
</SafeAreaView>

    // <SafeAreaView style={styles.container}>
    //   <ScrollView contentContainerStyle={styles.scroll}>
    //     {/* Star Button */}
    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => toggleStatus('is_starred')}
    //     >
    //       <Text style={styles.buttonText}>
    //         {detail?.is_starred ? '★ Unstar' : '☆ Star'}
    //       </Text>
    //     </TouchableOpacity>

    //     {/* Learned Button */}
    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => toggleStatus('is_learned')}
    //     >
    //       <Text style={styles.buttonText}>
    //         {detail?.is_learned ? '✅ Unlearn' : '✅ Mark as Learned'}
    //       </Text>
    //     </TouchableOpacity>

    //     {/* Header */}
    //     <View style={styles.header}>
    //       <Text style={styles.word}>{detail?.text}</Text>
    //       <Text style={styles.translation}>
    //         {detail?.translations[0]?.translated_text ?? 'No translation'}
    //       </Text>
    //       <View style={styles.metaRow}>
    //         <Text style={styles.metaBadge}>CEFR: {detail?.level}</Text>
    //         <Text style={styles.metaBadge}>Rank: {detail?.frequency_rank}</Text>
    //       </View>
    //       <View style={styles.metaRow}>
    //         {detail?.is_starred && <Text style={styles.star}>⭐ Starred</Text>}
    //         {detail?.is_learned && <Text style={styles.learned}>✅ Learned</Text>}
    //         {!detail?.is_learned && (
    //           <Text style={styles.strength}>
    //             💪 Strength: {detail?.strength}/100
    //           </Text>
    //         )}
    //       </View>
    //     </View>

    //     {/* Meanings */}
    //     <View style={styles.section}>
    //       <Text style={styles.sectionTitle}>Meanings</Text>
    //       {detail?.meanings?.map((m) => (
    //         <View key={m.id} style={styles.card}>
    //           <Text style={styles.pos}>{m.pos}</Text>
    //           <Text style={styles.example}>💬 {m.example}</Text>
    //           {m.sentences.length > 0 && (
    //             <View>
    //               <Text style={styles.subTitle}>Sentences:</Text>
    //               {m.sentences.map((s) => (
    //                 <View key={s.id} style={styles.sentenceBox}>
    //                   <Text>{s.text}</Text>
    //                   {s.translations.map((t, i) => (
    //                     <Text key={i} style={styles.translationText}>
    //                       ↳ {t.language_code}: {t.translated_text}
    //                     </Text>
    //                   ))}
    //                 </View>
    //               ))}
    //             </View>
    //           )}
    //         </View>
    //       ))}
    //     </View>

    //     {/* Example Sentences */}
    //     <View style={styles.section}>
    //       <Text style={styles.sectionTitle}>Example Sentences</Text>
    //       {detail?.example_sentences?.map((s) => (
    //         <View key={s.id} style={styles.card}>
    //           <Text>{s.text}</Text>
    //           {s.translations.map((t, i) => (
    //             <Text key={i} style={styles.translationText}>
    //               ↳ {t.language_code}: {t.translated_text}
    //             </Text>
    //           ))}
    //         </View>
    //       ))}
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
  );
}

// Your styles stay the same
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16 },
  button: {
    padding: 10,
    marginVertical: 6,
    backgroundColor: '#007acc',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  header: { marginBottom: 20, alignItems: 'center' },
  word: { fontSize: 30, fontWeight: 'bold' },
  translation: { fontSize: 24, color: '#007acc' },
  metaRow: { flexDirection: 'row', marginTop: 10 },
  metaBadge: { marginHorizontal: 6, fontSize: 14, color: '#555' },
  star: { color: '#FFD700', fontSize: 16, marginHorizontal: 5 },
  learned: { color: 'green', fontSize: 16, marginHorizontal: 5 },
  strength: { color: '#888', fontSize: 16, marginHorizontal: 5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  pos: { fontWeight: 'bold' },
  example: { fontStyle: 'italic', marginVertical: 5 },
  subTitle: { fontWeight: 'bold', marginTop: 5 },
  sentenceBox: { marginVertical: 4 },
  translationText: { color: '#555', marginLeft: 10 },
});

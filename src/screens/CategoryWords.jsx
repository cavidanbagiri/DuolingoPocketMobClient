import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FavoritesService from '../services/FavoritesService';
import {useEffect} from 'react';
import { clearCategoryWords } from '../store/category_words_store';
export default function CategoryWordsScreen({ navigation, route }) {
  const { categoryId, categoryName } = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  const { words, loading, error } = useSelector((state) => state.categoryWordsSlice);

  useEffect(() => {
    dispatch(FavoritesService.getCategoryWords(categoryId));
  }, [dispatch, categoryId]);

  const renderWordItem = ({ item }) => (
    <View className="bg-white p-4 rounded-lg mb-2 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-gray-900 font-medium text-base">{item.original_text}</Text>
          <Text className="text-gray-600 text-sm mt-1">{item.translated_text}</Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <Text className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            {item.from_lang}→{item.to_lang}
          </Text>
          <TouchableOpacity>
            <Ionicons name="heart" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {categoryName}
            </Text>
            <Text className="text-gray-500 text-sm">
              {words.length} word{words.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={words}
        renderItem={renderWordItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-4"
        refreshing={loading}
        onRefresh={() => dispatch(FavoritesService.getCategoryWords(categoryId))}
        ListEmptyComponent={
          loading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#6366F1" />
              <Text className="text-gray-500 mt-4">Loading words...</Text>
            </View>
          ) : (
            <View className="items-center justify-center py-20">
              <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 text-lg mt-4">No words in this category</Text>
              <Text className="text-gray-400 text-center mt-2 px-8">
                Add words to this category from the translate screen
              </Text>
            </View>
          )
        }
      />

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('Translate')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FavoritesService from '../services/FavoritesService';
import { useEffect, useState } from 'react';
import { clearCategoryWords } from '../store/category_words_store';




const BulkOperationsModal = ({ visible, onClose, selectedWord }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
    >
        <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-semibold text-gray-900">
                        Move "{selectedWord?.original_text}"
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-600 mb-4">Select destination category:</Text>

                <FlatList
                    data={[
                        { id: 1, name: 'Russian Verbs', icon: 'play', color: '#10B981' },
                        { id: 2, name: 'Spanish Nouns', icon: 'cube', color: '#F59E0B' },
                        { id: 3, name: 'French Phrases', icon: 'chatbubbles', color: '#EF4444' },
                    ]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex-row items-center py-3 border-b border-gray-100"
                            onPress={() => {
                                console.log(`Moving word ${selectedWord?.id} to category ${item.id}`);
                                onClose();
                            }}
                        >
                            <View
                                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                style={{ backgroundColor: item.color + '20' }}
                            >
                                <Ionicons name={item.icon} size={16} color={item.color} />
                            </View>
                            <Text className="text-gray-900 flex-1">{item.name}</Text>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </View>
    </Modal>
);



export default function CategoryWordsScreen({ navigation, route }) {

    const [selectedWord, setSelectedWord] = useState(null);
    const [showWordActionMenu, setShowWordActionMenu] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);

    const { categoryId, categoryName } = route.params;
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const { words, loading, error } = useSelector((state) => state.categoryWordsSlice);


const WordActionMenu = () => (
    <View className="absolute top-12 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50"> 
      {/* z-50 ensures menu is above overlay */}
      <TouchableOpacity
        className="flex-row items-center px-4 py-3 border-b border-gray-100"
        onPress={() => {
          console.log('Move button clicked');
          setShowBulkModal(true);
          setShowWordActionMenu(false);
        }}
      >
        <Ionicons name="copy-outline" size={20} color="#4B5563" />
        <Text className="ml-3 text-gray-700">Move to other category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center px-4 py-3"
        onPress={() => {
          console.log('Delete button clicked');
          setShowWordActionMenu(false);
        }}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
        <Text className="ml-3 text-red-600">Remove from favorites</Text>
      </TouchableOpacity>
    </View>
  );    const renderWordItem = ({ item }) => (
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

                    {/* 3-dot Menu Button for EACH WORD */}
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedWord(item);
                            setShowWordActionMenu(true);
                        }}
                        className="p-1"
                    >
                        <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Show menu only for this specific word */}
            {showWordActionMenu && selectedWord?.id === item.id && (
                <WordActionMenu />
            )}
        </View>
    );


    useEffect(() => {
        dispatch(FavoritesService.getCategoryWords(categoryId));
    }, [dispatch, categoryId]);

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

           {/* Overlay - should be BELOW the menu in the code order */}
      {showWordActionMenu && (
        <TouchableOpacity 
          className="absolute inset-0 z-40" 
          onPress={() => setShowWordActionMenu(false)}
        />
      )}

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

             {/* Menu should be rendered AFTER overlay so it appears on top */}
      {showWordActionMenu && selectedWord && (
        <WordActionMenu />
      )}

            {/* Bulk Operations Modal (for moving words) */}
            <BulkOperationsModal
                visible={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                selectedWord={selectedWord}
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


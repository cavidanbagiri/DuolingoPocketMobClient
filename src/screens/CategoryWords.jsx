import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Pressable } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FavoritesService from '../services/FavoritesService';
import { useEffect, useState, useRef } from 'react';
import { clearCategoryWords } from '../store/category_words_store';
import { updateCategoryCounts } from '../store/favorites_store';
import { extractErrorMessage } from '../utils/errorHandler';
import { setCurrentWord } from '../store/ai_store';
import { useNavigation } from '@react-navigation/native';
import Notification from '../components/ai/Notification';
import TRANSLATE_LANGUAGES_LIST from '../constants/TranslateLanguagesList';

const BulkOperationsModal = ({ visible, onClose, selectedWord, categories, categoryId, moveLoading, handleMoveWord }) => {

    
    if (!selectedWord) return null;

    return (
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
                            Move "{selectedWord.original_text}"
                        </Text>
                        <TouchableOpacity onPress={onClose} disabled={moveLoading}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-gray-600 mb-4">Select destination category:</Text>

                    {moveLoading ? (
                        <View className="py-8 items-center">
                            <ActivityIndicator size="large" color="#6366F1" />
                            <Text className="text-gray-500 mt-4">Moving word...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={categories.filter(cat => cat.id !== categoryId)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="flex-row items-center py-4 border-b border-gray-100"
                                    onPress={async () => { handleMoveWord(selectedWord.id, item.id); }}
                                    disabled={moveLoading}
                                >
                                    <View
                                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                        style={{ backgroundColor: item.color + '20' }}
                                    >
                                        <Ionicons name={item.icon} size={18} color={item.color} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-900 font-medium">{item.name}</Text>
                                        <Text className="text-gray-500 text-sm">
                                            {item.word_count} words
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
                            ListEmptyComponent={
                                <View className="py-8 items-center">
                                    <Ionicons name="folder-outline" size={32} color="#D1D5DB" />
                                    <Text className="text-gray-400 mt-4">No other categories found</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};


export default function CategoryWordsScreen({ navigation, route }) {

    
    const insets = useSafeAreaInsets();
    const navigate = useNavigation();
    const dispatch = useDispatch();

    const { words, loading } = useSelector((state) => state.categoryWordsSlice);
    const { categories } = useSelector((state) => state.favoritesSlice);

    const [selectedWordId, setSelectedWordId] = useState(null);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const { categoryId, categoryName } = route.params;
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [moveLoading, setMoveLoading] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    // Use ref to track the selected word for the modal
    const selectedWordRef = useRef(null);

    // New Added
    const [notification, setNotification] = useState({
        visible: false,
        message: '',
        type: 'success', // 'success', 'error', 'info'
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ visible: true, message, type });
    };

    const hideNotification = () => {
        setNotification({ ...notification, visible: false });
    };

    const generateAIWord = async (item) => {
        let to_language = ''
                let native_language = '';

                for (const [keys, value] of Object.entries(TRANSLATE_LANGUAGES_LIST)) {
                if (value === item.to_lang) {
                        to_language = keys;
                    }
                    if (value === item.from_lang) {
                        native_language = keys;
                    }
                }

                const payload = {
                    text: item.translated_text,
                    language_code: to_language,
                    native: native_language,
                }
                dispatch(setCurrentWord(payload))
                navigate.navigate('AIScreen', {
                    initialQuery: item.translated_text
                });
    }

    const WordActionMenu = ({ word, onClose }) => (
        <View className="bg-white rounded-lg shadow-lg border border-gray-200 ">
            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
                onPress={() => {
                    // Store the word directly in the ref
                    // selectedWordRef.current = word;
                    // setShowBulkModal(true);
                    // onClose();
                    console.log('Move button clicked for word:', word);
                    selectedWordRef.current = word;
                    console.log('Ref set to:', selectedWordRef.current);
                    setShowBulkModal(true);
                    console.log('Modal state set to true');
                    onClose();
                }}
                disabled={moveLoading}
            >
                <Ionicons name="copy-outline" size={20} color="#4B5563" />
                <Text className="ml-3 text-gray-700">Move to other category</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={() => {
                    handleDeleteWord(word);
                    onClose();
                }}
                disabled={deleteLoading}
            >
                {deleteLoading ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                    <>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        <Text className="ml-3 text-red-600">Remove from favorites</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderWordItem = ({ item, index }) => {
        const isMenuOpen = selectedWordId === item.id;
        
        // Format the date nicely
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        };

        return (
            <Pressable 
            onPress={() => {
                generateAIWord(item);
            }}
            className="bg-red-400 p-4 rounded-lg mb-2 shadow-sm border border-gray-100 relative" style={{ zIndex: isMenuOpen ? 100 : 1 }}>
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-gray-900 font-medium text-base">{item.original_text}</Text>
                        <Text className="text-gray-600 text-sm mt-1">{item.translated_text}</Text>
                        {/* Added timestamp */}
                        {item?.added_at && (
                            <Text className="text-gray-400 text-xs mt-2">
                                Added: {formatDate(item?.added_at)}
                            </Text>
                        )}
                    </View>

                    <View className="flex-row items-center space-x-2">
                        <Text className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            {item.from_lang}→{item.to_lang}
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                setSelectedWordId(isMenuOpen ? null : item.id);
                            }}
                            className="p-1 z-10"
                            disabled={deleteLoading}
                        >
                            <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Show menu only for this specific word */}
                {isMenuOpen && (
                    <View className="absolute top-full right-0 z-50 mt-1">
                        <WordActionMenu 
                            word={item} 
                            onClose={() => setSelectedWordId(null)}
                        />
                    </View>
                )}
            </Pressable>
        );
    };

    const handleDeleteWord = async (word) => {
        // Show confirmation alert
        console.log('this function is work')
        Alert.alert(
            "Remove from Favorites",
            `Are you sure you want to remove "${word.original_text}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        setDeleteLoading(true);
                        try {
                            await dispatch(FavoritesService.deleteFavoriteWord(word.id)).unwrap();
                            // Show success message
                            // Alert.alert("Success", "Word removed from favorites");
                            showNotification('Word removed from favorites', 'success');
                        } catch (error) {
                            // Alert.alert("Error", "Failed to remove word");
                            showNotification('Failed to remove word', 'error');
                        } finally {
                            setDeleteLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleMoveWord = async (wordId, targetCategoryId) => {
        setMoveLoading(true);
        try {
            const result = await dispatch(FavoritesService.moveWordToCategory({
                wordId,
                targetCategoryId
            })).unwrap();

            // 2. Update category counts in favorites slice
            dispatch(updateCategoryCounts({
                oldCategoryId: result.old_category_id,
                newCategoryId: result.new_category_id
            }));

            // Alert.alert("Success", "Word moved to new category");
             showNotification('Word moved to new category', 'success');
            setShowBulkModal(false);
        } catch (error) {
            showNotification(error || 'Failed to move word', 'error');
            // Alert.alert("Error", error || "Failed to move word");
        } finally {
            setMoveLoading(false);
        }
    };

    // Add Category Delete Menu to Header
    const CategoryActionMenu = () => (
        <View className="absolute top-12 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={handleDeleteCategory}
            >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text className="ml-3 text-red-600">Delete Category</Text>
            </TouchableOpacity>
        </View>
    );

    // Delete Category Handler
    const handleDeleteCategory = async () => {
        Alert.alert(
            "Delete Category",
            `Are you sure you want to delete "${categoryName}"? `,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await dispatch(FavoritesService.deleteCategory(categoryId)).unwrap();

                            Alert.alert(
                                "Success",
                                `Category Successfully Deleted.`
                            );

                            // Navigate back to categories screen
                            navigation.goBack();
                        } catch (error) {
                            const errorMessage = extractErrorMessage(error);
                            Alert.alert("Error", errorMessage);
                        }
                    }
                }
            ]
        );
    };


    useEffect(() => {
        dispatch(FavoritesService.getCategoryWords(categoryId));
    }, [dispatch, categoryId]);

    return (
        <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>

            <Notification
              visible={notification.visible}
              message={notification.message}
              type={notification.type}
              onHide={hideNotification}
            />

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
                {/* Category Main Actions Button */}
                <TouchableOpacity
                    onPress={() => setShowCategoryMenu(!showCategoryMenu)}
                    className="p-2"
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>
            {/* Category Main Action Menu */}
            {showCategoryMenu && <CategoryActionMenu />}
            {showCategoryMenu && (
                <TouchableOpacity
                    className="absolute inset-0 z-40"
                    onPress={() => setShowCategoryMenu(false)}
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

            <BulkOperationsModal
                visible={showBulkModal}
                onClose={() => {
                    setShowBulkModal(false);
                    selectedWordRef.current = null; // Clear the ref when modal closes
                }}
                selectedWord={selectedWordRef.current}
                categories={categories}
                categoryId={categoryId}
                moveLoading={moveLoading}
                handleMoveWord={handleMoveWord}
            />

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg z-50"
                onPress={() => navigation.navigate('Translate')}
            >
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>

        </View>
    );
}

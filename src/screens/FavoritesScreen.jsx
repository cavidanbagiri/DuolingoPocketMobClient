import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FavoritesService from '../services/FavoritesService';
import {useCallback} from 'react';

import { clearError, clearSearchResults } from '../store/favorites_store';


export default function FavoritesScreen({ navigation }) {

  const dispatch = useDispatch();

  const { categories, loading, error, searchResults, searchLoading, searchError } = useSelector((state) => state.favoritesSlice);

  const insets = useSafeAreaInsets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');


  ////////////////////////////// Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        dispatch(FavoritesService.searchFavorites({ query: searchQuery }));
      }, 300);
      return () => clearTimeout(timer);
    } else {
      dispatch(clearSearchResults());
      setIsSearching(false);
    }
  }, [searchQuery, dispatch]);


  const renderCategoryResult = useCallback(({ item }) => (
    <TouchableOpacity
      className="bg-white p-5 rounded-xl mb-3 shadow-sm border border-gray-100"
      onPress={() => navigation.navigate('CategoryWords', {
        categoryId: item.id,
        categoryName: item.name
      })}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center mr-4">
            <Ionicons name={item.icon || 'bookmark'} size={24} color="#6366F1" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {item.word_count} word{item.word_count !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  ), [navigation]);



  const renderSearchResult = useCallback(({ item }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg mb-2 shadow-sm border border-gray-100"
      onPress={() => {
        navigation.navigate('CategoryWords', {
          categoryId: item.category_id,
          categoryName: item.category_name
        });
      }}
    >
      <Text className="text-gray-900 font-medium">{item.original_text}</Text>
      <Text className="text-gray-600 text-sm mt-1">{item.translated_text}</Text>
      <Text className="text-gray-400 text-xs mt-2">
        in {item.category_name} • {new Date(item.added_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  ), [navigation]);




  const handleCreateCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const result = await dispatch(FavoritesService.createNewCategory({
          name: newCategoryName.trim(),
          description: '', // Optional: add description input
          color: '#6366F1',
          icon: 'bookmark'
        })).unwrap();

        // Only close modal and reset on success
        setShowAddModal(false);
        setNewCategoryName('');

      } catch (error) {
        // Error is handled by Redux, just keep modal open
        console.log('Category creation failed:', error);
      }
    }
  };

  // Show error alert if creation fails
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {
          text: 'OK',
          onPress: () => dispatch(clearError())
        }
      ]);
    }
  }, [error, dispatch]);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(FavoritesService.getUserCategories());
  }, [dispatch]);

  // Refresh categories after creating a new one
  useEffect(() => {
    if (!showAddModal) {
      // Refresh categories when modal closes (after create or cancel)
      dispatch(FavoritesService.getUserCategories());
    }
  }, [showAddModal, dispatch]);



  const renderCategory = ({ item }) => (
    <TouchableOpacity
      className="bg-white p-5 rounded-xl mb-3 shadow-sm border border-gray-100"
      onPress={() => navigation.navigate('CategoryWords', { categoryId: item.id, categoryName: item.name })}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {/* Category Icon with colored background */}
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: item.color + '20' }} // 20 = 12% opacity
          >
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>

          {/* Category Info */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {item.word_count} word{item.word_count !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Chevron indicator */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
     
      {/* Header with Search */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold text-gray-900">Favorites</Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900 text-base"
            placeholder="Search across all categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {(searchLoading || isSearching) && (
            <ActivityIndicator size="small" color="#6366F1" />
          )}
          {searchQuery.length > 0 && !searchLoading && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>


      {/* Content */}
      {searchQuery.length > 0 ? (
        // Search Results
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="p-4"
          ListEmptyComponent={
            searchLoading ? (
              <View className="items-center justify-center py-20">
                <ActivityIndicator size="large" color="#6366F1" />
                <Text className="text-gray-500 mt-4">Searching...</Text>
              </View>
            ) : (
              <View className="items-center justify-center py-20">
                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-400 text-lg mt-4">No results found</Text>
                <Text className="text-gray-400 text-center mt-2">
                  Try different keywords or check spelling
                </Text>
              </View>
            )
          }
        />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="p-4"
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="folder-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 text-lg mt-4">No categories yet</Text>
              <Text className="text-gray-400 text-center mt-2 px-8">
                Create your first category to organize favorite words
              </Text>
              <TouchableOpacity
                className="bg-indigo-600 px-6 py-3 rounded-full mt-6"
                onPress={() => setShowAddModal(true)}
              >
                <Text className="text-white font-semibold">Create Category</Text>
              </TouchableOpacity>
            </View>
          }
        />)}

      {/* Add Category Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50" style={{ paddingTop: insets.top }}>
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900">Create New Category</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
              placeholder="Enter category name"
              placeholderTextColor="#9CA3AF"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                className="px-5 py-2 rounded-lg border border-gray-300"
                onPress={() => setShowAddModal(false)}
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-indigo-600 px-5 py-2 rounded-lg"
                onPress={handleCreateCategory}
                disabled={!newCategoryName.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white font-semibold">Create</Text>
                )}
              </TouchableOpacity>

         

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
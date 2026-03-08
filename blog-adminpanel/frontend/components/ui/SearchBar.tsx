import { forwardRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useThemeStore } from '@/lib/store/theme-store';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar = forwardRef<any, SearchBarProps>(({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search...',
  autoFocus = false,
}, ref) => {
  const { isDarkMode } = useThemeStore();

  const handleClear = () => {
    onChangeText('');
  };

  const handleSubmit = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <View style={[
      styles.container,
      isDarkMode && styles.darkContainer,
    ]}>
      <Search size={20} color={isDarkMode ? '#9ca3af' : '#9ca3af'} />

      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#6b7280' : '#9ca3af'}
        style={[styles.input, isDarkMode && styles.darkInput]}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        autoFocus={autoFocus}
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <X size={18} color={isDarkMode ? '#9ca3af' : '#9ca3af'} />
        </TouchableOpacity>
      )}
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  darkContainer: {
    backgroundColor: '#1f2937',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#111827',
  },
  darkInput: {
    color: '#ffffff',
  },
  clearButton: {
    padding: 4,
  },
});
import { TouchableOpacity, Text } from 'react-native';
import { useThemeStore } from '@/lib/store/theme-store';

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      className="mr-4 px-3 py-1 bg-blue-500 rounded-lg"
    >
      <Text className="text-white">
        {isDarkMode ? 'Light' : 'Dark'}
      </Text>
    </TouchableOpacity>
  );
}
import { View, ActivityIndicator } from 'react-native';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

export function Loading({ 
  fullScreen = true, 
  size = 'large', 
  color = '#3b82f6' 
}: LoadingProps) {
  if (fullScreen) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return (
    <View className="py-4 justify-center items-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
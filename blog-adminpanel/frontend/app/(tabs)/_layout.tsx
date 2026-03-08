import { Tabs } from 'expo-router';
import { Users, FileText, LayoutDashboard, Settings, Moon, Sun } from 'lucide-react-native';
import { useThemeStore } from '@/lib/store/theme-store';
import { TouchableOpacity, View } from 'react-native';

export default function TabsLayout() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          borderTopColor: isDarkMode ? '#374151' : '#e5e7eb',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        },
        headerTitle: 'BlogAdminPanel',
        headerTitleStyle: {
          color: isDarkMode ? '#ffffff' : '#111827',
          fontWeight: '600',
          fontSize: 18,
        },
        headerRight: () => (
          <TouchableOpacity 
            onPress={toggleTheme}
            style={{
              marginRight: 16,
              padding: 8,
              borderRadius: 8,
              backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
            }}
          >
            {isDarkMode ? (
              <Sun size={20} color="#ffffff" />
            ) : (
              <Moon size={20} color="#111827" />
            )}
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="posts"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
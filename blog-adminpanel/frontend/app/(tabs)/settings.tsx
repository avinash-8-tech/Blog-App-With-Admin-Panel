import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Mail, LogOut } from 'lucide-react-native';

import { useThemeStore } from '@/lib/store/theme-store';

interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
  console.log('🚪 Logout function started');
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('✅ Storage cleared');
    
    router.replace('/auth/login');
    console.log('➡️ Navigation called');
    
  } catch (error) {
    console.log('❌ Error:', error);
  }
};

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>
      </View>

      <View style={[styles.profileCard, isDarkMode && styles.darkProfileCard]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </Text>
        </View>

        {loading ? (
          <Text style={[styles.loadingText, isDarkMode && styles.darkSubtitle]}>
            Loading...
          </Text>
        ) : user ? (
          <View style={styles.userInfo}>
            <Text style={[styles.userName, isDarkMode && styles.darkText]}>
              {user.name}
            </Text>
            <Text style={[styles.userEmail, isDarkMode && styles.darkSubtitle]}>
              {user.email}
            </Text>
          </View>
        ) : (
          <Text style={[styles.errorText, isDarkMode && styles.darkSubtitle]}>
            No user info found
          </Text>
        )}
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={[styles.settingRow, styles.logoutRow, isDarkMode && styles.darkSettingRow]}
          onPress={() => {
            console.log('🔴 Logout button pressed!');
            handleLogout();
          }}
        >
          <View style={styles.settingLeft}>
            <LogOut size={22} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.versionText, isDarkMode && styles.darkSubtitle]}>
        Version 1.0.0
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkProfileCard: {
    backgroundColor: '#1f2937',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingsContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  darkSettingRow: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutRow: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 12,
    color: '#9ca3af',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 14,
    color: '#6b7280',
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubtitle: {
    color: '#9ca3af',
  },
});
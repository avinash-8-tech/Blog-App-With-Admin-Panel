import { View, Text, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/ui/SearchBar';
import { UserCard } from '@/components/shared/UserCard';
import { Loading } from '@/components/ui/Loading';
import api from '@/lib/api';
import { useThemeStore } from '@/lib/store/theme-store';

interface User {
  id: string;
  name: string;
  email: string;
  postCount: number;
}

interface ApiResponse {
  success: boolean;
  count: number;
  users: User[];
}

export default function UsersScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const response = await api.get<ApiResponse>('/users');
      setUsers(response.data.users || []);
      setFilteredUsers(response.data.users || []);
    } catch (error: any) {
      console.log('Load users error:', error);

      let errorMessage = 'Failed to load users';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      Alert.alert('Error', errorMessage);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleDelete = (userId: string, userName: string) => {
  console.log('Direct delete for:', userId);
  deleteUser(userId);
};

const deleteUser = async (userId: string) => {
  console.log('deleteUser started for:', userId);
  
  try {
    console.log('Making API call...');
    const response = await api.delete(`/users/${userId}`);
    console.log('API response:', response.data);
    
    Alert.alert('Success', 'User deleted successfully');
    loadUsers();
  } catch (error: any) {
    console.log('Error caught:', error);
    console.log('Error response:', error.response?.data);
    Alert.alert('Error', error.response?.data?.error || 'Failed to delete user');
  }
};

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Users</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
          Total users: {users.length}
        </Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search users by name or email..."
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <UserCard
              id={item.id}
              name={item.name}
              email={item.email}
              postCount={item.postCount}
              onPress={() => router.push(`/user/${item.id}` as any)}
              onDelete={() => handleDelete(item.id, item.name)}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#ffffff' : '#000000'}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDarkMode && styles.darkSubtitle]}>
              {searchQuery ? 'No users found' : 'No users yet'}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  cardContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#6b7280',
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubtitle: {
    color: '#9ca3af',
  },
});
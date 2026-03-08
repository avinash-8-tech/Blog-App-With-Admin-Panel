import { View, Text, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Calendar, FileText } from 'lucide-react-native';

import { PostCard } from '@/components/shared/PostCard';
import { Loading } from '@/components/ui/Loading';
import api from '@/lib/api';
import { useThemeStore } from '@/lib/store/theme-store';
import { TouchableOpacity } from 'react-native';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  author: {
    name: string;
  };
  createdAt: string;
}

interface ApiPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  created_at: string;
  author_name: string;
}

export default function UserDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    try {
      const userResponse = await api.get(`/users/${id}`);
      setUser(userResponse.data.user);

      const postsResponse = await api.get(`/users/${id}/posts`);
      
      const formattedPosts = (postsResponse.data.posts || []).map((post: ApiPost) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        author: {
          name: post.author_name
        },
        createdAt: post.created_at
      }));
      
      setPosts(formattedPosts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const handleDeletePost = (postId: number, postTitle: string) => {
    Alert.alert(
      'Delete Post',
      `Are you sure you want to delete "${postTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/posts/${postId}`);
              Alert.alert('Success', 'Post deleted');
              loadUserData(); // Refresh
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>
          User not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={isDarkMode ? '#ffffff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          User Details
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.userInfo}>
            <Text style={[styles.userName, isDarkMode && styles.darkText]}>
              {user.name}
            </Text>
            
            <View style={styles.infoRow}>
              <Mail size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Text style={[styles.infoText, isDarkMode && styles.darkSubtitle]}>
                {user.email}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Text style={[styles.infoText, isDarkMode && styles.darkSubtitle]}>
                Joined: {formatDate(user.created_at)}
              </Text>
            </View>

            <View style={styles.postsHeader}>
              <FileText size={20} color={isDarkMode ? '#ffffff' : '#111827'} />
              <Text style={[styles.postsTitle, isDarkMode && styles.darkText]}>
                Posts ({posts.length})
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <PostCard
              id={item.id}
              title={item.title}
              description={item.description}
              authorName={item.author.name}
              createdAt={formatDate(item.createdAt)}
              onPress={() => router.push(`/post/${item.id}` as any)}
              onDelete={() => handleDeletePost(item.id, item.title)}
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
              This user hasn't posted anything yet
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  userInfo: {
    padding: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  postsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubtitle: {
    color: '#9ca3af',
  },
});
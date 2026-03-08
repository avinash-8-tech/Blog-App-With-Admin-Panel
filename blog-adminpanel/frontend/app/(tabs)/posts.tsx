import { View, Text, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/ui/SearchBar';
import { PostCard } from '@/components/shared/PostCard';
import { Loading } from '@/components/ui/Loading';
import api from '@/lib/api';
import { useThemeStore } from '@/lib/store/theme-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  created_at: string;
  author_name: string;
  author_id: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  posts: ApiPost[];
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

export default function PostsScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const loadPosts = async () => {
    try {
      const response = await api.get<ApiResponse>('/posts');
      
      const formattedPosts = (response.data.posts || []).map((apiPost: ApiPost) => ({
        id: apiPost.id,
        title: apiPost.title,
        description: apiPost.description,
        author: {
          name: apiPost.author_name
        },
        createdAt: apiPost.created_at
      }));
      
      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts);
    } catch (error: any) {
      console.log('Load posts error:', error);
      
      let errorMessage = 'Failed to load posts';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Error', errorMessage);
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleDelete = (postId: number, postTitle: string) => {
  console.log('🗑️ Direct delete for post:', postId);
  deletePost(postId);
};

const deletePost = async (postId: number) => {
  try {
    console.log('1️⃣ deletePost started for:', postId);
    
    const response = await api.delete(`/posts/${postId}`);
    console.log('2️⃣ Delete response:', response.data);
    
    Alert.alert('Success', 'Post deleted successfully');
    loadPosts();
  } catch (error: any) {
    console.log('3️⃣ Error:', error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.error || 'Failed to delete post');
  }
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Posts</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
          Total posts: {posts.length}
        </Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search posts by title or author..."
        />
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <PostCard
              id={item.id}
              title={item.title}
              description={item.description}
              authorName={item.author.name}
              createdAt={formatDate(item.createdAt)}
              onPress={() => router.push(`/post/${item.id}` as any)}
              onDelete={() => handleDelete(item.id, item.title)}
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
              {searchQuery ? 'No posts found' : 'No posts yet'}
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
    paddingTop: 8,
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
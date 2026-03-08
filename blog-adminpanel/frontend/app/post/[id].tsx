import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Calendar, Trash2 } from 'lucide-react-native';

import { Loading } from '@/components/ui/Loading';
import api from '@/lib/api';
import { useThemeStore } from '@/lib/store/theme-store';
import { TouchableOpacity } from 'react-native';

interface PostDetails {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  created_at: string;
  author_name: string;
  author_email: string;
}

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [post, setPost] = useState<PostDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data.post);
    } catch (error) {
      Alert.alert('Error', 'Failed to load post');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPost();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      `Are you sure you want to delete "${post?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/posts/${id}`);
              Alert.alert('Success', 'Post deleted');
              router.back();
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>
          Post not found
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
          Post Details
        </Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#ffffff' : '#000000'}
          />
        }
      >
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          {post.title}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <User size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Text style={[styles.metaText, isDarkMode && styles.darkSubtitle]}>
              {post.author_name}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Text style={[styles.metaText, isDarkMode && styles.darkSubtitle]}>
              {formatDate(post.created_at)}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionLabel, isDarkMode && styles.darkSubtitle]}>
            Description
          </Text>
          <Text style={[styles.description, isDarkMode && styles.darkText]}>
            {post.description}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.contentLabel, isDarkMode && styles.darkSubtitle]}>
            Content
          </Text>
          <Text style={[styles.contentText, isDarkMode && styles.darkText]}>
            {post.content}
          </Text>
        </View>
      </ScrollView>
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
  deleteButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6b7280',
  },
  descriptionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
    fontStyle: 'italic',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  contentContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  contentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
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
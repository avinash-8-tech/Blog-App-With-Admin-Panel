import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, FileText } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import api from '@/lib/api';
import { useThemeStore } from '@/lib/store/theme-store';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  recentUsers: Array<{ id: string; name: string; email: string; }>;
  recentPosts: Array<{ id: number; title: string; author: string; }>;
}

export default function DashboardScreen() {
  const { isDarkMode } = useThemeStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const usersRes = await api.get('/users');
      const totalUsers = usersRes.data.count || 0;
      const recentUsers = usersRes.data.users?.slice(0, 5) || [];

      const postsRes = await api.get('/posts');
      const totalPosts = postsRes.data.count || 0;
      const recentPosts = postsRes.data.posts?.slice(0, 5).map((p: any) => ({
        id: p.id,
        title: p.title,
        author: p.author_name
      })) || [];

      setStats({
        totalUsers,
        totalPosts,
        recentUsers,
        recentPosts
      });
    } catch (error) {
      console.log('Dashboard error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>
            Dashboard
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
            Welcome back! Here's what's happening.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, isDarkMode && styles.darkStatCard]}>
            <CardContent style={styles.statContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#3b82f620' }]}>
                <Users size={24} color="#3b82f6" />
              </View>
              <View style={styles.statInfo}>
                <Text style={[styles.statValue, isDarkMode && styles.darkText]}>
                  {stats?.totalUsers.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, isDarkMode && styles.darkSubtitle]}>
                  Total Users
                </Text>
              </View>
            </CardContent>
          </Card>

          <Card style={[styles.statCard, isDarkMode && styles.darkStatCard]}>
            <CardContent style={styles.statContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#10b98120' }]}>
                <FileText size={24} color="#10b981" />
              </View>
              <View style={styles.statInfo}>
                <Text style={[styles.statValue, isDarkMode && styles.darkText]}>
                  {stats?.totalPosts.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, isDarkMode && styles.darkSubtitle]}>
                  Total Posts
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Recent Users
          </Text>
          {stats?.recentUsers.map((user) => (
            <Card key={user.id} style={[styles.itemCard, isDarkMode && styles.darkItemCard]}>
              <CardContent style={styles.itemContent}>
                <View>
                  <Text style={[styles.itemTitle, isDarkMode && styles.darkText]}>
                    {user.name}
                  </Text>
                  <Text style={[styles.itemSubtitle, isDarkMode && styles.darkSubtitle]}>
                    {user.email}
                  </Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Recent Posts
          </Text>
          {stats?.recentPosts.map((post) => (
            <Card key={post.id} style={[styles.itemCard, isDarkMode && styles.darkItemCard]}>
              <CardContent style={styles.itemContent}>
                <View>
                  <Text style={[styles.itemTitle, isDarkMode && styles.darkText]}>
                    {post.title}
                  </Text>
                  <Text style={[styles.itemSubtitle, isDarkMode && styles.darkSubtitle]}>
                    By {post.author}
                  </Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  darkStatCard: {
    backgroundColor: '#1e293b',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  darkItemCard: {
    backgroundColor: '#1e293b',
  },
  itemContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  darkText: {
    color: '#f1f5f9',
  },
  darkSubtitle: {
    color: '#94a3b8',
  },
});
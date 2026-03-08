import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trash2, ChevronRight, Calendar, User } from 'lucide-react-native';
import { useThemeStore } from '@/lib/store/theme-store';

interface PostCardProps {
  id: number;
  title: string;
  description?: string;
  authorName: string;
  createdAt: string;
  onPress: () => void;
  onDelete: () => void;
}

export function PostCard({
  title,
  description,
  authorName,
  createdAt,
  onPress,
  onDelete,
}: PostCardProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <View style={[styles.card, isDarkMode && styles.darkCard]}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]} numberOfLines={1}>
          {title}
        </Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <User size={12} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Text style={[styles.metaText, isDarkMode && styles.darkMetaText]}>
              {authorName}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Calendar size={12} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Text style={[styles.metaText, isDarkMode && styles.darkMetaText]}>
              {createdAt}
            </Text>
          </View>
        </View>

        {description && (
          <Text style={[styles.description, isDarkMode && styles.darkDescription]} numberOfLines={2}>
            {description}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
        <ChevronRight size={20} color={isDarkMode ? '#9ca3af' : '#9ca3af'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1f2937',
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    marginRight: 4,
  },
  darkText: {
    color: '#ffffff',
  },
  darkMetaText: {
    color: '#9ca3af',
  },
  darkDescription: {
    color: '#d1d5db',
  },
});
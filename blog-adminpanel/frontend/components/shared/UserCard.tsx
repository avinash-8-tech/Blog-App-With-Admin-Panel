import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trash2, ChevronRight } from 'lucide-react-native';
import { useThemeStore } from '@/lib/store/theme-store';

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  postCount: number;
  onPress: () => void;
  onDelete: () => void;
}

export function UserCard({
  name,
  email,
  postCount,
  onPress,
  onDelete,
}: UserCardProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <View style={[styles.card, isDarkMode && styles.darkCard]}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <Text style={[styles.name, isDarkMode && styles.darkText]}>
          {name}
        </Text>
        <Text style={[styles.email, isDarkMode && styles.darkSubtitle]}>
          {email}
        </Text>
        <Text style={[styles.postCount, isDarkMode && styles.darkSubtitle]}>
          Posts: {postCount}
        </Text>
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
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  postCount: {
    fontSize: 12,
    color: '#6b7280',
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
  darkSubtitle: {
    color: '#9ca3af',
  },
});
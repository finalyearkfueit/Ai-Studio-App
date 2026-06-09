import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, TextInput, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS, SIZES } from '../utils/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

function EmptyState({ icon, title, desc }) {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name={icon} size={64} color={colors.textSecondary} style={{ marginBottom: 16, opacity: 0.5 }} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>{desc}</Text>
    </View>
  );
}

const historyData = [
  { id: '1', date: 'Apr 28, 2026', status: 'Enhanced', uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop' },
  { id: '2', date: 'Dec 18, 2025', status: 'Try-On', uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop' },
  { id: '3', date: 'Apr 28, 2026', status: 'Try-On', uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop' },
  { id: '4', date: 'Dec 28, 2025', status: 'BG Removed', uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop' },
];

export default function HistoryScreen() {
  const [filter, setFilter] = useState('All');
  const { colors, gradients, isDarkMode } = useTheme();

  const filteredData = filter === 'All' 
    ? historyData 
    : historyData.filter(item => item.status === filter);

  const getStatusColor = (status) => {
    if (status === 'Enhanced') return colors.cyan || '#8BE9FD';
    if (status === 'BG Removed') return colors.primary || '#BD93F9';
    return colors.secondary || '#EC4899';
  };

  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `Check out my ${item.status} creation on AI Studio! 📸`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      
      <View style={styles.cardInfo}>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
        
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
        
        <View style={[styles.actions, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item)}>
             <Ionicons name="share-social-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
             <Ionicons name="trash-outline" size={16} color={colors.red} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      <Header title="Project History" />
 
      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {['All', 'BG Removed', 'Enhanced', 'Try-On'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab, 
                { backgroundColor: colors.card, borderColor: colors.border },
                filter === tab && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[
                styles.tabText, 
                { color: colors.textSecondary },
                filter === tab && { color: '#FFF' }
              ]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState 
            icon="image-outline" 
            title="No Projects Found"
            desc={`You don't have any saved creations under the "${filter}" category.`}
          />
        }
      />
      
      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGrad: {
    ...StyleSheet.absoluteFillObject,
  },
  tabsWrapper: {
    marginVertical: 12,
  },
  tabsScroll: {
    paddingLeft: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 40,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(21, 19, 36, 0.75)',
    borderRadius: SIZES.radius,
    margin: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  image: {
    width: '100%',
    height: (width / 2) - 24,
  },
  cardInfo: {
    padding: 12,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 8,
    marginTop: 4,
  },
  actionBtn: {
    marginLeft: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  }
});

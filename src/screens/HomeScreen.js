import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import TokenManager from '../utils/tokenManager';

const { width } = Dimensions.get('window');

const RECENT_PROJECTS = [
  { id: '1', name: 'Background Remove', tag: 'BG Removal', date: '10 mins ago', uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' },
  { id: '2', name: 'Portrait Enhance', tag: 'Enhancement', date: '1 hour ago', uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
  { id: '3', name: 'Virtual Outfit Swap', tag: 'Try-On', date: 'Yesterday', uri: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&h=200&fit=crop' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDarkMode, colors, gradients } = useTheme();
  const [username, setUsername] = useState('User');

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await TokenManager.getUserData();
      if (userData?.username) {
        setUsername(userData.username);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const handleToolPress = (toolName) => {
    if (toolName === 'Remove BG') {
      navigation.navigate('Editor', { tool: 'Remove BG' });
    } else if (toolName === 'Clothes Try-On') {
      navigation.navigate('TryOn');
    } else if (toolName === 'Image Enhance') {
      navigation.navigate('Enhance');
    } else if (toolName === 'Sketch & Filters') {
      navigation.navigate('Sketch');
    }
  };

  const ToolCard = ({ title, desc, iconName, colors: cardColors, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.cardWrapper} activeOpacity={0.85}>
      <LinearGradient
        colors={cardColors}
        style={styles.toolCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={iconName} size={28} color="#FFF" />
        </View>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolDesc}>{desc}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* User Info Header */}
        <View style={styles.header}>
          <View style={styles.userRow}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' }} 
              style={styles.avatar} 
            />
            <View style={styles.userTextCol}>
              <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome back,</Text>
              <Text style={[styles.greeting, { color: colors.text }]}>{username} 👋</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.notificationBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('HistoryTab')}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search AI features, templates..."
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>

        {/* Premium Banner */}
        <TouchableOpacity style={styles.premiumBanner} onPress={() => navigation.navigate('Premium')}>
          <LinearGradient
            colors={gradients.button}
            style={styles.bannerGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.bannerLeft}>
              <View style={styles.proBadge}>
                <Text style={[styles.proText, { color: colors.primary }]}>PRO</Text>
              </View>
              <Text style={styles.bannerTitle}>Unlock Premium Access</Text>
              <Text style={styles.bannerSubtitle}>Unlimited HD exports, priority processing & cloth items.</Text>
            </View>
            <View style={styles.bannerRight}>
              <Ionicons name="chevron-forward-circle" size={36} color="#FFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* AI Tools Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Studio Modules</Text>
        <View style={styles.grid}>
          <ToolCard 
            title="Remove BG" 
            desc="Transparents & cuts"
            iconName="content-cut" 
            colors={['#7C3AED', '#5B21B6']}
            onPress={() => handleToolPress('Remove BG')}
          />
          <ToolCard 
            title="Image Enhance" 
            desc="Blurry to Ultra-HD"
            iconName="magic-staff" 
            colors={['#2563EB', '#1D4ED8']}
            onPress={() => handleToolPress('Image Enhance')}
          />
          <ToolCard 
            title="Clothes Try-On" 
            desc="Virtual outfit swaps"
            iconName="tshirt-crew" 
            colors={['#DB2777', '#BE185D']}
            onPress={() => handleToolPress('Clothes Try-On')}
          />
          <ToolCard 
            title="Sketch & Filters" 
            desc="Artistic filter styles"
            iconName="draw" 
            colors={['#059669', '#047857']}
            onPress={() => handleToolPress('Sketch & Filters')}
          />
        </View>

        {/* Recent Projects */}
        <View style={styles.recentHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Projects</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HistoryTab')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={RECENT_PROJECTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.recentList}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.recentCard, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.9} onPress={() => navigation.navigate('Result')}>
              <Image source={{ uri: item.uri }} style={styles.recentImage} />
              <View style={styles.recentDetails}>
                <Text style={[styles.recentName, { color: colors.text }]}>{item.name}</Text>
                <View style={styles.recentTagRow}>
                  <View style={[styles.tagBadge, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                    <Text style={[styles.tagText, { color: colors.textSecondary }]}>{item.tag}</Text>
                  </View>
                  <Text style={[styles.recentTime, { color: colors.textMuted }]}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <View style={{ height: 100 }} />

      </ScrollView>
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
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userTextCol: {
    marginLeft: 12,
  },
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  // Premium Banner
  premiumBanner: {
    width: '100%',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 28,
  },
  bannerGrad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  bannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  proBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  proText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 16,
  },
  bannerRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Section Titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  cardWrapper: {
    width: '48%',
    height: 140,
    marginBottom: 16,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    elevation: 3,
  },
  toolCard: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 16,
    left: 16,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 2,
  },
  toolDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  // Recent Projects
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  recentList: {
    paddingBottom: 20,
  },
  recentCard: {
    width: width * 0.44,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  recentImage: {
    width: '100%',
    height: 120,
  },
  recentDetails: {
    padding: 12,
  },
  recentName: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 6,
  },
  recentTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  recentTime: {
    color: COLORS.textMuted,
    fontSize: 9,
  }
});

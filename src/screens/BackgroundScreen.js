import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import CustomButton from '../components/Button';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const initialCategories = ['Nature', 'Studio', 'City', 'Abstract', 'Uploads'];
const defaultBackgrounds = [
  { id: '1', category: 'Nature', uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop' },
  { id: '2', category: 'Studio', uri: 'https://images.unsplash.com/photo-1511452885600-a3d809a48dc3?w=400&h=400&fit=crop' },
  { id: '3', category: 'City', uri: 'https://images.unsplash.com/photo-1506744626753-1fa28f6e5200?w=400&h=400&fit=crop' },
  { id: '4', category: 'Abstract', uri: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=400&h=400&fit=crop' },
  { id: '5', category: 'Nature', uri: 'https://images.unsplash.com/photo-1470071131384-001b85755536?w=400&h=400&fit=crop' },
  { id: '6', category: 'Abstract', uri: 'https://images.unsplash.com/photo-1444464666168-49b626d49cb9?w=400&h=400&fit=crop' },
];

export default function BackgroundScreen() {
  const navigation = useNavigation();
  const [activeCat, setActiveCat] = useState('Nature');
  const [selectedBg, setSelectedBg] = useState(null);
  const [backgrounds, setBackgrounds] = useState(defaultBackgrounds);
  const { colors, gradients, isDarkMode } = useTheme();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newBg = {
        id: Date.now().toString(),
        category: 'Uploads',
        uri: result.assets[0].uri
      };
      setBackgrounds([newBg, ...backgrounds]);
      setActiveCat('Uploads');
      setSelectedBg(newBg.id);
    }
  };

  const filteredBgs = backgrounds.filter(bg => activeCat === 'Uploads' ? bg.category === 'Uploads' : bg.category === activeCat);
  const displayBgs = filteredBgs.length > 0 ? filteredBgs : backgrounds;

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.gridItem, 
        { backgroundColor: colors.card },
        selectedBg === item.id && { borderColor: colors.primary }
      ]}
      onPress={() => setSelectedBg(item.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.uri }} style={styles.bgImage} />
      {selectedBg === item.id && (
        <View style={[styles.activeCheck, { backgroundColor: colors.primary }]}>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      <Header title="AI Backgrounds" />

      <View style={styles.container}>
        {/* Categories */}
        <View style={styles.tabsContainer}>
          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={initialCategories}
            keyExtractor={(item) => item}
            renderItem={({ item: cat }) => (
              <TouchableOpacity 
                style={[
                  styles.tab, 
                  { backgroundColor: colors.card, borderColor: colors.border },
                  activeCat === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setActiveCat(cat)}
              >
                <Text style={[
                  styles.tabText, 
                  { color: colors.textSecondary },
                  activeCat === cat && { color: '#FFF', fontWeight: '700' }
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadBtnWrapper} onPress={pickImage} activeOpacity={0.8}>
          <LinearGradient
            colors={isDarkMode ? ['rgba(139, 92, 246, 0.15)', 'rgba(236, 72, 153, 0.05)'] : ['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.03)']}
            style={[styles.uploadBtn, { borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.6)' }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
            <Text style={[styles.uploadBtnText, { color: colors.primary }]}>Upload Custom Background</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Grid */}
        <FlatList
          data={displayBgs}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No backgrounds uploaded yet.</Text>
            </View>
          }
        />

        {/* Footer Apply */}
        <View style={[styles.footer, { backgroundColor: isDarkMode ? 'rgba(11, 10, 16, 0.85)' : 'rgba(249, 250, 251, 0.85)', borderColor: colors.border }]}>
          <CustomButton 
            title="Set Background" 
            onPress={() => navigation.navigate('Editor', { bgUri: backgrounds.find(b => b.id === selectedBg)?.uri })} 
            disabled={!selectedBg}
          />
        </View>

      </View>
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
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
    height: 40,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '700',
  },
  uploadBtnWrapper: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: SIZES.radius,
    borderStyle: 'dashed',
  },
  uploadBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    height: (width / 2) - 24,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: COLORS.card,
  },
  gridItemActive: {
    borderColor: COLORS.primary,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  activeCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 10, 16, 0.85)',
    paddingHorizontal: 20,
    paddingBottom: 35,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  }
});

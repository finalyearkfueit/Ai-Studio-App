import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import CustomButton from '../components/Button';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const initialClothesList = [
  { id: '1', name: 'Casual T-Shirt', uri: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', category: 'T-Shirts' },
  { id: '2', name: 'Denim Jacket', uri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop', category: 'Outerwear' },
  { id: '3', name: 'Grey Hoodie', uri: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop', category: 'Outerwear' },
  { id: '4', name: 'Knitted Sweater', uri: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', category: 'Sweaters' },
];

export default function TryOnScreen() {
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState(initialClothesList[0].id);
  const [showOriginal, setShowOriginal] = useState(false);
  const [clothesList, setClothesList] = useState(initialClothesList);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop');
  const { colors, gradients, isDarkMode } = useTheme();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newCloth = {
        id: Date.now().toString(),
        name: 'Custom Wear',
        uri: result.assets[0].uri,
        category: 'Uploads'
      };
      setClothesList([newCloth, ...clothesList]);
      setSelectedItem(newCloth.id);
    }
  };

  const pickUserPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUserPhoto(result.assets[0].uri);
    }
  };

  const filteredClothes = selectedCategory === 'All' 
    ? clothesList 
    : clothesList.filter(c => c.category === selectedCategory);

  const handleApplyTryOn = () => {
    navigation.navigate('Processing');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      <Header title="AI Clothes Try-On" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Main Canvas View */}
        <View style={[styles.canvasContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image 
            source={{ uri: showOriginal 
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop' // Original user face/photo
              : userPhoto // Swapped Try-on preview
            }} 
            style={styles.mainImage} 
          />

          {/* User Photo trigger */}
          <TouchableOpacity 
            style={[
              styles.uploadPersonBtn, 
              { 
                backgroundColor: isDarkMode ? 'rgba(11, 10, 16, 0.65)' : 'rgba(255, 255, 255, 0.75)',
                borderColor: colors.border 
              }
            ]} 
            onPress={pickUserPhoto}
          >
            <Ionicons name="camera-reverse" size={20} color={isDarkMode ? "#FFF" : colors.primary} />
            <Text style={[styles.uploadPersonText, { color: isDarkMode ? "#FFF" : colors.text }]}>Change Model</Text>
          </TouchableOpacity>
          
          {/* Hold to Compare overlay */}
          <TouchableOpacity 
            style={[
              styles.toggleBtn,
              { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(11, 10, 16, 0.85)' }
            ]}
            onPressIn={() => setShowOriginal(true)}
            onPressOut={() => setShowOriginal(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal" size={18} color={isDarkMode ? "#0B0A10" : "#FFF"} />
            <Text style={[styles.toggleText, { color: isDarkMode ? "#0B0A10" : "#FFF" }]}>Hold to compare</Text>
          </TouchableOpacity>
        </View>

        {/* Outfit category picker */}
        <View style={styles.categoryScrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {['All', 'T-Shirts', 'Outerwear', 'Sweaters', 'Uploads'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catTab, 
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedCategory === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.catText, 
                  { color: colors.textSecondary },
                  selectedCategory === cat && { color: '#FFF', fontWeight: '700' }
                ]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Outfit Wardrobe</Text>

        {/* Clothing Items horizontal list */}
        <View style={styles.clothingWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            
            {/* Upload Action Card */}
            <TouchableOpacity style={[styles.uploadCard, { borderColor: colors.primary }]} onPress={pickImage} activeOpacity={0.8}>
              <LinearGradient
                colors={isDarkMode ? ['rgba(139, 92, 246, 0.1)', 'rgba(255,255,255,0.01)'] : ['rgba(139, 92, 246, 0.05)', 'rgba(255,255,255,0.1)']}
                style={styles.uploadCardInner}
              >
                <Ionicons name="cloud-upload-outline" size={28} color={colors.primary} />
                <Text style={[styles.uploadCardText, { color: colors.primary }]}>Upload Custom</Text>
              </LinearGradient>
            </TouchableOpacity>

            {filteredClothes.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.itemCard, 
                  { backgroundColor: colors.card },
                  selectedItem === item.id && { borderColor: colors.primary }
                ]}
                onPress={() => setSelectedItem(item.id)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.uri }} style={styles.itemImage} />
                {selectedItem === item.id && (
                  <View style={styles.checkOverlay}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Apply Try-On Button */}
        <View style={styles.footer}>
          <CustomButton title="Generate Try-On" onPress={handleApplyTryOn} />
        </View>

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
    paddingBottom: 40,
  },
  canvasContainer: {
    width: width - 40,
    height: width * 1.15,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: SIZES.radiusLarge,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  uploadPersonBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 10, 16, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  uploadPersonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  toggleBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#0B0A10',
  },
  categoryScrollContainer: {
    marginTop: 18,
    marginBottom: 10,
  },
  catScroll: {
    paddingLeft: 20,
  },
  catTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  catTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  catTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 12,
  },
  clothingWrapper: {
    height: 115,
  },
  scroll: {
    paddingLeft: 20,
  },
  uploadCard: {
    width: 95,
    height: 95,
    borderRadius: SIZES.radius,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadCardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  uploadCardText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  itemCard: {
    width: 95,
    height: 95,
    borderRadius: SIZES.radius,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: COLORS.card,
  },
  itemCardActive: {
    borderColor: COLORS.primary,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  checkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 10, 16, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 24,
  }
});

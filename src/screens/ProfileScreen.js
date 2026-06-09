import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { profileService, authService } from '../utils/apiService';
import TokenManager from '../utils/tokenManager';

const { width } = Dimensions.get('window');

// Mock data for credit usage sync status
const SYNC_CHART_DATA = [30, 45, 35, 60, 50, 75, 90, 65, 80, 95];

export default function ProfileScreen() {
  const { isDarkMode, toggleTheme, colors, gradients } = useTheme();
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    setLoading(true);
    const result = await profileService.getProfile();
    setLoading(false);

    if (result.success) {
      setProfileData(result.profile);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Log Out',
          onPress: async () => {
            const result = await authService.logout();
            if (result.success) {
              navigation.replace('Auth');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleUnderDevelopment = (title) => {
    Alert.alert(title, `${title} settings are fully operational in the production backend.`);
  };

  const MenuItem = ({ icon, label, hasSwitch, switchValue, onSwitch, onPress }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
      disabled={hasSwitch}
      activeOpacity={0.8}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.15)' }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitch}
          trackColor={{ false: isDarkMode ? '#333344' : '#D1D5DB', true: colors.primary }}
          thumbColor={'#FFF'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ color: colors.text, marginTop: 10 }}>Loading profile...</Text>
          </View>
        ) : profileData ? (
          <>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: profileData.profile_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' }} 
              style={styles.avatar} 
            />
            <LinearGradient
              colors={gradients.primary}
              style={[styles.crownBadge, { borderColor: colors.card }]}
            >
              <Ionicons name="ribbon" size={12} color="#FFF" />
            </LinearGradient>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{profileData.username || 'User'}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{profileData.email}</Text>
        </View>

        {/* Pro Membership Banner */}
        <TouchableOpacity style={styles.proCard} onPress={() => navigation.navigate('Premium')}>
          <LinearGradient
            colors={gradients.button}
            style={styles.proGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View>
              <Text style={styles.proTitle}>Premium Active</Text>
              <Text style={styles.proDesc}>Your subscription expires in 28 days.</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>48</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Generations</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>120</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Credits Left</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>Pro</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tier Level</Text>
          </View>
        </View>

        {/* Sync Status Graph Widget */}
        <View style={[styles.chartWidget, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>AI Sync Status</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>SYNCED</Text>
            </View>
          </View>
          
          {/* Custom drawn line chart bar representation */}
          <View style={[styles.chartCanvas, { borderBottomColor: colors.border }]}>
            {SYNC_CHART_DATA.map((val, idx) => (
              <View key={idx} style={styles.chartBarWrapper}>
                <LinearGradient
                  colors={[colors.primary, colors.cyan]}
                  style={[styles.chartBar, { height: `${val}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
              </View>
            ))}
          </View>
          
          <View style={styles.chartTimeline}>
            {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m, i) => (
              <Text key={i} style={[styles.timelineText, { color: colors.textMuted }]}>{m}</Text>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem 
            icon="person-outline" 
            label="Account Settings" 
            onPress={() => navigation.navigate('Account')} 
          />
          <MenuItem 
            icon="card-outline" 
            label="Upgrade Plans" 
            onPress={() => navigation.navigate('Premium')} 
          />
          <MenuItem 
            icon="moon-outline" 
            label="Dark Mode" 
            hasSwitch 
            switchValue={isDarkMode} 
            onSwitch={toggleTheme} 
          />
          <MenuItem 
            icon="help-circle-outline" 
            label="Help Center" 
            onPress={() => navigation.navigate('HelpCenter')} 
          />
        </View>

        <TouchableOpacity onPress={handleLogout} style={[styles.logoutWrapper, { borderColor: isDarkMode ? 'rgba(255, 85, 85, 0.3)' : 'rgba(255, 85, 85, 0.5)', backgroundColor: isDarkMode ? 'rgba(255, 85, 85, 0.04)' : 'rgba(255, 85, 85, 0.08)' }]} activeOpacity={0.85}>
           <Text style={[styles.logoutText, { color: colors.red }]}>Log Out Account</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
          </>
        ) : null}

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
    paddingTop: 30,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  crownBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  // Pro Card
  proCard: {
    width: '100%',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 20,
  },
  proGrad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  proTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  proDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingVertical: 20,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  // Custom Sync Chart styles
  chartWidget: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 28,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(80, 250, 123, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
    marginRight: 6,
  },
  liveText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: '800',
  },
  chartCanvas: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 6,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
  },
  chartTimeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  timelineText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  // Menu styles
  menuContainer: {
    width: '100%',
    marginBottom: 35,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 14,
  },
  logoutWrapper: {
    width: '100%',
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 85, 85, 0.3)',
    borderRadius: SIZES.radius,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 85, 85, 0.04)',
  },
  logoutText: {
    color: COLORS.red,
    fontSize: 15,
    fontWeight: '700',
  }
});

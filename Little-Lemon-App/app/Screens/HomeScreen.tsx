import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';

import { createTable, getProfileByEmail } from '../../utils/database';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

type Section = {
  name: string;
  data: MenuItem[];
};

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  exclusiveOffers: boolean;
  updatesNews: boolean;
};

const db = SQLite.openDatabaseSync('little_lemon');

const getInitials = (first: string, last: string) => {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
};

type ItemProps = {
  name: string;
  price: number;
  description: string;
  image: string;
};

const localImages: Record<string, any> = {
  grilledFish: require('../../assets/images/grilledFish.png'),
  lemonDessert: require('../../assets/images/lemonDessert.png'),
};

const Item = ({ name, price, description, image }: ItemProps) => {
  const imageName = image.replace('.jpg', '');
  const imageSource = localImages[imageName]
    ? localImages[imageName]
    : {
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
      };

  return (
    <View style={styles.item}>
      <View style={styles.itemBody}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>${Number(price).toFixed(2)}</Text>
      </View>
      <Image style={styles.itemImage} source={imageSource} />
    </View>
  );
};

const HomeScreen = ({ navigation }: any) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [data, setData] = useState<Section[]>([]);
  const sectionListRef = useRef<SectionList | null>(null);

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Multi-select categories tracked with Set<string>
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Debounce search text input changes
  const debouncedSetSearchText = useMemo(
    () =>
      debounce((text: string) => {
        setSearchText(text);
      }, 300),
    [setSearchText]
  );

  useEffect(() => {
    return () => {
      debouncedSetSearchText.cancel();
    };
  }, [debouncedSetSearchText]);

  // Reload profile when screen gains focus
  useFocusEffect(
    useCallback(() => {
      const reloadProfile = async () => {
        const profileString = await AsyncStorage.getItem('profile');
        setProfile(JSON.parse(profileString || 'null'));
      };
      reloadProfile();
    }, [])
  );

  // Load profile on mount
useEffect(() => {
  const initAndLoadProfile = async () => {
    try {
      await createTable();

   
      const emailToSearch = profile?.email || '';

      const profileData = await getProfileByEmail(emailToSearch);

      if (profileData) {
        setProfile(profileData);
        
      } else {
        //console.log('No profile found for email:', emailToSearch);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };
  initAndLoadProfile();
}, []);


  // Fetch menu items on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        const menuItems: MenuItem[] = json.menu.map((item: any, index: number) => ({
          id: `${index}`,
          name: item.name,
          price: parseFloat(item.price),
          description: item.description,
          image: item.image,
          category: item.category,
        }));
        setAllMenuItems(menuItems);
      } catch (error) {
        console.error(error);
        Alert.alert('Failed to load menu data');
      }
    };
    fetchData();
  }, []);

  // Filter and categorize menu items on searchText or selectedCategories changes
  useEffect(() => {
    let filteredItems = allMenuItems.filter(
      item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );

    if (selectedCategories.size > 0) {
      filteredItems = filteredItems.filter(item =>
        selectedCategories.has(item.category.charAt(0).toUpperCase() + item.category.slice(1))
      );
    }

    const categories = ['starters', 'mains', 'desserts', 'drinks'];
    const categorized = categories
      .map(category => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        data: filteredItems.filter(item => item.category === category),
      }))
      .filter(section => section.data.length > 0);

    setData(categorized);
  }, [searchText, selectedCategories, allMenuItems]);

  // Toggle category selection on press
  const handleCategoryPress = (category: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SectionList
        ref={sectionListRef}
        style={styles.sectionList}
        sections={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Item name={item.name} price={item.price} description={item.description} image={item.image} />
        )}
        ListHeaderComponent={
          <>
            {/* Top Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable onPress={() => navigation.navigate('PROFILE')}>
                {profile === null || !profile.image ? (
                  <View style={styles.avatarEmpty}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>
                      {profile ? getInitials(profile.firstName || '', profile.lastName || '') : ''}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.profile}>
                    <Image
                      source={{ uri: profile.image }}
                      style={{ width: '100%', height: '100%', borderRadius: 30 }}
                    />
                  </View>
                )}
              </Pressable>

              <Image source={require('../../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
              <Image source={require('../../assets/images/bag.png')} style={styles.bag} resizeMode="contain" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </View>

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.heroHeader}>Little Lemon</Text>
              <View style={styles.heroBody}>
                <View style={styles.heroContent}>
                  <Text style={styles.heroHeader2}>Chicago</Text>
                  <Text style={styles.heroText}>
                    We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                  </Text>
                </View>
                <Image
                  style={styles.heroImage}
                  source={require('../../assets/images/Hero image.png')}
                  accessible={true}
                  accessibilityLabel={'Little Lemon Food'}
                />
              </View>
              <View style={styles.searchContainer}>
                {searchExpanded ? (
                  <TextInput
                    placeholder="Search..."
                    placeholderTextColor="#495e57"
                    style={styles.searchInput}
                    onBlur={() => setSearchExpanded(false)}
                    autoFocus
                    onChangeText={debouncedSetSearchText}
                  />
                ) : (
                  <Pressable onPress={() => setSearchExpanded(true)}>
                    <Image source={require('../../assets/images/search-icon.png')} style={styles.searchIcon} />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Delivery Callout */}
            <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>

            {/* Category Buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {['Starters', 'Mains', 'Desserts', 'Drinks'].map(category => {
                const isSelected = selectedCategories.has(category);
                return (
                  <Pressable
                    key={category}
                    style={[styles.categoryButton, isSelected && { backgroundColor: '#495e57' }]}
                    onPress={() => handleCategoryPress(category)}
                  >
                    <Text style={[styles.categoryText, isSelected && { color: 'white' }]}>{category}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: 10,
    marginBottom: 50,
    alignSelf: 'center',
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#49SE57',
    borderWidth: 2,
    margin: 10,
  },
  bag: {
    width: 40,
    height: 40,
    margin: 10,
  },
  badge: {
    position: 'absolute',
    bottom: '50%',
    right: 30,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  header: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#dee3e9',
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#f4ce14',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 20,
    borderRadius: 20,
  },
  categoryText: {
    color: '#333',
    fontWeight: 'bold',
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    backgroundColor: '#e4e4e4',
    padding: 5,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  searchContainer: {
    backgroundColor: '#e4e4e4',
    borderRadius: 8,
    padding: 5,
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: '#495e57',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: '#495e57',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 20,
    color: '#000000',
    paddingBottom: 5,
  },
  description: {
    color: '#495e57',
    paddingRight: 5,
  },
  price: {
    fontSize: 20,
    color: '#495e57',
    paddingTop: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  avatarEmpty: {
    margin: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0b9a6a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    backgroundColor: '#495e57',
    padding: 10,
  },
  heroHeader: {
    color: '#f4ce14',
    fontWeight: 'bold',
    fontSize: 36,
  },
  heroHeader2: {
    color: '#fff',
    fontSize: 24,
  },
  heroText: {
    color: '#fff',
    marginVertical: 20,
    fontSize: 16,
  },
  heroBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroContent: {
    flex: 1,
  },
  heroImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  delivery: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
  },
});

export default HomeScreen;

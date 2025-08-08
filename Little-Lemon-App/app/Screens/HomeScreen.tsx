import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const [data, setData] = useState<Section[]>([]);
  const sectionListRef = useRef<SectionList>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);

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
          category: item.category
        }));

        const categorized = ['starters', 'mains', 'desserts', 'drinks'].map(category => ({
          name: category.charAt(0).toUpperCase() + category.slice(1),
          data: menuItems.filter(item => item.category === category)
        }));

        setData(categorized);
      } catch (error) {
        console.error(error);
        Alert.alert('Failed to load menu data');
      }
    };

    fetchData();
  }, []);

  const categoryMap = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((section, index) => {
      map[section.name] = index;
    });
    return map;
  }, [data]);

const [selectedCategory, setSelectedCategory] = useState('');

const handleCategoryPress = (category: string) => {
  setSelectedCategory(category); // highlight selected
  const index = categoryMap[category];
  if (index !== undefined && sectionListRef.current) {
    sectionListRef.current.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
    });
  }
};


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SectionList
        ref={sectionListRef}
        style={styles.sectionList}
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
          />
        )}
        
        ListHeaderComponent={
          <>
            {/* Top Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable onPress={() => navigation.navigate('PROFILE')}>
                <Image
                  source={require('../../assets/images/Profile.png')}
                  style={styles.profile}
                  resizeMode="contain"
                />
              </Pressable>
              <Image
                source={require('../../assets/images/Logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Image
                source={require('../../assets/images/bag.png')}
                style={styles.bag}
                resizeMode="contain"
              />
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
                      onBlur={() => setSearchExpanded(false)} // collapse when focus is lost
                      autoFocus
                    />
                  ) : (
                    <Pressable onPress={() => setSearchExpanded(true)}>
                      <Image
                        source={require('../../assets/images/search-icon.png')} // your telescope icon
                        style={styles.searchIcon}
                      />
                    </Pressable>
                  )}
                </View>
            </View>

            {/* Delivery Callout */}
            <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>

            {/* Category Buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {data.map((section) => {
                  const isSelected = selectedCategory === section.name;

                  return (
                    <Pressable
                      key={section.name}
                      style={[
                        styles.categoryButton,
                        isSelected && { backgroundColor: '#495e57'  } // highlight if selected
                      ]}
                      onPress={() => handleCategoryPress(section.name)}
                    >
                      <Text style={[
                        styles.categoryText,
                        isSelected && { color: 'white' } 
                      ]}>
                        {section.name}
                      </Text>
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
  title:{
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
    alignSelf: 'center'
  },
  profile:{
    width:60,
    height:60,
    borderRadius: 30,
    borderColor: '#49SE57',
    borderWidth: 2,
    margin: 10,

  },
  bag:{
    width:40,
    height:40,
    margin: 10,

  },
  badge: {
    position: 'absolute',
    bottom: '50%',
    right: 30,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#dee3e9",
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
    backgroundColor: '#fff'
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0b9a6a',
    alignItems: "center",
    justifyContent: "center",
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
  }
  
});

export default HomeScreen;






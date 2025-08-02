import * as React from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';


const HomeScreen =({navigation}: any)=>{
  return (
    <ScrollView >
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
           <Pressable  onPress={() => navigation.navigate('PROFILE')}>

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
        
        
                    
    </ScrollView>
  );
}

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
  }
  
});

export default HomeScreen;






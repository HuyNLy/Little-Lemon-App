import { validateEmail, validateName, validatePhone } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { MaskedTextInput } from 'react-native-mask-text';

import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const ProfileScreen = ({ navigation }: any) => {

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: '',
    image: '',
    exclusiveOffers: false,
    updatesNews: false,
  });

  const updateProfile = (key: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((prev) => ({
        ...prev,
        image: result.assets[0].uri,
      }));
    }
  };

  const discardImage = () => {
    setProfile((prev) => ({
      ...prev,
      image: '',
    }));
  };

  const saveProfile = async (profileData: any) => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(profileData));
      console.log('Profile saved!', profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const getIsFormValid = (data: any) => {
    return (
      validateName(data.firstName) &&
      validateName(data.lastName) &&
      validateEmail(data.email) &&
      validatePhone(data.phone)
    );
  };
  
  useEffect(() => {
    const loadProfile = async () => {
      const stored = await AsyncStorage.getItem('profile');
      if (stored) setProfile(JSON.parse(stored));
    };
    loadProfile();
  }, []);
  
  
  

  return (
    <ImageBackground
      source={require('../../assets/images/lemonDessert.png')}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: '#000' }}>Back</Text>
          </Pressable>

          <Image style={styles.logo} source={require('../../assets/images/Logo.png')} />

          <View style={styles.formBox}>
            <Text style={styles.title}>MY PROFILE</Text>

            <View style={styles.row}>
              {profile.image ? (
                <Image style={styles.avt} source={{ uri: profile.image }} />
              ) : (
                <View style={[styles.avt, { backgroundColor: '#ccc' }]} />
              )}
              <Pressable style={styles.button} onPress={pickImage}>
                <Text style={{ color: '#000' }}>Change</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={discardImage}>
                <Text style={{ color: '#000' }}>Discard</Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                placeholder="Enter your first name..."
                placeholderTextColor="#FBDABB"
                onChangeText={(text) => updateProfile('firstName', text)}
                value={profile.firstName}
                style={[styles.input, !validateName(profile.firstName) && styles.inputError]}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Last Name</Text>
              <TextInput
                placeholder="Enter your last name..."
                placeholderTextColor="#FBDABB"
                style={[styles.input, !validateName(profile.lastName) && styles.inputError]}
                value={profile.lastName}
                onChangeText={(text) => updateProfile('lastName', text)}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter your email..."
                keyboardType="email-address"
                placeholderTextColor="#FBDABB"
                style={[styles.input, !validateEmail(profile.email) && styles.inputError]}
                value={profile.email}
                onChangeText={(text) => updateProfile('email', text)}
              />

              <Text style={styles.label}>Phone Number</Text>
              <MaskedTextInput
                  mask="(999) 999-9999"
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number..."
                  placeholderTextColor="#FBDABB"
                  style={[
                    styles.input,
                    !validatePhone(profile.phone) && styles.inputError, 
                  ]}
                  value={profile.phone}
                  onChangeText={(text, rawText) => updateProfile('phone', rawText)}
              />

              <Text style={styles.label}>Email Notification</Text>
              <View style={styles.optionRow}>
                <Checkbox
                  color={'#EE9972'}
                  style={styles.checkbox}
                  value={profile.exclusiveOffers}
                  onValueChange={(value) => updateProfile('exclusiveOffers', value)}
                />
                <Text style={styles.para}>Exclusive Offers</Text>
              </View>

              <View style={styles.optionRow}>
                <Checkbox
                  color={'#EE9972'}
                  style={styles.checkbox}
                  value={profile.updatesNews}
                  onValueChange={(value) => updateProfile('updatesNews', value)}
                />
                <Text style={styles.para}>Updates Feed</Text>
              </View>
            </View>

            <View style={styles.row}>
                <Pressable
                    style={styles.button}
                    onPress={() => saveProfile(profile)}
                    disabled={!getIsFormValid?.(profile)} 
                  >
                    <Text style={{ color: '#000' }}>Save changes</Text>
                  </Pressable>


              <Pressable
                  style={styles.button}
                  onPress={async () => {
                    await AsyncStorage.removeItem('onboardingCompleted');
                    navigation.navigate('WELCOME');
                  }}
                >
                  <Text style={{ color: '#000' }}>Log Out</Text>
                </Pressable>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  logo: {
    marginTop: 10,
    marginBottom: 50,
    alignSelf: 'center',
  },
  formBox: {
    width: '90%',
    paddingVertical: 20,
    backgroundColor: 'rgba(31, 31, 31, 0.4)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  avt: {
    width: 70,
    height: 70,
    borderRadius: 40,
    borderColor: '#49SE57',
    borderWidth: 2,
    margin: 5,
  },
  button: {
    backgroundColor: '#FBDABB',
    borderColor: '#F4CE14',
    borderWidth: 2,
    height: 40,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
  },
  backBtn: {
    backgroundColor: '#FBDABB',
    height: 36,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6, // for Android
  },
  
  label: {
    marginBottom: 4,
    fontSize: 16,
    color: '#FBDABB',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#F4CE14',
    color: '#FBDABB',
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f4ce14',
    backgroundColor: '#0b9bb8ff',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  para: {
    fontSize: 13,
    color: '#F4CE14',
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#F4CE14',
  },
});

export default ProfileScreen;

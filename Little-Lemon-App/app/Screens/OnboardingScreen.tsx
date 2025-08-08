import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { validateEmail, validateName } from '../../utils';

const OnboardingScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, onChangeEmail] = useState('');
  const [name, onChangeName] = useState('');
  const [lastName, onChangeLastName] = useState('');

  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const loadFontsAsync = async () => {
      await Font.loadAsync({
        Karla: require('../../assets/fonts/Karla-Regular.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFontsAsync();
  }, []);

  const isEmailValid = validateEmail(email);
  const isValidName = (name: string) => validateName(name);

  if (!fontsLoaded) return null; // or a loading spinner

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.formBox}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Hi there...</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                placeholder="Enter your name..."
                placeholderTextColor="#FBDABB"
                style={styles.input}
                value={name}
                onChangeText={onChangeName}
                autoCapitalize="words"
              />
            </View>

             <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                placeholder="Enter your last name..."
                placeholderTextColor="#FBDABB"
                style={styles.input}
                value={lastName} 
                onChangeText={onChangeLastName} 
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter your Email..."
                value={email}
                onChangeText={onChangeEmail}
                autoCapitalize="none"
                placeholderTextColor="#FBDABB"
                style={styles.input}
                keyboardType="email-address"
              />
            </View>

            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor:
                    isEmailValid && isValidName(name) ? '#EE9972' : '#888888',
                },
              ]}
              onPress={async () => {
                await AsyncStorage.setItem('onboardingCompleted', 'true');
                await AsyncStorage.setItem('profile', JSON.stringify({
                  firstName: name,
                  lastName: lastName,
                  email: email,
                }));
                navigation.navigate('HOME');
              }}
              disabled={!isEmailValid || !isValidName(name)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 50,
    alignSelf: 'center',
  },
  formBox: {
    width: '80%',
    paddingHorizontal: 30,
    paddingVertical: 50,
    backgroundColor: 'rgba(31, 31, 31, 0.56)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FBDABB',
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
    elevation: 6,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    color: '#FBDABB',
    
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#FBDABB',
    color: '#FBDABB',
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: '#EE9972',
    paddingVertical: 10,
    width: '36%',
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 16,
  },
  buttonText: {
    color: '#FBDABB',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OnboardingScreen;

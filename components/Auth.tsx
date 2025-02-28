import React, { useState, useCallback } from 'react';
import { YStack, Input, Button, Text, XStack, Image } from 'tamagui';
import { supabase } from '../lib/supabase';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validateFields = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: ''
    };
  
    if (!email) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
  
    if (!password) newErrors.password = 'Passwort ist erforderlich';
    if (isRegister && !confirmPassword) {
      newErrors.confirmPassword = 'Passwort-Wiederholung ist erforderlich';
    }
    if (isRegister && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }
  
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      setErrors(newErrors);
      return false;
    }
    
    setErrors({ email: '', password: '', confirmPassword: '' });
    return true;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({ email: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    
    const isValid = validateFields();
    if (!isValid) return;

    try {
      setLoading(true);
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Überprüfe deine E-Mail für den Bestätigungslink!');
        setIsRegister(false);
        resetForm();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setErrors(prev => ({
            ...prev,
            password: 'Ungültiger Benutzer oder Passwort'
          }));
          setPassword('');
          return;
        }
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, isRegister, loading]);

  return (
    <YStack f={1} padding="$4" space="$4" justifyContent="center">
      <Image 
        source={require('../assets/logo/todomate-logo.png')}
        style={{
          width: 150,
          height: 150,
          alignSelf: 'center',
          marginBottom: 32
        }}
      />
      
      <YStack space="$2">
        <Input
          placeholder="Email"
          value={email}
          size="$5"
          onChangeText={(text) => {
            setEmail(text);
            setErrors(prev => ({ ...prev, email: '' }));
          }}
          autoCapitalize="none"
          borderColor="$gray8"
          focusStyle={{
            borderColor: "$secondary",
            borderWidth: 2
          }}
          outlineColor="transparent"
        />
        {errors.email && (
          <Text 
            color="$red10" 
            fontSize="$3"
            fontFamily="$body"
          >
            {errors.email}
          </Text>
        )}
      </YStack>

      <YStack space="$2">
        <Input
          placeholder="Passwort"
          value={password}
          size="$5"
          onChangeText={(text) => {
            setPassword(text);
            setErrors(prev => ({ ...prev, password: '' }));
          }}
          secureTextEntry
          borderColor="$gray8"
          focusStyle={{
            borderColor: "$secondary",
            borderWidth: 2
          }}
          outlineColor="transparent"
        />
        {errors.password && (
          <Text 
            color="$red10" 
            fontSize="$3"
            fontFamily="$body"
          >
            {errors.password}
          </Text>
        )}
      </YStack>

      {isRegister && (
        <YStack space="$2">
          <Input
            placeholder="Passwort wiederholen"
            value={confirmPassword}
            size="$5"
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }}
            secureTextEntry
            borderColor="$gray8"
            focusStyle={{
              borderColor: "$secondary",
              borderWidth: 2
            }}
            outlineColor="transparent"
          />
          {isRegister && errors.confirmPassword && (
            <Text 
              color="$red10" 
              fontSize="$3"
              fontFamily="$body"
            >
              {errors.confirmPassword}
            </Text>
          )}
        </YStack>
      )}

      <Button 
        onPress={handleSubmit}
        disabled={loading}
        backgroundColor="$secondary"
        color="white"
        size="$5"
        width="100%"
        height={50}
        hoverStyle={{
          backgroundColor: "$secondary"
        }}
        pressStyle={{
          scale: 0.97,
          backgroundColor: "$secondary"
        }}
      >
        <Text color="white" fontFamily="$body">
          {isRegister ? 'Registrieren' : 'Einloggen'}
        </Text>
      </Button>

      <XStack justifyContent="center">
        <Text 
          onPress={() => {
            setIsRegister(!isRegister);
            resetForm();
          }}
          color="$secondary"
          fontSize="$4"
          textAlign="center"
          pressStyle={{ opacity: 0.8 }}
          fontFamily="$body"
        >
          {isRegister ? 'Bereits einen Account?' : 'Noch keinen Account?'}
        </Text>
      </XStack>
    </YStack>
  );
} 
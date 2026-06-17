import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import PGDetailScreen from '../screens/pg/PGDetailScreen';
import AIChatScreen from '../screens/search/AIChatScreen';
import BookVisitScreen from '../screens/visits/BookVisitScreen';
import SearchScreen from '../screens/search/SearchScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, hydrate, _hasHydrated } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  if (!_hasHydrated) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="SearchDedicated" component={SearchScreen} options={{ headerShown: false, animation: 'slide_from_bottom' }} />
            <Stack.Screen name="PGDetail" component={PGDetailScreen} options={{ headerShown: false, animation: 'slide_from_right' }} />
            <Stack.Screen name="AIChat" component={AIChatScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="BookVisit" component={BookVisitScreen} options={{ animation: 'slide_from_right' }} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

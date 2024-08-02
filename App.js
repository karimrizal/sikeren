/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screen/HomeScreen';
import DetailsScreen from './screen/DetailsScreen';
import BottomTabScreen from './screen/BottomTabScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';
import LoginScreen from './screen/LoginScreen';
import CameraScreen from './screen/CameraScreen';
import ClaimScreen from './screen/ClaimScreen';
import { MenuProvider } from 'react-native-popup-menu';
import CreateKegiatanScreen from './screen/CreateKegiatanScreen';
import CreateRapatScreen from './screen/CreateRapatScreen';
import DetailKegiatanScreen from './screen/DetailKegiatanScreen';
import TransferScreen from './screen/TransferScreen';
import HistoryScreen from './screen/HistoryScreen';
import ApproveScreen from './screen/ApproveScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <PortalProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              headerShown: false
            }}>
              {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
              <Stack.Screen name="Btab" component={BottomTabScreen} />
              <Stack.Screen name="Details" component={DetailsScreen} />
              <Stack.Screen name="Transfer" component={TransferScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Approve" component={ApproveScreen} />
              <Stack.Screen name="Detailk" component={DetailKegiatanScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Camera" component={CameraScreen} />
              <Stack.Screen name="Claim" component={ClaimScreen} />
              <Stack.Screen name="Ckegiatan" component={CreateKegiatanScreen} />
              <Stack.Screen name="CRapat" component={CreateRapatScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PortalProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}

export default App;

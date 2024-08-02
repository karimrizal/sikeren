import { View, Text, Button } from 'react-native'
import React from 'react'
// import Icon from 'react-native-vector-icons/FontAwesome';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from './HomeScreen';
import SettingScreen from './SettingScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BmnScreen from './BmnScreen';
import KegiatanScreen from './KegiatanScreen';

const Tab = createMaterialBottomTabNavigator();

function BottomTabScreen() {
    return (
      <Tab.Navigator shifting>
        <Tab.Screen name="Home" component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={26} />
            ),
            tabBarColor: "#2196f3"
          }} 
        
        />

        <Tab.Screen name="Kegiatan" component={KegiatanScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="calendar-clock" color={color} size={26} />
            ),
            tabBarColor: "#FF6F00"
          }} 
        
        />

        <Tab.Screen name="Bmns" component={BmnScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="package-variant-closed" color={color} size={26} />
            ),
            tabBarColor: "#9c27b0"
          }}  
        
        />

        <Tab.Screen name="Settings" component={SettingScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="cog-outline" color={color} size={26} />
            ),
            tabBarColor: "#009688"
          }}  
        
        />
      </Tab.Navigator>
    );
  }

export default BottomTabScreen

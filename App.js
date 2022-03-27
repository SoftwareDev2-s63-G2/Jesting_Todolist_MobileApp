import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './RootNavigation';
import Home from './screens/Home'
import EditingTodo from './screens/EditingTodo'
import AddingTodo from './screens/AddingTodo'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Add"  component={AddingTodo} />
        <Stack.Screen name="Edit" component={EditingTodo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
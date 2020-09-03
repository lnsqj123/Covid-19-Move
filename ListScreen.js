import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Listdata from "./Listdata";
import List_mapScreen from "./List_mapScreen";

const ListStack = createStackNavigator();

export default function MainScreen({ navigation }) {
  return (
    <ListStack.Navigator initialRouteName={Listdata} >
      <ListStack.Screen name="Listdata" component={Listdata} options={{headerShown: false}} />
      <ListStack.Screen name="List_mapScreen" component={List_mapScreen} />
    </ListStack.Navigator>
  )
}
import 'react-native-gesture-handler';
import "@firebase/firestore";
import * as React from 'react';
import { StatusBar, StyleSheet, Alert, AsyncStorage, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StartScreen from "./StartScreen";
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import MainScreen from './MainScreen';
import ListScreen from "./ListScreen";
//import Othersdata from './Othersdata';
import Settingdata from './Settingdata';
import {AuthContext, LOCATION_TASK_NAME} from './GlobalVar';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AppLoading } from 'expo';

const Tab = createBottomTabNavigator();
const SignStack = createStackNavigator();
const Stack = createStackNavigator();

export default function App({ route, Navigation }) {
  const [loading, setloading] = React.useState(false);
  const isTabBarVisible = (route) => {
    const routeName = route.state
        ? route.state.routes[route.state.index].name
        : (route.params ? route.params.screen : "MainScreen");
    return !['List_mapScreen'].includes(routeName);
  }
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            userToken: action.token,
          };
        case 'SIGN_IN':
          return {
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            userToken: action.token,
          };
      }
    },
    {
      userToken: null,
    }
  );
  
  React.useLayoutEffect(() => {
    bootstrapAsync();
  }, [])
  const bootstrapAsync = async () => {
    let userToken = null;
    try {
      userToken = await AsyncStorage.getItem('userToken');
    } catch (e) {
      Alert.alert("Error!","Restoring token failed");
    }
    dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    Alert.alert(`token: ${userToken}`, `state: ${state.userToken}`);
  };
  
  const authContext = React.useMemo( () => ({
      signIn: data => dispatch({ type: 'SIGN_IN', token: "auth" }),
      signOut: data => {
        dispatch({ type: 'SIGN_OUT', token: null }),
        Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
        ? Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
        : null
      }
    }),
    []);
  
  const BottomTabNavi = () => {
    return (
      <Tab.Navigator initialRouteName={MainScreen} screenOptions={({route}) => ({tabBarVisible: isTabBarVisible(route)})}>
        
        
        <Tab.Screen 
          name="MainScreen" 
          component={MainScreen} 
          options={{
            tabBarLabel: " ",
            tabBarIcon: ({ color, size }) => (
              <SimpleLineIcons name="menu" size={24} color="black" />
              // <Icon name="ios-list" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen 
          name="ListScreen" 
          component={ListScreen} 
          options={{
            tabBarLabel: " ",
            tabBarIcon: ({ color, size }) => (
              <SimpleLineIcons name="home" size={30} color="black" />
              // <Icon name="home-outline" color={color} size={size} />
            ),
          }}
        />
        {//<Tab.Screen 
        //  name="Othersdata" 
        //  component={Othersdata} 
        //  options={{
        //    tabBarLabel: " ",
        //    tabBarIcon: ({ color, size }) => (
        //      <Icon name="ios-add" color={color} size={size} />
        //    )
        //  }}
        ///>
        }
        <Tab.Screen 
          name="Settingdata" 
          component={Settingdata} 
          options={{
            tabBarLabel: " ",
            tabBarIcon: ({ color, size }) => (
              <Feather name="more-horizontal" size={30} color="black" />
              // <Icon name="ios-more" color={color} size={size} />
            )
          }}
        />
      </Tab.Navigator>
    )
  }
  
  const Signinup = () => {
    return (
      <SignStack.Navigator initialRouteName={StartScreen}>
        <SignStack.Screen name="Start" component={StartScreen} options={{title: 'Sign in'}}/>
        <SignStack.Screen name="SignUp" component={SignUpScreen} />
        <SignStack.Screen name="Login" component={LoginScreen} />
      </SignStack.Navigator>
    )
  }

  if (loading) {
    return (
      <AppLoading
        startAsync={bootstrapAsync()}
        onFinish={()=>setloading(true)}
        onError={Alert.alert("error")}
      />
    )
  }
  else {
    return (
      <AuthContext.Provider value={authContext}>
        <StatusBar barStyle="default" hidden={false} />
        <NavigationContainer>
          <Stack.Navigator>
          {state.userToken !== null ?
            <Stack.Screen name="TabNavi" component={BottomTabNavi} options={{headerShown: false}} />
          : <Stack.Screen name="signinup" component={Signinup} options={{headerShown: false}} />
          }
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CustomButton from './custombutton';

export default class StartScreen extends Component {
   render() {
       return (
        <View style={styles.container}>
            <View style={styles.header} />
            <View style={styles.title}>
                <Text style={{fontSize:35,color:'black'}}>Covid-19 Move</Text>
            </View>
            <View style={styles.content} />
            <View style={styles.button1}>
              <CustomButton
                  titleColor={"white"}
                  buttonColor={'#444'}
                  title={'회원가입'}
                  onPress={() => this.props.navigation.navigate("SignUp")}
              />
            </View>
            <View style={styles.button2}>
              <CustomButton
                  titleColor={"white"}
                  buttonColor={'#023e73'}
                  title={'로그인'}
                  onPress={() => this.props.navigation.navigate("Login")}
              />
            </View>
        </View>
       )
   } 
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: 'skyblue',
    },
    header: {
      width:'100%',
      height:'5%',
      //backgroundColor: '#ff9a9a',
    },
    title: {
      width:'100%',
      height:'18%',
      justifyContent: 'center',
      alignItems: "center"
      //backgroundColor: '#9aa9ff',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom:30,
      //backgroundColor: '#d6ca1a',
    },
    button1: {
      width:'100%',
      height:'10%',
      marginBottom: 10
      //backgroundColor: '#1ad657',
    },
    button2: {
      width:'100%',
      height:'10%',
      //backgroundColor: '#1ad657',
    },
  });
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, YellowBox } from 'react-native';
import CustomButton from './custombutton';
import firebase from "firebase";
import SocialSignInButton from './SocialSigninButton';
import SvgGoogle from './assets/svgs/google.svg';
import "@firebase/firestore";

YellowBox.ignoreWarnings(['Setting a timer']);
export default function SignUp({ navigation }) {
  const [value1, onChangeText1] = useState('');
  const [value2, onChangeText2] = useState('');
  const [value3, onChangeText3] = useState('');
  const ref_input2 = useRef();
  const ref_input3 = useRef();

  const onClick = async() => { 
    try {
      value2 === value3 
        ? (
          await firebase.auth()
            .createUserWithEmailAndPassword(value1, value2)
              .then(async(authUser) => {
                try {
                  let User = firebase.auth().currentUser;
                  User.sendEmailVerification().then(()=>{
                    console.log("이메일 전송");
                  }).catch((e)=>console.log(e));
                  navigation.popToTop();
                  Alert.alert("회원가입이 완료되었습니다.");
                  const user = authUser.user;
                  const newUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    signInMethod: "email_and_password",
                    point: 0,
                  };
                  await firebase.firestore().collection('users')
                    .doc(user.uid)
                    .set(newUser, { merge: true });
                } catch(e) {
                  Alert.alert(e)
                }
                })
              .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                  Alert.alert('The password is too weak.');
                } else {
                  Alert.alert(errorMessage);
                }
                console.log(error);
              })
        ) : (
          Alert.alert("비밀번호와 확인이 일치하지 않습니다.")
        )
    } catch(e) {
      Alert.alert(e);
    }
  }

  const onKeyPress = () => {
    onClick();
  }

  return (
    <View style={{
      flex: 1,
      padding: 10,
      backgroundColor: "white"
    }}>
        <View style={{
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: 10
        }}>
          <Text style={{fontSize: 50, }}>
              회원가입
          </Text>
        </View>
        <View style={{
          flex: 2,
        }}>
          <View style={{
            flex: 2,
            borderTopWidth: 2,
          }}>
            <View style={{
              alignItems: "center",
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "flex-end",
            }}>
              <Text style={{
                flex: 1,
                height: 30,
                fontSize: 20,
              }}>
                이메일
              </Text>
              <TextInput
                onSubmitEditing={() => ref_input2.current.focus()}
                style={{flex: 2, height: 30, borderWidth: 1, borderRadius: 5}}
                placeholder="ID"
                editable
                maxLength={20}
                onChangeText={text => onChangeText1(text)}
                value={value1}
                autoFocus={true}
                blurOnSubmit={false}
                returnKeyType = {"next"}
              />
            </View>
            <View style={{
              marginTop: 10,
              alignItems: "center", 
              flexDirection: "row",
              justifyContent: "center",
            }}>
              <Text style={{
                flex: 1,
                height: 30,
                fontSize: 20,
                justifyContent: "center",
              }}>
                비밀번호
              </Text>
              <TextInput 
                style={{flex: 2, height: 30, borderWidth: 1, borderRadius: 5}}
                placeholder="password"
                editable
                maxLength={20}
                onChangeText={text => onChangeText2(text)}
                value={value2}
                blurOnSubmit={false}
                secureTextEntry
                returnKeyType = {"next"}
                onSubmitEditing={() => ref_input3.current.focus()}
                ref={ref_input2}
              />
            </View>
            <View style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "center",
            }}>
              <Text style={{
                flex: 1,
                height: 30,
                fontSize: 20
              }}>
                비밀번호 확인
              </Text>
              <TextInput 
                style={{flex: 2, height: 30, borderWidth: 1, borderRadius: 5}}
                placeholder="repeat password"
                editable
                maxLength={20}
                onChangeText={text => onChangeText3(text)}
                value={value3}
                onSubmitEditing={onKeyPress}
                blurOnSubmit={true}
                secureTextEntry
                ref={ref_input3}
              />
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{padding: 5, marginBottom: 10, borderRadius: 20}}>
             <SocialSignInButton
                clientId={`<clientId>`}
                clientSecret={`<clientSecret>`}
                socialProvider={"facebook"}
              />
            </View>
            <View style={{padding: 5, marginBottom: 10, borderRadius: 20}}>
              <SocialSignInButton
                clientId={`<clientId>`}
                clientSecret={`<clientSecret>`}
                socialProvider={"google"}
              />
            </View>
          </View>
        </View>
        <View style={{flex: 1, alignItems: "center"}}>
          <View style={styles.footer}>
            <View style={{
              width: "100%",
              height: "40%",
              borderWidth: 1,
              marginBottom: 10
            }}>
              <CustomButton 
                titleColor={"white"}
                buttonColor={'#444'}
                title={"취소"} 
                onPress={() => navigation.popToTop()} 
              />
            </View>
            <View style={{
              width: "100%",
              height: "40%",
              borderWidth: 1,
            }}>
              <CustomButton 
                titleColor={"white"}
                buttonColor={'#023e73'}
                title={"회원가입"} 
                onPress={onClick}
              />
            </View>
          </View>
        </View>
    </View>
  );
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
    //backgroundColor: '#9aa9ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:30,
    //backgroundColor: '#d6ca1a',
  },
  footer: {
    flex: 1,
    width: "100%",
    height: "10%",
    alignItems: "center",
    justifyContent: "flex-end",
    //backgroundColor: '#1ad657',
  },
});
import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DropdownMenu from 'react-native-dropdown-menu';
import firebase from "firebase";
import "@firebase/firestore";

export default class Othersdata extends Component {
  state = {
    name: "displayName",
    email: "email",
    photoUrl: "photoURL",
    emailVerified: "emailVerified",
    uid: "uid",
  };
  constructor(props) {
    super(props)
  }
  componentDidMount = async() => {
    await firebase.firestore().collection("currentUser").doc("123").get().then((User) => {
      if (User.exists) {
        console.log(User.data());
        this.setState({
          name: User.data().displayName,
          email: User.data().email,
          photoUrl: User.data().photoURL,
          signInMethod: User.data().signInMethod,
          uid: User.data().uid,
        })
      }
    });
    /*
    const User = firebase.auth().currentUser;
    if (User) {
      this.setState({
        name: User.displayName,
        email: User.email,
        photoUrl: User.photoURL,
        emailVerified: User.emailVerified,
        uid: User.uid,
      })
    }*/
  }
  render() {
    var data = [["Date 1","Date 2","Date 3","Date 4","Date 5","Date 6","Date 7","Date 8","Date 9","Date 10"]];
    return (
        <View style={styles.dropmenubar}>
        <DropdownMenu
          style={styles.dropmenu}
          bgColor={'white'}
          tintColor={'#2c2c2c'}
          activityTintColor={'green'}
          // arrowImg={}
          // checkImage={}
          optionTextStyle={{color: '#333333', fontSize: 25}}
          titleStyle={{color: '#333333', fontSize: 25}} 
          maxHeight={300}
          data={data}
        >
            <View style={styles.container}>
              <View style={styles.loadingcontainer}>
                <Text style={{fontSize: 15}}>{this.state.name}</Text>
                <Text style={{fontSize: 15}}>{this.state.email}</Text>
                <Text style={{fontSize: 15}}>{this.state.photoUrl}</Text>
                <Text style={{fontSize: 15}}>{this.state.emailVerified}</Text>
                <Text style={{fontSize: 15}}>{this.state.uid}</Text>
              </View>
            </View>
          </DropdownMenu>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  dropmenubar: {
    flex: 10
  },
  dropmenu: {
    flex: 1,
    height: 64,
    alignItems: 'center',
    justifyContent: "center"
  },
  mapcontainer: {
    flex: 10
  },
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#48FFFF",
    borderTopWidth: 2,
    borderColor: "#FFCCFF"
  },
  menubar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#48FFFF"
  },
  checkbutton: {
    flex: 1,
    width: '60%',
    color: "#2c2c2c",
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: "300",
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5
  },
  loadingcontainer: {
      flex: 1,
      justifyContent: 'center'
  }
});
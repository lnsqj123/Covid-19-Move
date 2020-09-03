import 'react-native-gesture-handler';
import "@firebase/firestore";
import React, { Component } from 'react';
import { StyleSheet, View, Alert, Text, Modal, TouchableOpacity } from 'react-native';
import CustomButton from './custombutton';
import MapView, { PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";
import firebase from "firebase";
import { LOCATION_TASK_NAME } from "./GlobalVar";
import { Checkbox } from "react-native-paper";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const timestamp = JSON.stringify(locations[0].timestamp);
    console.log(locations, timestamp);
    locations.map(async(location) => {
      try {
        await firebase.firestore().collection("currentUser").doc("123").get().then(async(User) => {  
          if (User.exists) {
            var today = new Date();
            var date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            console.log(User.data());
            await firebase.firestore().collection('locations')
                  .doc(User.data().uid).collection(date).get()
                  .then(async(res) => {
                    if (!res.exists) {
                      var date2 = new Date(-1 * (10 * 1000 * 60 * 60 * 24 - today));
                      var date2_string = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`;
                      await firebase.firestore().collection("locations")
                            .doc(User.data().uid).collection(date2_string).get().then((snapshot) => {
                                  snapshot.docs.map((doc) => {
                                    doc.ref.delete();
                                  });
                            });
                    }
                    await firebase.firestore().collection('locations')
                          .doc(User.data().uid).collection(date).doc(timestamp)
                          .set({location: location.coords})
                  });
          }
        });
      } catch(e) {
        console.log(e);
      }
    })
  }
});

export default class MainScreen extends Component {
  _isMounted = false;
  state = {
    region: {
      latitude: 37.4219857,
      longitude: -122.0840379,
      latitudeDelta: 0.009,
      longitudeDelta: 0.004,
    },
    text: '',
    temp: true,
    bottomMargin: 0,
    modalVisible: false,
    locationandpushenabled: false,
    locationenabled: false,
    pushnotificationenabled: false
  };
  constructor(props) {
    super(props);
  };
  getLocation = async() => {
    try {
      const { status } = await Location.requestPermissionsAsync();
      const permissionStatus = await Location.getProviderStatusAsync();
      const newStatus = permissionStatus.locationServicesEnabled;

      //if phone location is disabled
      if (!newStatus) {
        Alert.alert(
          "Error",
          "Please Turn On your Location",
          { cancelable: false }
        );
      }
      else {
        if (status === 'granted') {
          const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
          this._isMounted ? 
          this.setState( (nowstate) => ({
              region: {
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.009,
                  longitudeDelta: 0.004
              }
          })) : null;

          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 3000,
            distanceInterval: 1,
            foregroundService: {
              notificationTitle: 'Your title',
              notificationBody: 'Notification Body'
            },
            pausesUpdatesAutomatically: false,
          });
        } else {
          Alert.alert("설정에서 위치 권한 활성화 필요");
        }
      }
    }
    catch(error){
      Alert.alert("Can't find you.","So sad");
    }
  };
  getModalTokendata = async() => {
    try {
      await firebase.firestore().collection("currentUser").doc("123").get().then(async(User) => {
        if (User.exists) {
          await firebase.firestore().collection("ModalToken").doc(`${User.data().uid}_ModalToken`).get().then((modaltoken)=>{
            if (modaltoken.exists) {
              this.setState({
                modalVisible: false
              })
            } else {
              this.setState({
                modalVisible: true
              })
            }
          })
        } else {
          this.setState({
            modalVisible: true
          })
        }
      })
    } catch(e) {
      console.log(e)
    }
  }
  PersonalInfoCollandUse = () => {
    null
  }
  componentDidMount = async() => {
    try {
      this._isMounted = true;
      await this.getModalTokendata();
      await this.getLocation();
    } catch(e) {
      console.log(e);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <View style={styles.dropmenubar}>
        <Modal
          animationType="slide"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          presentationStyle="overFullScreen"
        >
          <View style={{...styles.centeredView, backgroundColor: "rgba(0,0,0,0.5)"}}>
            <View style={styles.modalView_1}>
            <View style={{...styles.modalView, backgroundColor: "white"}}>
              <Text style={{...styles.modalText, marginBottom: 20, fontSize: 25}}>아래 약관을 동의하시면 Covid-19 Move을 시작합니다.</Text>
              <View style={{borderTopWidth: 2, marginBottom: 20}} />
              <View style={{flexDirection: "row", marginBottom: 10}}>
                <View style={{flex: 1}}>
                  <Checkbox
                    title='locationandpushenabled'
                    status={this.state.locationandpushenabled ? 'checked' : 'unchecked'}
                    onPress={() => { !this.state.locationandpushenabled ? this.setState({locationandpushenabled: true, locationenabled: true, pushnotificationenabled: true}) : this.setState({locationandpushenabled: false, locationenabled: false, pushnotificationenabled: false}) }}
                  />
                </View>
                <View style={{flex: 5, justifyContent: "center"}}>
                  <View style={styles.modalText}>
                    <Text style={{fontSize: 18}}>아래의 내용에 모두 동의합니다.</Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: "row"}}>
                <View style={{flex: 1}}>
                  <Checkbox
                    title='locationenabled'
                    status={this.state.locationenabled ? 'checked' : 'unchecked'}
                    onPress={() => { this.state.locationenabled ? this.setState({locationenabled: false, locationandpushenabled: false}) : (this.state.pushnotificationenabled ? this.setState({locationenabled: true, locationandpushenabled: true}) : this.setState({locationenabled: true}))}}
                  />
                </View>
                <View style={{flex: 5, justifyContent: "center"}}>
                  <View style={{...styles.modalText, marginBottom: 2}}>
                    <Text style={{fontSize: 18}}>위치 기반 서비스 약관 (필수)</Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: "row", marginBottom: 15}}>
                <View style={{flex: 1}} />
                <View style={{flex: 5}}>
                  <View style={{...styles.modalText, marginBottom: 4}}>
                    <Text style={{color: "#A9A9A9"}}>내 위치 정보를 활용하여 실시간 어쩌구 저쩌구 어쩌구 저쩌구 정보를 제공합니다.</Text>
                  </View>
                  <View style={{...styles.modalText, alignItems: "flex-start"}}>
                    <TouchableOpacity
                      onPress={this.PersonalInfoCollandUse()}
                    >
                      <Text style={{color: "blue", borderBottomWidth: 1, borderBottomColor: "blue"}}>자세히 보기</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: "row"}}>
                <View style={{flex: 1}}>
                  <Checkbox
                    title='pushnotificationenabled'
                    status={this.state.pushnotificationenabled ? 'checked' : 'unchecked'}
                    onPress={() => { this.state.pushnotificationenabled ? this.setState({locationandpushenabled: false, pushnotificationenabled: false}) : (this.state.locationenabled ? this.setState({locationandpushenabled: true, pushnotificationenabled: true}) : this.setState({pushnotificationenabled: true})) }}
                  />
                </View>
                <View style={{flex: 5, justifyContent: "center"}}>
                  <View style={styles.modalText}>
                    <Text style={{fontSize: 18}}>앱 push 수신 (선택)</Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: "row", marginBottom: 15}}>
                <View style={{flex: 1}} />
                <View style={{flex: 5, justifyContent: "center"}}>
                  <View style={styles.modalText}>
                    <Text style={{color: "#A9A9A9"}}>앱 push를 받아볼 수 있습니다.</Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={{borderBottomRightRadius: 20, borderBottomLeftRadius: 20, borderTopWidth: 1, borderTopColor: this.state.locationenabled ? "black" : "#BBBBBB"}}
                  disabled={!this.state.locationenabled}
                  onPress={async() => {
                    try {
                      await firebase.firestore().collection("currentUser").doc("123").get().then(async(User) => {
                        if (User.exists) {
                          console.log(User.data());
                          this.setState({modalVisible: false})
                          await firebase.firestore().collection("ModalToken").doc(`${User.data().uid}_ModalToken`).set({modaltoken: true, pushtoken: this.state.pushnotificationenabled});
                        }
                      });
                    } catch(e) {
                      console.log(e)
                    }
                  }}
                  color="white"
                >
                  <View style={{height: 55, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize: 22, color: this.state.locationenabled ? "black" : "#BBBBBB"}}>
                      확인
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View></View>
        </Modal>
        <View style={styles.title}>
          <Text style={{fontSize:25,color:'black'}}>Today Traffic Line</Text>
        </View>
        <MapView
            style={{marginBottom: this.state.bottomMargin,...styles.mapcontainer}}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
            ref={ map => { this.map = map }}
            region={this.state.region}
            onMapReady={this._isMounted ? () => this.setState({ bottomMargin: 1 }) : null}
            showsUserLocation={true}
            showsMyLocationButton={true}
        >
        {
          // <UrlTile
          // urlTemplate={this.state.urlTemplate}
          // maximumZ={19}
          // flipY={false}
          // /> 
        }
        </MapView>
        <View style={styles.container}>
          <View style={styles.checkbutton}>
            <CustomButton
              title={ "Detail map info" } 
              alignItems="center"
              onPress={() => {
                Alert.alert("Alert","Detail"), 
                this.props.navigation.navigate("Mapdata")
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dropmenubar: {
    flex: 4
  },
  dropmenu: {
    flex: 4,
    alignItems: 'center',
    justifyContent: "center"
  },
  title: {
    width:'100%',
    height:'30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 4,
    borderColor: "#A0C6FF"
  },
  mapcontainer: {
    flex: 4
  },
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 4,
    borderColor: "#A0C6FF"
  },
  menubar: {
    flex: 2,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  },
  checkbutton: {
    width: '40%',
    height: "20%",
    color: "#FFFFFF",
    justifyContent: 'center',
    fontSize: 24,
    borderWidth: 3,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderColor: "#A0C6FF"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView_1: {
    margin: 30,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalView: {
    marginTop: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  buttonView: {
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  modalText: {
    textAlign: "center"
  },
});
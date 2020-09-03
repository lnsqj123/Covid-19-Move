import "@firebase/firestore";
import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import DropdownMenu from 'react-native-dropdown-menu';
import CustomButton from './custombutton';
import MapView, { PROVIDER_GOOGLE, Marker, UrlTile, Polyline } from 'react-native-maps';
import firebase from "firebase";
//import * as Location from "expo-location";
//import axios from 'axios';

export default class Mapdata extends Component {
  _isMounted = false;
  state = {
    region: {
      latitude: 37.4219857,
      longitude: -122.0840379,
      latitudeDelta: 0.009,
      longitudeDelta: 0.004,
    },
    markers: [{
      latlng:{
        latitude:37.562516,
        longitude:127.035679
      },
      title:"희망약국",
      description:"왕십리에 있는 약국"
    },
    {
      latlng:{
        latitude:37.562516,
        longitude:127.037
      },
      title:"희망약국2",
      description:"왕십리에 있는 약국"
    }],
    coordinate: [],
    text: '',
    temp: true,
    bottomMargin: 0,
    urlTemplate: "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };
  constructor(props) {
    super(props);
  };
  options = {
    enableHighAccuracy: true, 
    // distanceInterval: 2000,
    // timeInterval: 200000,
    maximumAge: 2000, 
    timeout: 27000
  };
  /*
  getLocation = async() => {
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
        this.watchID = await Location.watchPositionAsync(this.options, async(position)=>{
          const {latitude, longitude} = position.coords
          await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude + ',' + position.coords.longitude}&sensor=true&key=<API key>`)
            .then(response => {
              this._isMounted ? 
                this.setState((nowstate)=>({
                  region: {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.004,
                  },
                  coordinate: [
                    ...nowstate.coordinate, {
                      latitude: latitude,
                      longitude: longitude
                    }
                  ],
                  markers: [
                    ...nowstate.markers, {
                      latlng: {
                        latitude: latitude,
                        longitude: longitude
                      },
                      title: response.data.results[0].formatted_address,
                      description: response.data.results[0].formatted_address
                    }
                  ]
                })) : null;
            })
        });
      } else {
        Alert.alert("설정에서 위치 권한 활성화 필요");
      }
    }
  };*/
  /*
  getsnaptoload = async() => {
    var data = this.state.Array.map( (Arraydata) => (
      Arraydata.latitude + ',' + Arraydata.longitude
    ))
    await axios.get(`https://roads.googleapis.com/v1/snapToRoads?path=-35.27801,149.12958|-35.28032,149.12907|-35.28099,149.12929|-35.28144,149.12984|-35.28194,149.13003|-35.28282,149.12956|-35.28302,149.12881|-35.28473,149.12836&interpolate=true&key=<API key>`)
    .then(response => {
      this.setState(() => ({
        Array: response.data.snappedPoints
      }))
    })
    var data2 = this.state.Array.map(arraydata => (
      arraydata.location
    ))
    this.setState(() =>  ({
      Arrays: data2
    }))
    console.log(this.state.Arrays)
  }*/
  getlocation_from_storage = async() => {
    try {
      await firebase.firestore().collection("currentUser").doc("123").get()
        .then(async(User) => {
          if (User.exists && !this.state.temp) {
            var coordinate1 = [];
            var markers1 = [];
            await firebase.firestore().collection("locations")
            .doc(User.data().uid).collection(this.state.text).get()
            .then((snapshot) => {
              snapshot.docs.map((doc) => 
                doc !== null ?
                  (
                    coordinate1.push({
                      latitude: doc.data().location.latitude,
                      longitude: doc.data().location.longitude
                    }),
                    markers1.push({
                      latlng: {
                        latitude: doc.data().location.latitude,
                        longitude: doc.data().location.longitude
                      }, 
                      title: "location",
                      description: "this location"
                    }) 
                  ) : null
              )
            })
            this.setState((nowstate) => ({
              region: {
                latitude: coordinate1.length > 0 ? coordinate1[0].latitude : 37.4219857,
                longitude: coordinate1.length > 0 ? coordinate1[0].longitude : -122.0840379,
                latitudeDelta: nowstate.region.latitudeDelta,
                longitudeDelta: nowstate.region.longitudeDelta
              },
              coordinate: coordinate1,
              markers: markers1
            }))
          }
        })  
    } catch(e) {
      console.log(e)
    }
  }
  date_to_String = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
  get_Today = () => {
    var today = new Date();
    this.setState({
      text: this.date_to_String(today),
      temp: false
    })
  }
  async componentDidMount() {
    this._isMounted = true;
    this.get_Today();
    // this.getsnaptoload();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.text !== prevState.text) {
      this.getlocation_from_storage();
    }
  }
  componentWillUnmount() {
    this.watchID && this.watchID.remove();
     this._isMounted = false;
  }
  render() {
    var today = new Date();
    var date1 = new Date(-1 * (1 * 1000 * 60 * 60 * 24 - today));
    var date2 = new Date(-1 * (2 * 1000 * 60 * 60 * 24 - today));
    var date3 = new Date(-1 * (3 * 1000 * 60 * 60 * 24 - today));
    var date4 = new Date(-1 * (4 * 1000 * 60 * 60 * 24 - today));
    var date5 = new Date(-1 * (5 * 1000 * 60 * 60 * 24 - today));
    var date6 = new Date(-1 * (6 * 1000 * 60 * 60 * 24 - today));
    var date7 = new Date(-1 * (7 * 1000 * 60 * 60 * 24 - today));
    var date8 = new Date(-1 * (8 * 1000 * 60 * 60 * 24 - today));
    var date9 = new Date(-1 * (9 * 1000 * 60 * 60 * 24 - today));
    var data = [[this.date_to_String(today),this.date_to_String(date1),this.date_to_String(date2),this.date_to_String(date3),this.date_to_String(date4),this.date_to_String(date5),this.date_to_String(date6),this.date_to_String(date7),this.date_to_String(date8),this.date_to_String(date9)]];
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
          handler={this._isMounted ? (selection, row) => this.setState( (nowstate) => ({
            ...nowstate,
            text: data[selection][row], 
            temp: false 
          })) : null}
          data={data}
        >
          <MapView
              style={{marginBottom: this.state.bottomMargin,...styles.mapcontainer}}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              ref={ map => { this.map = map }}
              region={this.state.region}
              onMapReady={this._isMounted ? (nowstate) => this.setState({ ...nowstate, bottomMargin: 1 }) : null}
              showsUserLocation={true}
              showsMyLocationButton={true}
          >
          {
            //<Marker draggable
            //  coordinate={{
            //    latitude: this.state.region.latitude,
            //    longitude: this.state.region.longitude
            //  }}
            //  title="My home"
            //  description="My home example"
            //  onDragEnd={this._isMounted ? (e) => this.setState({x: e.nativeEvent.coordinate}) : null}
            ///>
          }
          { this.state.markers.map((marker,index)=>{
               return <Marker
                        coordinate={marker.latlng}
                        title={marker.title}
                        description={marker.description}
                        key={index}
                      />
           })
          }
          {
            // <UrlTile
            // urlTemplate={this.state.urlTemplate}
            // maximumZ={19}
            // flipY={false}
            // /> 
          }
          <Polyline 
            coordinates={this.state.coordinate}
            strokeColor={"black"}
            strokeWidth={4}
            tappable={true}
            onPress={ () => Alert.alert("black", "load") }
          />
          </MapView>
            <View style={styles.container}>
              <View style={styles.checkbutton}>
                <CustomButton 
                  title={ "Go MainScreen" }
                  onPress={() => {
                    Alert.alert("Alert","go back"),
                    this.props.navigation.pop()
                  }}
                />
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
    backgroundColor: "#FFFFFF",
    borderTopWidth: 4,
    //borderBottomWidth: 4,
    borderColor: "#A0C6FF"
  },
  menubar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#A0C6FF"
  },
  checkbutton: {
    width: '40%',
    height: "30%",
    color: "#FFFFFF",
    fontSize: 24,
    borderWidth: 3,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderColor: "#A0C6FF"
  },
  loadingcontainer: {
      flex: 1
  }
});
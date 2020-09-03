import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import DropdownMenu from 'react-native-dropdown-menu';
import Custombutton from "./custombutton";
import CoronaData from "./CoronaMove/CCM";
/*
const fs = require('fs');

fs.readFile('./CoronaMove/CCM.json', 'utf8', (error, jsonFile) => {
    if (error) return console.log(error);
    console.log(jsonFile);

    const jsonData = JSON.parse(jsonFile);
    
    jsonData.forEach(element => {
      console.log(element);
    });
});
*/

export default class Listdata extends Component {
  state = {
    markers: [{
        title:"대한민국 대구광역시 북구 산격동 1327-15",
        time: "00:00",
        titlekey: "A_1",
        timekey: "A_2",
        backgroundColor: "#FFDFD8",
      },
      {
        title:"대한민국 대구광역시 북구 대현동 261-1",
        time: "01:00",
        titlekey: "A_3",
        timekey: "A_4",
        backgroundColor: "white",
      },
      {
        title:"대한민국 대구광역시 동구 신암1동 신암북로7길 36-25",
        time: "02:00",
        titlekey: "A_5",
        timekey: "A_6",
        backgroundColor: "#FFDFD8",
      },
      {
        title:"대한민국 대구광역시 중구 성내2동 87-2",
        time: "03:00",
        titlekey: "A_7",
        timekey: "A_8",
        backgroundColor: "white",
      },
      {
        title:"대한민국 대구광역시 신천3동 19-1",
        time: "04:00",
        titlekey: "A_9",
        timekey: "A_10",
        backgroundColor: "white",
      },
      {
        title:"대한민국 대구광역시 북구 산격동 1185-1",
        time: "05:00",
        titlekey: "A_11",
        timekey: "A_12",
        backgroundColor: "#FFDFD8",
      },
      {
        title:"대한민국 대구광역시 동구 신암4동 294-3",
        time: "06:00",
        titlekey: "A_13",
        timekey: "A_14",
        backgroundColor: "white",
      },
      {
        title:"대한민국 대구광역시 북구 복현동 539-86",
        time: "07:00",
        titlekey: "A_15",
        timekey: "A_16",
        backgroundColor: "white",
      },
      {
        title:"대한민국 대구광역시 북구 칠성동2가 302-155",
        time: "08:00",
        titlekey: "A_17",
        timekey: "A_18",
        backgroundColor: "white",
      },
      {
        title:"대한민국 대구광역시 중구 북성로2가 19-3",
        time: "09:00",
        titlekey: "A_19",
        timekey: "A_20",
        backgroundColor: "#FFDFD8",
      },
      {
        title:"대한민국 대구광역시 동구 신암4동 578-3",
        time: "10:00",
        titlekey: "A_21",
        timekey: "A_22",
        backgroundColor: "white",
      },
      {
        title:"대한민국 대구광역시 동구 신천4동 386-2",
        time: "11:00",
        titlekey: "A_23",
        timekey: "A_24",
        backgroundColor: "white",
      }],
    markersize: 2,
    text: '',
    temp: true
  };
  _getCoronaData = async() => {
    CoronaData.map((item, index) => {
      if (index != 0) {
        this.setState((nowstate)=>({
          markers: [
            ...nowstate.markers,
            {
              title: item.address,
              time: item.exposed_date,
              titlekey: `A_${index * 2 + 25}`,
              timekey: `A_${index * 2 + 26}`,
              backgroundColor: "white",
            }
          ]
        }))
      }
    })
  };
  get_Today = () => {
    var today = new Date();
    this.setState({
      text: this.date_to_String(today),
      temp: false
    })
  }
  date_to_String = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
  componentDidMount() {
    this._getCoronaData();
    this.get_Today();
  };
  constructor(props) {
    super(props)
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
          handler={(selection, row) => this.setState({
            text: data[selection][row], 
            temp: false 
          })}
          data={data}
        >
            <View style={styles.container}>
              <ScrollView style={styles.Scrollcontainer} maxHeight={1000}>
                  { this.state.markers.map((marker, index)=>{
                    return (
                        <View style={[styles.listlayout, {backgroundColor: marker.backgroundColor}]} key={index}>
                            <View style={styles.texttitlelayout} key={marker.titlekey}>
                              <Custombutton
                                fontSize={25}
                                title={marker.title.length >= 30 ? marker.title.substring(0,30) + "..." : marker.title}
                                alignItems="flex-start"
                                buttonColor={marker.backgroundColor}
                                onPress={() => {Alert.alert("Alert", marker.title), this.props.navigation.navigate("List_mapScreen",{address: marker.title, time:marker.time})}}
                              />
                            </View>
                            <Text style={styles.texttimelayout} key={marker.timekey}>
                              {marker.time}
                            </Text>
                        </View>
                    )
                  })}
              </ScrollView>
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
    backgroundColor: "#48FFFF",
    borderTopWidth: 2,
    borderColor: "#FFCCFF"
  },
  Scrollcontainer: {
      flex: 1,
  },
  listlayout: {
    width: "100%",
    height: 70,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    flexDirection: 'row',
    marginTop: 1,
    marginBottom: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#A0C6FF"
  },
  texttitlelayout: {
    color: "black",
    marginLeft: 15,
    fontSize: 10,
    width: "75%",
    borderRightWidth: 1,
    borderColor: "#2c2c2c"
  },
  texttimelayout: {
    color: "black",
    marginRight:30,
    fontSize: 15,
  },
});
import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class custombutton extends Component{
  static defaultProps = {
    title: 'untitled',
    buttonColor: 'white',
    titleColor: 'black',
    fontSize: 15,
    alignItems: "center",
    onPress: () => null,
  }

  constructor(props){
    super(props);
  }

  render(){
    return (
      <TouchableOpacity style={[
        styles.button,
        {
          backgroundColor: this.props.buttonColor,
          alignItems: this.props.alignItems
        }
      ]}
      onPress={this.props.onPress}>
        <Text style={
          {
            color: this.props.titleColor,
            fontSize: this.props.fontSize
          }
        }>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}

custombutton.propTypes = {
  title: PropTypes.string.isRequired,
  buttonColor: PropTypes.string.isRequired,
  titleColor: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  alignItems: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
  },
});
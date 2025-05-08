import { Text, View } from 'react-native'
import React, { Component } from 'react'
import SSocket from 'servisofts-socket'





export default class testjuampy extends Component {

  componentDidMount() {
        SSocket.sendPromise({
          component:"company",
          type: "getAll",
      })
  }
  
  render() {
    return (
      <View>
        <Text>testjuampy</Text>
      </View>
    )
  }
}
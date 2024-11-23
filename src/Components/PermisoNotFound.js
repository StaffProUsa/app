import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SPage, SText } from 'servisofts-component';

export default class PermisoNotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <SPage center disableScroll>
        <SText>{"No tienes permisos"}</SText>
    </SPage>
  }
}

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SPage } from 'servisofts-component';
import { MenuPages } from 'servisofts-rn-roles_permisos';

export default class admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <SPage title={"Notification"}>
        <MenuPages path='/notification/' permiso='ver'>

        </MenuPages>
    </SPage>
  }
}

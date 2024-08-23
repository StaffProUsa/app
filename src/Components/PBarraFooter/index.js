import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  SGradient,
  SHr,
  SIcon,
  SImage,
  SNavigation,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import Model from '../../Model';

class PBarraFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.page = SNavigation.getParam("page");
  }

  getItem({ key, title, icon, url, params }) {
    var color = STheme.color.primary;
    var isSelect = key == this.props.url;

    if (Model.usuario.Action.getKey()) {
      if (url == '/login') {
        title = 'PERFIL';
        url = '/perfil';
      }
    }
    return (
      <SView
        flex
        center
        height={70}
        onPress={() => {
          SNavigation.navigate(url, params);
        }}>
        <SView
          style={{
            width: 70
          }}
          center>
          {isSelect && <SView height={55} width={55} center style={{ position: "absolute", top:-5 }}>
            <SImage src={require('../../Assets/images/selectMenu.png')} />
          </SView>}
          <SHr height={5}></SHr>
          <SView height={23} colSquare center>
            <SIcon name={icon} fill={STheme.color.primary} />
          </SView>
          <SView height={2} />
          <SText fontSize={8} center color={color}>
            {title}
          </SText>
          <SHr height={10}></SHr>
        </SView>
      </SView>
    );
  }
  render() {
    return (
      <>
        <SView
          col={'xs-12'} center>
          <SView
            col={'xs-11'}
            height={65}
            style={{
              position: 'absolute',
              bottom: 15,
              backgroundColor: STheme.color.secondary,
              borderRadius: 16,
              overflow: 'hidden',
            }}>

            <SView col={'xs-12'} row backgroundColor={STheme.color.secondary} center>
              {this.getItem({
                key: '/',
                title: 'INICIO',
                icon: 'Inicio',
                url: '/inicio',
                params: {}
              })}
              {this.getItem({
                key: '/entradas',
                title: 'TRABAJO',
                icon: 'trabajo',
                url: '/entradas',
                params: {}
              })}
               {this.getItem({
                key: '/calendario',
                title: 'CALENDARIO',
                icon: 'icalendario',
                url: '/calendario',
                params: {}
              })}
              {/* {this.getItem({ key: "reservas", title: 'RESERVAS', icon: 'Reservas', url: 'reservas', params: {} })} */}
              {this.getItem({
                key: '/login',
                title: 'LOGIN',
                icon: 'User',
                url: '/login',
                params: {}
              })}
            </SView>


          </SView>
        </SView>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(PBarraFooter);

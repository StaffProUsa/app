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

  getItem({ key, title, title_en, icon, url, params }) {
    var color = STheme.color.white;
    var isSelect = key == this.props.url;

    if (Model.usuario.Action.getKey()) {
      if (url == '/login') {
        title = 'PERFIL';
        title_en = 'PROFILE';
        url = '/perfil';
      }
    }
    return (
      <SView
        flex
        center
        height={40}
        onPress={() => {
          SNavigation.navigate(url, params);
        }}>
        <SView
          style={{
            width: 40,
            backgroundColor: isSelect ? STheme.color.card : "transparent",
            borderRadius: 4,
          }}
          center>
          {/* {isSelect && <SView height={40} width={40} center style={{ position: "absolute", top: -5 }}>
            <SImage src={require('../../Assets/images/selectMenu.png')} style={{
              borderWidth: 1,
              borderColor: STheme.color.white,
              borderRadius: 100,
            }} />
          </SView>} */}
          <SHr height={5}></SHr>
          <SView height={23} colSquare center>
            <SIcon name={icon} fill={STheme.color.white} />
          </SView>
          <SView height={2} />
          {/* <SText fontSize={8} center color={color}> 
            {title}
          </SText> */}
          <SText language={{
            es: title,
            en: title_en
          }} fontSize={7.5} center color={color} />
          {/* <SHr height={10}></SHr> */}
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
            height={45}
            style={{
              position: 'absolute',
              bottom: 15,
              backgroundColor: STheme.color.secondary + "CC",
              borderRadius: 16,
              overflow: 'hidden',
            }}>

            <SView col={'xs-12'} flex row center>
              {this.getItem({
                key: '/',
                title: 'INICIO',
                title_en: 'HOME',
                icon: 'Inicio',
                url: '/inicio',
                params: {}
              })}
              {this.getItem({
                key: '/event_in_progress',
                title: 'ASISTENCIA',
                title_en: 'ASSIST',
                icon: 'asiste',
                url: '/event_in_progress',
                params: {}
              })}
              {this.getItem({
                key: '/company',
                title: 'COMPAÑIAS',
                title_en: 'COMPANIES',
                icon: 'company',
                url: '/company',
                params: {}
              })}
              {/* {this.getItem({
                key: '/history',
                title: 'HISTORIAL',
                title_en: 'HISTORY',
                icon: 'history',
                url: '/history',
                params: {}
              })} */}
              {/* {this.getItem({ key: "reservas", title: 'RESERVAS', icon: 'Reservas', url: 'reservas', params: {} })} */}
              {this.getItem({
                key: '/login',
                title: 'LOGIN',
                title_en: 'LOGIN',
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

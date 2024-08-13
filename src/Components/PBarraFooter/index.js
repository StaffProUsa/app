import React, {Component} from 'react';

import {connect} from 'react-redux';
import {
  SGradient,
  SHr,
  SIcon,
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

  getItem({key, title, icon, url, params}) {
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
        height={50}
        onPress={() => {
          SNavigation.navigate(url, params);
        }}>
        <SView
          style={{
            width: 80
          }}
          center>
          <SView
            height={5}
            col={'xs-12'}
            style={{
              backgroundColor: isSelect ? STheme.color.text : '',
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5
            }}></SView>
          <SHr height={10}></SHr>
          <SView height={23} colSquare center>
            <SIcon name={icon} fill={STheme.color.primary} />
          </SView>
          <SView height={2} />
          <SText fontSize={8} center color={color}>
            {title}
          </SText>
          <SHr height={10}></SHr>
          <SView
            height={5}
            col={'xs-12'}
            style={{
              backgroundColor: isSelect ? STheme.color.primary : '',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}></SView>
        </SView>
      </SView>
    );
  }
  render() {
    return (
      <>
        <SView
          col={'xs-12'}
          height={50}
          style={{
            position: 'absolute',
            bottom: 0
          }}>
          <SView height={6} col={'xs-12'} style={{}}>
            <SGradient
              colors={[STheme.color.barColor, STheme.color.barColor + '22']}
            />
          </SView>
          <SView col={'xs-12'} row backgroundColor={STheme.color.barColor}>
            {this.getItem({
              key: '/',
              title: 'INICIO',
              icon: 'Inicio',
              url: '/',
              params: {}
            })}
            {this.getItem({
              key: '/entradas',
              title: 'ENTRADAS',
              icon: 'Entradas',
              url: '/entradas',
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
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(PBarraFooter);

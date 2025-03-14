import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  SHr,
  SIcon,
  SImage,
  SNavigation,
  SPage,
  STheme,
  SThread,
  SView
} from 'servisofts-component';
import Model from '../Model';
// import usuario from '../Services/Usuario/Components/usuario';

class Carga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 500,
      end:false
    };
    this.ruta = SNavigation.getParam('ruta');
    console.log(this.ruta);
  }

  redirect() {
    const key_usuario = Model.usuario.Action.getKey();
    if(!key_usuario){
      SNavigation.replace('/login');
      return;
    }
    SNavigation.replace('/inicio');
  }
  componentDidMount() {
    this.hilo();
  }
  hilo() {
    new SThread(this.state.delay, 'cargaHilo', true).start(() => {
      this.redirect();
    });
  }
  render() {
    return (
      <SPage hidden disableScroll center>
        <SHr height={52} />
        <SView col={'xs-9 sm-7 md-5 lg-4 xl-3'} height={100}
          style={{
            zIndex: 9999,
            position: "relative",
        }}
        >
          <SIcon name={'Logo'} fill={STheme.color.text} />
        </SView>
        <SHr height={32} />
        {/* <SView col={"xs-8 sm-6 md-4 lg-3 xl-2"} height={200}>
                    <SIcon name={"tuvidaesmejor"} />
                </SView> */}
        <SHr height={32} />
        {STheme.getTheme() == 'dark' ? <SImage src={require('../Assets/images/carga.jpg')} style={{ resizeMode: "cover", zIndex: 9, position: "absolute" }} /> : 
        <SImage src={require('../Assets/images/carga2.jpg')} style={{ resizeMode: "cover", zIndex: 9, position: "absolute" }} />}
        
      </SPage>
    );
  }
}

export default (Carga);

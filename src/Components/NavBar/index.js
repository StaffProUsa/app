import React, { Component } from 'react'
import { SIcon, SNavigation, SText, STheme, SView, SLanguage, SPagePropsType } from 'servisofts-component'
import RContent from './RContent';
import { SPopup } from 'servisofts-component';
import BoxLanguages from '../Popups/BoxLanguages';
import SSocket from 'servisofts-socket';
import Model from '../../Model';

export default class NavBar extends React.Component<SPagePropsType> {
  constructor(props) {
    super(props);
    this.state = {}
  }

  verificarImagen = async () => {
    const key_usuario = Model.usuario.Action.getKey();
    try {
      const response = await fetch(`${SSocket.api.root}usuario/${key_usuario}`);

      if (response.ok) {
        // Imagen existe → validar si hay staff tipo
        this.getStaffTipoFavorito();

      } else {
        // Imagen NO existe → redirigir a Subir Foto
        SNavigation.replace('/registro/foto');
      }
    } catch (error) {
      console.log('Error al verificar la imagen:', error);
      SNavigation.replace('/registro/foto'); // Por si hay error de red también lo llevamos a subir foto
    }
  };

  getStaffTipoFavorito() {
    SSocket.sendPromise({
      component: "staff_tipo_favorito",
      type: "getAll",
      key_usuario: Model.usuario.Action.getKey()
    }).then(e => {
      this.setState({ StaffTipoFavorito: e.data })

      if (e.data && Object.keys(e.data).length === 0) {
        SNavigation.navigate("/perfil/staff_tipo")
      }
    }).catch(e => {
      console.error(e);
    })

  }

  componentDidMount() {
    this.verificarImagen();
  }


  btnBack() {
    if (this.props.preventBack) return;
    if (!SNavigation.isBack()) return;
    return <SView col={"xs-12"} height style={{
      justifyContent: 'center',
    }}>
      <SView onPress={() => {
        SNavigation.goBack(this.props.backAlternative);
      }} style={{
        maxWidth: 35,
      }} center height>
        <SIcon width={25} height={25} name={"Arrow"} fill={STheme.color.text} />
      </SView>
    </SView>
  }
  render() {
    return (
      <SView col={"xs-12"} height={40} backgroundColor={STheme.color.barColor} style={{
        overflow: "hidden"
      }}>
        <SView col={"xs-12"} height row>
          <SView width={90}>
            {this.btnBack()}
          </SView>
          <SView flex center>
            <SText language={this.props?.titleLanguage}>{this.props?.title}</SText>
          </SView>
          <SView width={90} heiht center
            onPress={() => {
              // SNavigation.reset("/");
              SPopup.open({ key: "menuLat", content: <BoxLanguages datas={this.props?.data} /> });
            }}
          >
            <RContent />
          </SView>
        </SView>
      </SView >
    )
  }
}
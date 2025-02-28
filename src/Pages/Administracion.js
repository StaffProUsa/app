import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SIcon, SPage } from 'servisofts-component';
import Pages from '.';
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos';
import Model from '../Model';
import PBarraFooter from '../Components/PBarraFooter';

class Administracion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const UsuaioPage = Pages['usuarioPage/lista'];
    return (
      <SPage title={'Administración'} onRefresh={(e) => {

        if (e) e()
        Model.usuarioPage.Action.CLEAR()
      }}
        footer={<PBarraFooter url={'/login'} />}
      >
        <SHr />
        <MenuPages path='' permiso='page' >
        </MenuPages>
        {/* <SHr /> */}
        {/* <MenuPages path=''   >
          <MenuButtom label={"Reportes"} url={"/reportes"} icon={<SIcon name={"Excel"} />} />
        </MenuPages> */}
        {/* <MenuPages path={"/"} permiso='page' >
        </MenuPages> */}
        {/* <UsuaioPage /> */}

        {/* <SText>Administracion</SText> */}
      </SPage>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Administracion);

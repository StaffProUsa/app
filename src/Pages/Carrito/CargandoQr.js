import React from 'react';
import { connect } from 'react-redux';
import { SNavigation, SNotification, SPage, STheme, SThread, SView } from 'servisofts-component';
import LogoCargando from '../../Components/LogoCargando';
import venta from '../../Services/Casagrandeadmin/Components/venta';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import Model from '../../Model';

class CargandoQr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = SNavigation.getParam('data');
  }

  componentDidMount() {
    console.log(this.data);
    // let usr_log = Model.usuario.Action.getUsuarioLog();

    Model.usuario.Action.editar({
      data: {
        key: this.data.key_usuario,
        Telefono: this.data.telefono,
        Correo: this.data.correo,
        estado: 1,
        // CI: this.data.nit,
      }
    }).then(e => {
      if (Model.usuario.Action.getKey() == this.data.key_usuario) {
        Model.usuario.Action.syncUserLog();
      }
    })


    venta.Actions.registro(this.data, this.props)
      .then((resp) => {
        console.log('la venta', resp.estado);
        carrito.Actions.removeAll(this.props);
        SNavigation.reset("/");
        new SThread(100, "asda", false).start(() => {
          SNavigation.replace('entradas');
          new SThread(500, "otro", false).start(() => {
            SNavigation.navigate('/venta', { key: resp.data.key });
          })
        })

      })
      .catch((e) => {
        SNavigation.goBack();
        SNotification.send({
          title: "Eroor",
          body: e?.error,
          color: STheme.color.danger,
          time: 5000,
        })
        // SNavigation.replace('errorqr');
      });
  }

  render() {
    return (
      <>
        <SPage hidden disableScroll>
          <SView col={'xs-12'} flex center>
            <LogoCargando />
          </SView>
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(CargandoQr);

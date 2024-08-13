import React from 'react';
import { connect } from 'react-redux';
import {
  SHr,
  SIcon,
  SImage,
  SLoad,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import ImgSaveGallery from '../../Components/ImgSaveGallery';
import ImgShared from '../../Components/ImgShared';
import venta from '../../Services/Casagrandeadmin/Components/venta';
import orden_pago from '../../Services/Casagrandeadmin/Components/orden_pago';
import VerificarOrden from '../../Components/Orden';
// import parametro from '../../Services/Casagrandeadmin/Components/parametro';
import ContadorTiempo from './Components/ContadorTiempo';
import { SStorage } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';

// import {
//   FacebookShareButton,
//   WhatsappShareButton,
//   WhatsappIcon,
//   FacebookIcon
// } from 'react-share';

// import Carrito from '../Components/Carrito';
// import PButtomFooter from '../../../../../Components/PButtomFooter';

//todo cuando esto es pago qr, al volver atras, llevar al inicio si o si

class Qr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.name = SNavigation.getParam('nombre');
    this.nit = SNavigation.getParam('nit');
    this.key_venta = SNavigation.getParam('key');
  }

  componentDidMount() {

    // SSocket.sendPromise({
    //   component: "venta",
    //   type: "pago_qr",
    //   key_usuario: Model.usuario.Action.getKey(),
    //   key_venta: this.key_venta,
    //   descripcion: "Pago por compra en app.",
    //   razon_social: "S/N",
    //   nit: "S/N",
    //   monto: 1,
    //   correos: []
    // }).then(e => {
    //   this.setState({ qr: e?.data?.qrImage })
    // }).catch(e => {

    // })
  }
  convertBase64ToBlob() {
    let base64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    // 'data:application/pdf,base64JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nD2OywoCMQxF9/mKu3YRk7bptDAIDuh+oOAP+AAXgrOZ37etjmSTe3ISIljpDYGwwrKxRwrKGcsNlx1e31mt5UFTIYucMFiqcrlif1ZobP0do6g48eIPKE+ydk6aM0roJG/RegwcNhDr5tChd+z+miTJnWqoT/3oUabOToVmmvEBy5IoCgplbmRzdH0KPj4Kc3RhcnR4cmVmCjEyNzg3CiUlRU9GCg==';

    // const blob = new Blob([base64], {type: 'audio/mp3'}); // siempre [ file ] and el type
    // const blob = new Blob([base64], {type: 'image/png'}); // siempre [ file ] and el type
    const blob = new Blob([base64], { type: 'image/jpeg' }); // siempre [ file ] and el type
    // const blob = new Blob([base64], {type: 'text/html'}); // siempre [ file ] and el type
    // const blob = new Blob([base64], {type: 'application/pdf'}); // siempre [ file ] and el type
    console.log('convertBase64ToBlob blob ', blob);
  }

  async pedirQR() {
    if (this.state.loading) return;
    this.state.loading = true;
    this.setState({ ...this.state });
    venta.Actions.pago_qr(this.key_venta, this.props).then((resp) => {
      console.log("ecito")
      console.log(resp);
      this.state.loading = false;
      this.setState({ ...this.state });

      //limpiar localstorage detalle carrito
      SStorage.removeItem('carritoReducer'); //datos carrito
      //carrito.Actions.removeEvento(obj.key, this.props);

    }).catch((e) => {
      this.state.loading = false;
      this.setState({ ...this.state });
    })
  }

  getQR() {
    if (!this.state.qr) return <SLoad />;
    return <SView col={'xs-12'} height={300} border={'transparent'} center>
      <SImage
        src={"data:image/jpeg;base64,"+this.state.qr}
      />
    </SView>
  }

  findQR(data_orden) {
    if (!data_orden) return null;
    let arr_ordenes = Object.values(data_orden).filter(o => o.type == "QR");
    if (arr_ordenes.length > 0) {
      const order_actual = arr_ordenes[0];
      this.state.qr = order_actual?.data?.image_data;
      return this.state.qr;
    } else {
      this.pedirQR();
      return null;
    }
  }
  render() {
    const data = venta.Actions.getByKey(this.key_venta, this.props);
    const data_orden = orden_pago.Actions.getAll(this.key_venta, this.props);

    if (!data) return <SLoad />;


    return (
      <>
        <SPage center disableScroll>
          <VerificarOrden key_venta={this.key_venta} />

          <SView flex center col={'xs-11 sm-10 md-8 lg-6 xl-4'}>
            <SView col={'xs-12'} center row flex border={'transparent'}>
              <SView col={'xs-12'} border={'transparent'}>
                <SText fontSize={14} center>
                  Escanee el código QR a continuación en su aplicación BANCA
                  MÓVIL para completar el pago.
                </SText>
                <SHr height={20} />
                <SView col={'xs-12'} row center>
                  {/* <SText fontSize={14} center>Bs.</SText> */}
                  <SText fontSize={40} center>
                    {' '}
                    {`Bs. ${data.total.toFixed(2)}`}
                    {/* {`total Bs. ${data.total}`} */}
                  </SText>
                </SView>
              </SView>
              <SHr height={20} />
              {this.getQR()}
              <SHr height={40} />
              <SView
                col={'xs-11'}
                row
                center
                height={50}
                border={'transparent'}
                style={{ bottom: 20 }}>
                <SView col={'xs-12'} border={'transparent'} center row>
                  <SView
                    backgroundColor={STheme.color.white}
                    center
                    width={50}
                    height={50}
                    style={{
                      borderWidth: 1,
                      borderColor: STheme.color.primary,
                      borderRadius: 8
                    }}
                    onPress={() => {
                      ImgSaveGallery.guardar(qr);
                    }}>
                    <SIcon
                      name='Descargar'
                      width={30}
                      fill={STheme.color.black}
                    />
                  </SView>
                  <SView width={50} />
                  <SView
                    backgroundColor={STheme.color.white}
                    center
                    width={50}
                    height={50}
                    style={{
                      borderWidth: 1,
                      borderColor: STheme.color.primary,
                      borderRadius: 8
                    }}
                    onPress={() => {
                      ImgShared.compartir(qr);
                    }}>
                    <SIcon
                      name={'Compartir'}
                      width={33}
                      fill={STheme.color.black}
                    />
                  </SView>

                </SView>
              </SView>
              <SHr height={20} />
              <ContadorTiempo key_venta={this.key_venta} />

              <SHr height={20} />
              {/* <SView
                center
                row
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: STheme.color.primary
                }}
                onPress={() => {
                  SNavigation.navigate('billetera/pagoTarjeta', {
                    key_venta: this.key_venta
                  });
                }}>
                <SText fontSize={13}>
                  O cancela por tarjera de crédito/débito
                </SText>
                <SView width={30} height={30} border={this.bgborder} center>
                  <SImage
                    src={require('../../Assets/images/tarjeta1.png')}
                    style={{ width: 25 }}
                  />
                </SView>
                <SView width={30} height={30} border={this.bgborder} center>
                  <SImage
                    src={require('../../Assets/images/tarjeta2.png')}
                    style={{ width: 25 }}
                  />
                </SView>
              </SView> */}
            </SView>
          </SView>
        </SPage>
        {/* <PButtomFooter primary fontSize={24} onPress={() => {
          SNavigation.navigate("carrito/confirmar");
        }}>CONFIRMAR PAGO</PButtomFooter> */}
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Qr);

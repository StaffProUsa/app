import React from 'react';
import {connect} from 'react-redux';
import {
  SDate,
  SHr,
  SIcon,
  SImage,
  SList,
  SLoad,
  SNavigation,
  SPage,
  SScrollView2,
  SText,
  STheme,
  SView
} from 'servisofts-component';

import PBarraFooter from '../Components/PBarraFooter';
import SSocket from 'servisofts-socket';
import actividad from '../Services/Casagrandeadmin/Components/actividad';
import evento from '../Services/Casagrandeadmin/Components/evento';
import banner from '../Services/Casagrandeadmin/Components/banner';
import venta from '../Services/Casagrandeadmin/Components/venta';
import tipo_entrada from '../Services/Casagrandeadmin/Components/tipo_entrada';
import sector from '../Services/Casagrandeadmin/Components/sector';
import PFecha from '../Components/PFecha';

const generateQr = 'aG9sYSBtdW5kbw';

class Entradas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {foto_id: 0};
  }

  getCompras() {
    var data = venta.Actions.getByKeyUsuario(
      this.props.state.usuarioReducer.usuarioLog.key,
      this.props
    );
    if (!data) return <SLoad />;

    return Object.keys(data).map((key, index) => {
      var obj = data[key];

      return (
        <>
          <SView
            col={'xs-11'}
            backgroundColor={STheme.color.card}
            style={{borderRadius: 16}}
            center>
            <SView
              col={'xs-12'}
              height
              border={'transparent'}
              center
              style={{
                alignItems: 'flex-end',
                position: 'absolute'
              }}>
              <SView width={80} height={100} style={{right: 20}}>
                <SImage src={require('../Assets/images/qr.png')} />
              </SView>
            </SView>

            {/* <PFecha
              style={{width: '10'}}
              width={'10'}
              dia={new SDate(obj.fecha).toString('dd')}
              mes={new SDate(obj.fecha).toString('MONTH')}
              backgroundColor={STheme.color.secondary}
              position='top'
              spacing={20}
            /> */}

            <SView col={'xs-11.5'}>
              <SHr height={16} color={this.bgSpace} />

              <SHr height={4} color={this.bgSpace} />
              <SView col={'xs-12'} row center>
                {this.getComprasDetalle(obj.detalle)}
                {/* {this.getCompraTest()} */}
                {/* {this.getCompraTest(obj.detalle)} */}
                <SHr height={16} color={this.bgSpace} />
                <SView col={'xs-12'} row>
                  <SView flex border={this.bgborder} row>
                    <SText
                      col={'xs-12'}
                      color={STheme.color.text}
                      font={'Roboto'}
                      fontSize={14}>
                      Total pagado Bs {obj.total.toFixed(2)}
                    </SText>
                    <SText
                      col={'xs-12'}
                      color={STheme.color.text}
                      font={'Roboto'}
                      fontSize={14}>
                      fecha {new SDate(obj.fecha_on).toString('dd MONTH yyyy')}
                    </SText>
                    <SText
                      col={'xs-12'}
                      color={STheme.color.text}
                      font={'Roboto'}
                      fontSize={14}>
                      keyVenta {obj.key}
                    </SText>
                  </SView>
                </SView>
                <SHr height={34} color={this.bgSpace} />
              </SView>
            </SView>
          </SView>
          <SHr height={34} color={this.bgSpace} />
        </>
      );
    });
  }

  getComprasDetalle(data) {
    var hola = evento.Actions.getAll(this.props);
    if (!hola) return <SLoad />;
    
    //metodo formateo
    //metodo recorrido
    return Object.keys(data).map((key, index) => {
      var obj = data[key];

      // const conjunto = new Set(obj);
      // const unicos = [...conjunto];
      // console.log("unicos ",unicos);

      var getData = '';

      if (obj.tipo == 'entrada') {
        getData = tipo_entrada.Actions.getByKey(obj.key_item, this.props);
      } else if (obj.tipo == 'sector') {
        getData = sector.Actions.getByKey(obj.key_item, this.props);
        if (!sector) return <SLoad />;
      }

      if (!getData) return;
      const dataEvento = evento.Actions.getByKey(
        getData.key_evento,
        this.props
      );

      return (
        <SView col={'xs-12 '} border={'transparent'}>
          <SText
            fontSize={18}
            font={'Roboto'}
            color={STheme.color.text}
            border={'transparent'}>
            Evento {dataEvento.descripcion}
          </SText>

          <SText
            fontSize={18}
            font={'Roboto'}
            color={STheme.color.text}
            border={'transparent'}>
            {obj.tipo == 'entrada'
              ? this.getEntrada(obj.key_item)
              : this.getSector(obj.key_item)}{' '}
          </SText>
        </SView>
      );
    });
  }

  getEntrada(key_item) {
    var data = tipo_entrada.Actions.getByKey(key_item, this.props);
    if (!data) return <SLoad />;

    return (
      <>
        <SView col={'xs-12'} height={20} row>
          <SView
            flex
            border={this.bgborder}
            style={{alignItems: 'flex-start'}}
            center>
            <SView row border={this.bgborder}>
              <SIcon name={'Ticket'} fill={STheme.color.text} width={14} />
              <SView width={5} />
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={12}>
                {data.descripcion} {data.cantidad} x {data.precio.toFixed(2)} Bs
              </SText>
            </SView>
          </SView>
        </SView>
      </>
    );
  }

  getSector(key_item) {
    var data = sector.Actions.getByKey(key_item, this.props);
    if (!data) return <SLoad />;
    return (
      <>
        <SView col={'xs-12'} height={20} row>
          <SView
            flex
            border={this.bgborder}
            style={{alignItems: 'flex-start'}}
            center>
            <SView row border={this.bgborder}>
              <SIcon name={'Group'} fill={STheme.color.text} width={14} />
              <SView width={5} />
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={12}>
                {data.descripcion} {data.cantidad} x {data.precio.toFixed(2)} Bs
              </SText>
            </SView>
          </SView>
        </SView>
      </>
    );
  }

  getCompraTest() {
    var data = venta.Actions.getByKeyUsuario(
      this.props.state.usuarioReducer.usuarioLog.key,
      this.props
    );

    const getData = venta.Actions.getVenta(this.props);
    if (!getData) return <SLoad />;
    if (!data) return <SLoad />;
    console.log(' todo ', getData);
    return console.log(' por usuario ', data);
    //liceth aqui te dejo para imprimir el objeto
  }

  render() {
    return (
      <>
        <SPage title={'ENTRADAS'}>
          <SView col={'xs-12'} center>
            <SView
              col={'xs-12 sm-12 md-12 lg-8 xl-6'}
              row
              center
              border={'transparent'}>
              <SHr height={27} color={this.bgSpace} />
              {this.getCompras()}
              <SHr height={27} color={this.bgSpace} />
            </SView>
          </SView>
          <SHr height={150} color={'transparent'} />
        </SPage>
        <PBarraFooter url={'entradas'} />
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Entradas);

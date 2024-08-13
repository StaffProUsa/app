import React from 'react';
import {connect} from 'react-redux';
import {
  SDate,
  SHr,
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

class TestAlvaro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {foto_id: 0};
  }

  getEventos12() {
    var DATA = evento.Actions.getAll(this.props);
    if (!DATA) return <SLoad />;

    return Object.keys(DATA).map((key) => {
      return <>{this.getContenido12({key: DATA[key].key})}</>;
    });
  }

  getContenido12({key}) {
    var data_actividad = actividad.Actions.getByKeyEvento(key, this.props);
    if (!data_actividad) return <SLoad />;
    return (
      <>
        <SView col={'xs-12'} center>
          <SView
            width={100}
            height={100}
            onPress={() => {
              SNavigation.navigate('evento/perfil', {key: key});
            }}>
            <SImage
              src={SSocket.api.root + 'actividad/' + data_actividad[0]?.key}
              style={{
                width: '100%',
                position: 'relative',
                borderRadius: 8,
                resizeMode: 'cover'
              }}
            />
          </SView>
        </SView>
        <SHr height={30}></SHr>
      </>
    );
  }

  getEventos() {
    const DATA = evento.Actions.getAll(this.props);
    if (!DATA) return <SLoad />;
    return (
      <SView col={'xs-12'} height={260} border={'transparent'}>
        <SScrollView2>
          <SList
            data={DATA}
            space={20}
            horizontal={true}
            render={(obj) => {
              return <>{this.getContenido({key: obj.key})}</>;
            }}
          />
        </SScrollView2>
      </SView>
    );
  }

  getContenido({key}) {
    var data_actividad = actividad.Actions.getByKeyEvento(key, this.props);
    if (!data_actividad) return <SLoad />;
    return (
      <>
        <SView
          width={250}
          height={250}
          onPress={() => {
            SNavigation.navigate('evento/perfil', {key: key});
          }}>
          <SImage
            src={SSocket.api.root + 'actividad/' + data_actividad[0]?.key}
            style={{
              width: '100%',
              position: 'relative',
              borderRadius: 8,
              resizeMode: 'cover'
            }}
          />
        </SView>
      </>
    );
  }

  getPublicidad() {
    const dataPublicidad = banner.Actions.getAll(this.props);
    if (!dataPublicidad) return <SLoad />;
    return (
      <>
        <SView col={'xs-12  '} height={110} border={'transparent'}>
          <SScrollView2>
            <SList
              data={dataPublicidad}
              space={20}
              horizontal={true}
              render={(obj) => {
                return (
                  <SView width={100} height={100}>
                    <SImage
                      src={SSocket.api.root + 'banner/' + obj.key}
                      border={'blue'}
                      style={{
                        width: '100%',
                        position: 'relative',
                        resizeMode: 'cover',
                        borderRadius: 8
                      }}
                    />
                  </SView>
                );
              }}
            />
          </SScrollView2>
        </SView>
      </>
    );
  }
  getCompras() {
    var dataVenta = venta.Actions.getAll(this.props);

    if (!dataVenta) return <SLoad />;

    console.log('aqui ', JSON.stringify(dataVenta));
    return (
      <>
        <SView col={'xs-12  '} height={500} border={'transparent'}>
          {/* <SScrollView2> */}
            <SList
              data={dataVenta}
              space={20}
              horizontal={true}
              render={(obj) => {
                return (
                  <SView
                    col={'xs-12 '}
                    height={120}
                    row
                    center
                    border={STheme.color.card}
                    style={{borderRadius: 8}}
                    // onPress={() => {
                    //   if (obj.state == "pagado") {
                    //     if (obj.delivery == 0) {
                    //       SNavigation.navigate("pedido/usuario/pagado", { key_pedido: obj.key })
                    //     }
                    //     if (obj.delivery != 0) {
                    //       SNavigation.navigate("pedido/delivery/pagado", { key_pedido: obj.key })
                    //     }
                    //   }
                    //   if (obj.state == "no_recogido") {
                    //     SNavigation.navigate("pedido/noRecogido", { key_pedido: obj.key });
                    //   }
                    // }}
                  >
                    <SView col={'xs-12'} row center border={'transparent'}>
                      {/* <SView col={"xs-2"} center border={"transparent"}  >
                      <SView height={40} width={40} style={{ backgroundColor: '#E9EAEE', borderRadius: 50, }} center   >
                        <SImage src={SSocket.api.root + 'actividad/' + data_actividad[0]?.key} style={{ borderRadius: 8, resizeMode: 'cover' }} />
                      </SView>
                    </SView> */}
                      <SView col={'xs-5'} border={'transparent'} style={{}}>
                        <SText
                          fontSize={16}
                          font={'Roboto'}
                          color={STheme.color.text}>
                          {obj?.evento?.descripcion}
                        </SText>
                        <SText
                          fontSize={12}
                          font={'Roboto'}
                          color={STheme.color.text}>
                          {new SDate(obj.fecha_on, 'yyyy-MM-dd').toString(
                            'dd de MONTH'
                          )}{' '}
                        </SText>
                        <SView height={8} />
                        {/* <SText fontSize={12} font={"Roboto"} color={STheme.color.primary} bold >{pedido.Actions.getDetalleEstado(obj)}</SText> */}
                      </SView>
                      <SHr height={1} color={STheme.color.primary} />
                      <SView
                        // col={'xs-10'}
                        // height={500}
                        row
                        // backgroundColor={'cyan'}
                        center
                        style={{alignContent: 'center'}}>
                        {this.getComprasDetalle(obj.detalle)}
                      </SView>
                      <SHr height={1} color={STheme.color.primary} />

                      <SView
                        col={'xs-2'}
                        height={40}
                        row
                        center
                        style={{alignContent: 'center'}}>
                        <SText
                          fontSize={18}
                          font={'Roboto'}
                          color={STheme.color.gray}>
                          Monto total {obj?.total}
                        </SText>
                      </SView>
                    </SView>
                    <SView col={'xs-12'} center>
                      <SView col={'xs-11'} row center border={'transparent'}>
                        {/* {this.getBotones(obj)} */}
                      </SView>
                    </SView>
                  </SView>
                );
              }}
            />
          {/* </SScrollView2> */}
        </SView>
      </>
    );
  }

  getComprasDetalle(data) {
    return Object.keys(data).map((key, index) => {
      var obj = data[key];
      return (
        <SView col={'xs-12 '} border={'red'}>
          <SText fontSize={18} font={'Roboto'} color={STheme.color.text}>
          tipo {obj.tipo == 'entrada'
            ? this.getEntrada(obj.key_item)
            : this.getSector(obj.key_item)}  {obj.cantidad} x {obj.precio}
          </SText>
        
        </SView>
      );
    });
  }
  getEntrada(key_item) {
    var data = tipo_entrada.Actions.getByKey(key_item, this.props);
    if (!data) return <SLoad />;
      return data.descripcion; 
  }

 
  getSector(key_item) {
    var data = sector.Actions.getByKey(key_item, this.props);
    if (!data) return <SLoad />;
      return data.descripcion; 
  }

  //   var dataDetalle = venta.Actions.getAllDetalle(data.key_item, data.tipo ,this.props);

  //   if (!dataDetalle) return <SLoad />;

  //   console.log('aqui ', JSON.stringify(dataDetalle));

  //   return Object.keys(dataDetalle).map((key, index) => {
  //     var obj = dataDetalle[key];
  //     return (
  //       <SView col={'xs-12 '} border={'transparent'}>
  //         <SText> {JSON.stringify(obj) + '\n'} </SText>

  //         {/* <SText>
  //           {' '}
  //           Key {obj.key_item} tipo {obj.tipo} - cantidad {obj.precio} x{' '}
  //           {obj.precio} bs{' '}
  //         </SText> */}
  //       </SView>
  //     );
  //   });
  // }

  getCompraasassasaassas() {
    var dataVenta = venta.Actions.getAll(this.props);
    if (!dataVenta) return <SLoad />;

    console.log(JSON.stringify(dataVenta));
    return (
      <>
        <SView col={'xs-12  '} height={500} border={'transparent'}>
          <SScrollView2>
            <SList
              data={dataVenta}
              space={20}
              horizontal={true}
              render={(obj) => {
                return (
                  <SView width={300} height={500}>
                    <SText> {JSON.stringify(obj) + '\n'} </SText>
                  </SView>
                );
              }}
            />
          </SScrollView2>
        </SView>
      </>
    );
  }

  getTipoentrada() {
    var data = banner.Actions.getAll(this.props);
    if (!data) return <SLoad />;
    return Object.keys(data).map((key, index) => {
      var obj = data[key];
      return (
        <SView col={'xs-12 '} border={'transparent'}>
          <SText> {JSON.stringify(obj) + '\n'} </SText>
        </SView>
      );
    });
  }

  render() {
    return (
      <>
        <SPage height hidden>
          <SView col={'xs-12'} center>
            <SHr height={25} />
            <SText>ENTRADAS</SText>
            <SHr height={15} />
            {/* {this.getEventos()}
            <SHr height={20} />
            <SText>Banner</SText>
            <SHr height={15} />
            {this.getPublicidad()} */}
            {this.getCompras()}
          </SView>
          <SHr height={85} />
        </SPage>
        <PBarraFooter url={'entradas'} />
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(TestAlvaro);

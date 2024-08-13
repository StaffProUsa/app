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
  SView,
  SDate
} from 'servisofts-component';
import Carrito from '../../Components/Carrito';
import ContadorMasMenos from '../../Components/ContadorMasMenos';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import evento from '../../Services/Casagrandeadmin/Components/evento';
import sector from '../../Services/Casagrandeadmin/Components/sector';

class Reserva extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidad: 0
    };
    this.key = SNavigation.getParam('key');
  }

  getTipoSector() {
    const data = sector.Actions.getByKeyEvento(this.key, this.props);
    if (!data) return <SLoad />;
    return Object.keys(data).map((key, index) => {
      var obj = data[key];

      return (
        <>
          <SView col={'xs-12'} row center border={'transparent'}>
            <SView col={'xs-12'} row border={'transparent'} center>
              <SView col={'xs-1.5'}>
                <SView
                  width={22}
                  height={22}
                  backgroundColor={STheme.color.gray}
                  style={{ borderRadius: 5 }}></SView>
              </SView>
              <SView col={'xs-3'} border={'transparent'}>
                <SText fontSize={15}>{obj.descripcion}</SText>
              </SView>
              <SView col={'xs-3.5'} border={'transparent'}>
                <SText>{obj.precio} Bs.</SText>
              </SView>

              <ContadorMasMenos max={obj["cantidad"] ?? 0} defaultValue={carrito.Actions.getByKey(obj.key, this.props)
                ?.cantidad ?? 0} onChange={(val) => {
                  carrito.Actions.addToCard(
                    {
                      key: obj.key,
                      precio: obj.precio,
                      tipo: 'sector',
                      cantidad: val,
                      key_evento: this.key
                    },
                    this.props
                  );
                }} />

            </SView>
            <SHr height={15} />
          </SView>
        </>
      );
    });
  }

  getOptions() {
    return <SView col={'xs-5.5'} row>
      <SText fontSize={18}>Opciones</SText>
      <SHr height={15} />
      <SView col={'xs-12'} row>
        <SView col={'xs-2'}>
          <SView
            width={20}
            height={20}
            backgroundColor={STheme.color.white}
            style={{ borderRadius: 5 }}></SView>
        </SView>
        <SView col={'xs-10'}>
          <SText fontSize={15}>Disponible</SText>
        </SView>
      </SView>
      <SHr height={10} />
      <SView col={'xs-12'} row>
        <SView col={'xs-2'}>
          <SView
            center
            width={20}
            height={20}
            backgroundColor={STheme.color.white}
            style={{ borderRadius: 5 }}>
            <SIcon name={'Ocupado'} width={12} />
          </SView>
        </SView>
        <SView col={'xs-10'}>
          <SText fontSize={15}>Ocupado</SText>
        </SView>
      </SView>
      <SHr height={10} />
      <SView col={'xs-12'} row>
        <SView col={'xs-2'}>
          <SView
            center
            width={20}
            height={20}
            backgroundColor={STheme.color.white}
            style={{ borderRadius: 5 }}>
            <SIcon name={'Reservado'} width={14} />
          </SView>
        </SView>
        <SView col={'xs-10'}>
          <SText fontSize={15}>Reservado</SText>
        </SView>
      </SView>
    </SView>
  }
  render() {
    const data = evento.Actions.getByKey(this.key, this.props);
    if (!data) return <SLoad />;
    return (
      <>
        <SPage title={'Reservas'}>
          <SView col={'xs-12'} center>
            <SView
              col={'xs-12 sm-12 md-10 lg-8 xl-6'}
              row
              center
              backgroundColor={'transparent'}>
              <SHr height={20}></SHr>
              <SView
                col={'xs-11'}
                row
                backgroundColor={STheme.color.card}
                center
                style={{
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderTopWidth: 1,
                  borderTopColor: '#eeeeee'
                }}>
                <SHr height={20} />
                <SText fontSize={17}>HAZ TU RESERVA</SText>
                <SHr height={10} />
                <SView
                  col={'xs-9'}
                  height={2}
                  backgroundColor={STheme.color.primary}></SView>
                <SHr height={10} />
                <SText fontSize={26}>{data.descripcion}</SText>
                <SHr height={5} />
                <SText fontSize={13}>{new SDate(data.fecha).toString("DAY, dd de MONTH")}.</SText>
                <SHr height={10} />
              </SView>

              <SView col={'xs-12 md-11'}>
                <SView height={435}>
                  <SImage
                    src={require('../../Assets/images/mesas.jpg')}
                    style={{
                      // borderRadius: 30,
                      resizeMode: 'cover'
                    }}
                  />
                </SView>
              </SView>
              <SView col={'xs-12'} style={{ position: 'absolute', left: 0 }}>
                <SIcon name={'Zoom'} width={45} />
              </SView>

              <SView
                col={'xs-11'}
                row
                center
                backgroundColor={STheme.color.card}
                style={{
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eeeeee'
                }}>
                <SView col={'xs-11'}>
                  <SHr height={20} />
                  <SView col={'xs-12'} row>

                    {this.getTipoSector()}

                    <SHr />
                    {/* <SView col={'xs-0.5'}></SView> */}
                    {this.getOptions()}
                  </SView>
                  <SHr height={35} />
                </SView>
                <SView col={'xs-11'}></SView>
                <SHr height={15} />
              </SView>
            </SView>
          </SView>
          <SHr height={30} />
        </SPage>
        <Carrito style={{
          bottom: "50%"
        }} />
      </>
    );
  }
}

const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Reserva);

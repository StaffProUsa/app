import React from 'react';
import { connect } from 'react-redux';
import {
  SHr, SIcon, SImage, SLoad, SNavigation, SPage, SText, STheme, SView, SDate, SMath,
  SPopup
} from 'servisofts-component';
import CanvasPlanimetria from '../../Components/CanvasPlanimetria';
import Carrito from '../../Components/Carrito';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import mesa from '../../Services/Casagrandeadmin/Components/mesa';
import sector from '../../Services/Casagrandeadmin/Components/sector';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import PopupMesa from './Components/PopupMesa';
import usuarioPage from '../../Services/Roles_permisos/Components/usuarioPage';
import Model from '../../Model';

class Reserva extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidad: 0,
      marcadas: {}

    };
    this.key = SNavigation.getParam('key');
  }


  isInner(p, m) {
    return ((m.x <= p.x && m.x + m.w >= p.x) && (m.y <= p.y && m.y + m.h >= p.y))
  }

  getComprasDeMesa(key) {
    SPopup.open({
      key: "mesa_compra",
      content: <PopupMesa key_mesa={key} reasignar={(mesa_compra) => {
        this.state.mesa_compra_por_reasignar = mesa_compra
        SPopup.close("mesa_compra")
      }} />
    })

  }
  getCanvas() {
    var carrito_data = carrito.Actions.getAllSimple(this.props);
    if (!carrito_data) return <SLoad />
    var marcadas = {};
    carrito_data.filter(o => o.key_evento == this.key).map((ca) => {
      if (ca.mesas) {
        ca.mesas.map((mesa) => {
          marcadas[mesa.key] = mesa;
        })
      }
    })
    if (Object.keys(this.state.marcadas).length != Object.keys(marcadas).length) {
      this.setState({
        marcadas: marcadas,
      })
    }
    var mesas = mesa.Actions.getAllKeyEvento(this.key, this.props);
    const MESA = mesa;
    var sectores = sector.Actions.getByKeyEvento(this.key, this.props);

    const permiso_reasignar = Model.usuarioPage.Action.getPermiso({ url: "/ticket/reserva", permiso: "reasignar_mesa", });

    console.log(mesas)

    if (!mesas) return <SLoad />;
    if (!sectores) return <SLoad />;
    if (!Object.values(mesas).length) return <SText fontSize={18} bold>Evento sin reserva</SText>

    // if (this._ref_canvas) {
    //   this._ref_canvas.repaint();
    // }
    return <CanvasPlanimetria
      key_evento={this.key}
      onClick={(evt, ref) => {
        var p = { x: evt.offsetX, y: evt.offsetY }
        Object.values(mesas).map((mesa) => {
          if (this.isInner(p, mesa)) {

            if (!this.state.marcadas[mesa.key]) {
              if (mesa.cantidad_detalle) {
                // console.log(mesa)
                if (permiso_reasignar) {
                  this.getComprasDeMesa(mesa.key);
                }
                return;
              }
              if (this.state.mesa_compra_por_reasignar) {
                SPopup.alert("REASIGNANDO A LA MESA, Espere un momento...")
                SSocket.sendPromise({
                  component: "mesa_compra",
                  type: "reasignarMesa",
                  key_mesa_compra: this.state.mesa_compra_por_reasignar.key,
                  key_mesa: mesa.key,
                }).then(e => {
                  MESA.Actions._getReducer(this.props).data = null;
                  this.state.mesa_compra_por_reasignar = null;
                  this.setState({ ...this.state })
                  SPopup.close("alert")

                }).catch(e => {
                  SPopup.alert(e.error ?? "Error desconocido.")
                })
                return;
              }
              this.state.marcadas[mesa.key] = mesa;
            } else {
              delete this.state.marcadas[mesa.key];
            }

            var mesas_sector = (Object.values(this.state.marcadas).filter(o => o.key_sector == mesa.key_sector));
            var sector_obj = Object.values(sectores).find(o => o.key == mesa.key_sector);
            carrito.Actions.addToCard(
              {
                key: sector_obj.key,
                precio: sector_obj.precio,
                tipo: 'sector',
                cantidad: mesas_sector.length ?? 0,
                key_evento: this.key,
                mesas: mesas_sector
              },
              this.props
            );
            this.setState({ ...this.state })
          }
        });
      }}
      paint={(ref) => {
        const { ctx } = ref;
        this._ref_canvas = ref;
        console.log("REPINTOO");
        Object.values(mesas).map((isla) => {
          if (isla.cantidad_detalle) {
            console.log(isla.cantidad_detalle, isla)

            // ctx.strokeStyle = "#fff"
            let color = STheme.color.danger;
            if (isla.cantidad_detalle > 1) {
              color = STheme.color.warning
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            var s = 4;

            // ctx.font = "20px serif";
            // ctx.fillText(isla.cantidad_detalle, isla.x, isla.y);
            ctx.beginPath();
            ctx.moveTo(isla.x + s, isla.y + s)
            ctx.lineTo(isla.x + isla.w - s, isla.y + isla.h - s)
            ctx.moveTo(isla.x + isla.w - s, isla.y + s)
            ctx.lineTo(isla.x + s, isla.y + isla.h - s)
            ctx.stroke();
            ctx.closePath();
          }
          // if (isla.key_venta_detalle) {
          //   if (isla.key_venta_detalle.length > 0) {
          //     // console.log(isla.key_venta_detalle)
          //     ctx.strokeStyle = STheme.color.danger
          //     ctx.lineWidth = 4;
          //     var s = 4;
          //     ctx.moveTo(isla.x + s, isla.y + s)
          //     ctx.lineTo(isla.x + isla.w - s, isla.y + isla.h - s)
          //     ctx.moveTo(isla.x + isla.w - s, isla.y + s)
          //     ctx.lineTo(isla.x + s, isla.y + isla.h - s)
          //     ctx.stroke();
          //     // ctx.fillRect(isla.x, isla.y, isla.w, isla.h)
          //   }
          // } else {
          //   // ctx.strokeStyle = STheme.color.card
          //   // ctx.lineWidth = 2;
          //   // ctx.fillRect(isla.x, isla.y, isla.w, isla.h)
          //   // ctx.strokeRect(isla.x, isla.y, isla.w, isla.h)
          // }
        })
        Object.values(this.state.marcadas).map((isla) => {
          ctx.strokeStyle = "#f00"
          ctx.fillStyle = "#00FF0099"
          ctx.lineWidth = 2;
          // ctx.strokeRect(isla.x, isla.y, isla.w, isla.h)
          ctx.fillRect(isla.x, isla.y, isla.w, isla.h)
        })
      }}
    />

  }

  getSectores() {
    const data = sector.Actions.getByKeyEvento(this.key, this.props);
    if (!data) return <SLoad />;
    return Object.values(data).map((obj) => {
      return (
        <SView col={"xs-6 sm-4 md-4 lg-4 xl-4"} center padding={1} >
          <SView col={"xs-12"} center style={{
            // backgroundColor: STheme.color.accent + "22",
            // borderRadius: 8,
            // borderWidth: 1,
            paddingLeft: 4,
            paddingRight: 4,
            borderColor: STheme.color.lightGray,
            borderBottomWidth: 1,
          }} row >
            <SText fontSize={11} bold col={"xs-7"} color={STheme.color.secondary}>{obj.descripcion}</SText>
            <SText fontSize={11} col={"xs-5"} color={STheme.color.secondary} style={{ textAlign: "right" }}>Bs. {SMath.formatMoney(obj.precio, 0)}</SText>
          </SView>
        </SView>


        // <SView col={'xs-12'} row style={{
        //   padding: 4
        // }}>
        //   <SText fontSize={12} bold col={"xs-7"}>{obj.descripcion}</SText>
        //   <SText fontSize={12} col={"xs-5"} center>Bs. {SMath.formatMoney(obj.precio)}</SText>
        //   <SHr height={2} color={STheme.color.card} />
        // </SView>
      );
    })
  }
  getTutorial() {


    return (
      <SView
        col={"xs-10 md-8"} style={{
          position: "absolute",
          backgroundColor: STheme.color.primary,
          bottom: 0,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,

        }} center>

        {/* <SHr /> */}
        {/* <SText bold color={STheme.color.secondary}>Sectores y precios</SText> */}
        {/* <SHr height={4} /> */}
        {/* <SText fontSize={10} center col={"xs-12"} color={STheme.color.secondary}>Presione sobre un espacio para agregar al carrito</SText> */}

        <SView col={"xs-12"} row padding={4}>
          {this.getSectores()}
        </SView>
        <SHr />
      </SView>
    )
  }
  render() {
    return (
      <>
        <SPage title={'Reservas'} disableScroll center>
          <SView col={'xs-12'} center height>
            {this.getCanvas()}
          </SView>
        </SPage>
        <SView col={'xs-12'} center >
          {this.getTutorial()}
        </SView>

        <Carrito style={{
          top: "5%"
        }}
          bottom="85%" />
      </>
    );
  }
}

const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Reserva);

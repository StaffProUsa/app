import React from 'react';
import { connect } from 'react-redux';
import {
  SHr, SIcon, SImage, SLoad, SNavigation, SPage, SText, STheme, SView, SDate, SMath
} from 'servisofts-component';
import CanvasPlanimetria from '../../Components/CanvasPlanimetria';
import Carrito from '../../Components/Carrito';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import mesa from '../../Services/Casagrandeadmin/Components/mesa';
import sector from '../../Services/Casagrandeadmin/Components/sector';

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
    var sectores = sector.Actions.getByKeyEvento(this.key, this.props);
    if (!mesas) return <SLoad />;
    if (!sectores) return <SLoad />;
    // if (this._ref_canvas) {
    //   this._ref_canvas.repaint();
    // }
    return <CanvasPlanimetria
      key_evento={this.key}
      onClick={(evt, ref) => {
        var p = { x: evt.offsetX, y: evt.offsetY }
        Object.values(mesas).map((mesa) => {
          if (this.isInner(p, mesa)) {
            console.log(p, mesa);
            if (mesa.key_venta_detalle) return;
            if (!this.state.marcadas[mesa.key]) {
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

          if (isla.key_venta_detalle) {
            if (isla.key_venta_detalle.length > 0) {
              console.log(isla.key_venta_detalle)
              ctx.strokeStyle = STheme.color.danger
              ctx.lineWidth = 4;
              var s = 4;
              ctx.moveTo(isla.x + s, isla.y + s)
              ctx.lineTo(isla.x + isla.w - s, isla.y + isla.h - s)
              ctx.moveTo(isla.x + isla.w - s, isla.y + s)
              ctx.lineTo(isla.x + s, isla.y + isla.h - s)
              ctx.stroke();
              // ctx.fillRect(isla.x, isla.y, isla.w, isla.h)
            }
          } else {
            // ctx.strokeStyle = STheme.color.card
            // ctx.lineWidth = 2;
            // ctx.fillRect(isla.x, isla.y, isla.w, isla.h)
            // ctx.strokeRect(isla.x, isla.y, isla.w, isla.h)
          }
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
        <SView col={'xs-12'} row style={{
          padding: 4
        }}>
          <SText fontSize={12} bold col={"xs-7"}>{obj.descripcion}</SText>
          <SText fontSize={12} col={"xs-5"} center>Bs. {SMath.formatMoney(obj.precio)}</SText>
          <SHr height={2} color={STheme.color.card} />
        </SView>
      );
    })
  }
  getTutorial() {


    return (
      <SView
        col={"xs-9 sm-7 md-5 lg-4 xl-3"}
        
        center
        // border={STheme.color.card}
        style={{
          position: "absolute",
          backgroundColor: STheme.color.background + "A0",
          bottom: 0,
          left: 0,
          // borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}>
        {/* <SHr /> */}
        <SText bold>Sectores</SText>
        <SHr height={4} />
        <SView col={"xs-12"} row>
          {this.getSectores()}
        </SView>
        <SHr height={4} />
        <SText fontSize={10} center col={"xs-12"}>Presione sobre un espacio para agregar al carrito</SText>
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
        {this.getTutorial()}
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

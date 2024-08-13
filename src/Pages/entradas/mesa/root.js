import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SLoad, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
// import Carrito from '../../Components/Carrito';
import mesa from '../../../Services/Casagrandeadmin/Components/mesa';
import Model from '../../../Model';
import CanvasPlanimetria from '../../../Components/CanvasPlanimetria';
import { connect } from 'react-redux';

class mesaDetalle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cantidad: 0,
            marcadas: {}

        };
        // this.key = SNavigation.getParam('key');
        this.key_evento = SNavigation.getParam("key_evento")
    }

    componentDidMount() {
        this.getData()
    }
    getData() {
        SSocket.sendPromise({
            component: "mesa",
            type: "getMisMesasEvento",
            key_evento: this.key_evento,
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e)
            // this.setState({data: e.data})
        })
    }






    isInner(p, m) {
        return ((m.x <= p.x && m.x + m.w >= p.x) && (m.y <= p.y && m.y + m.h >= p.y))
    }

    // getComprasDeMesa(key) {
    //     SPopup.open({
    //         key: "mesa_compra",
    //         content: <PopupMesa key_mesa={key} reasignar={(mesa_compra) => {
    //             this.state.mesa_compra_por_reasignar = mesa_compra
    //             SPopup.close("mesa_compra")
    //         }} />
    //     })

    // }
    getCanvas() {
        // var carrito_data = carrito.Actions.getAllSimple(this.props);
        // if (!carrito_data) return <SLoad />
        // var marcadas = {};
        // carrito_data.filter(o => o.key_evento == this.key_evento).map((ca) => {
        //     if (ca.mesas) {
        //         ca.mesas.map((mesa) => {
        //             marcadas[mesa.key] = mesa;
        //         })
        //     }
        // })
        // if (Object.keys(this.state.marcadas).length != Object.keys(marcadas).length) {
        //     this.setState({
        //         marcadas: marcadas,
        //     })
        // }
        // var mesas = mesa.Actions.getAllKeyEvento(this.key_evento, this.props);
        var mesas = this.state.data;
        // var mesas = this.state.data;
        const MESA = mesa;
        // var sectores = sector.Actions.getByKeyEvento(this.key_evento, this.props);

        // const permiso_reasignar = Model.usuarioPage.Action.getPermiso({ url: "/ticket/reserva", permiso: "reasignar_mesa", });
        if (!mesas) return <SLoad />;
        // if (!sectores) return <SLoad />;
        // if (this._ref_canvas) {
        //   this._ref_canvas.repaint();
        // }
        return <CanvasPlanimetria
            key_evento={this.key_evento}
            onClick={(evt) => {
                var p = { x: evt.offsetX, y: evt.offsetY }
                Object.values(mesas).map((mesa) => {
                    if (this.isInner(p, mesa)) {
                        SNavigation.navigate("/entradas/mesa/profile", { pk: mesa.key, key_evento: this.key_evento })
                    }
                })
            }}
            paint={(ref) => {
                const { ctx } = ref;
                this._ref_canvas = ref;
                Object.values(mesas).map((isla) => {

                    // let color = STheme.color.danger;
                    // if (isla.cantidad_detalle > 1) {
                    //     color = STheme.color.warning
                    // }
                    var s = 0;

                    // var grad = ctx.createLinearGradient(isla.x + s, isla.y + s, isla.x + isla.w - s,  isla.y + isla.h - s);
                    // if()
                    // grad.addColorStop(0, STheme.color.warning);
                    // grad.addColorStop(1, STheme.color.success);

                    ctx.strokeStyle = STheme.color.warning;
                    ctx.lineWidth = 3;
                    // ctx.beginPath();
                    // ctx.moveTo(isla.x + s, isla.y + s)
                    // ctx.lineTo(isla.x + isla.w - s, isla.y + isla.h - s)
                    // ctx.moveTo(isla.x + isla.w - s, isla.y + s)
                    // ctx.lineTo(isla.x + s, isla.y + isla.h - s)
                    // ctx.stroke();
                    // ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(isla.x + (isla.w / 2), isla.y + (isla.h / 2), isla.h / 2, 0, 2 * Math.PI, false);
                    ctx.stroke();
                    ctx.fillStyle = STheme.color.success + "66"
                    ctx.fill();
                    ctx.closePath();
                    // ctzx.


                })
            }}
        />

    }


    render() {
        return <SPage title={"Mesa"} disableScroll center>
            <SView col={'xs-12'} center height>
                {this.getCanvas()}
            </SView>
        </SPage>
    }
}

const initStates = (state) => {
    return { state };
};
export default connect(initStates)(mesaDetalle);

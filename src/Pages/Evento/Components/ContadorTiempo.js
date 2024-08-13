import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SIcon, SLoad, SPage, SText, STheme, SThread, SView,SNavigation } from 'servisofts-component';
import parametro from '../../../Services/Casagrandeadmin/Components/parametro';
import venta from '../../../Services/Casagrandeadmin/Components/venta';

class ContadorTiempo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curtime: new SDate()
        };
    }

    componentDidMount() {
        this.state.run = true;
        this.hilo();
    }
    componentWillUnmount() {
        this.state.run = false;
    }
    hilo() {
        new SThread(300, "hilo_reloj", false).start(() => {
            if (!this.state.run) return false;
            this.setState({
                curtime: new SDate()
            })
            this.hilo();

        })
    }
    parseStr(num) {
        var prev = "";
        if (num < 10) {
            prev = "0"
        }
        num = num.toString(); //If it's not already a String
        num = num.slice(0, (num.indexOf("."))); //With 3 exposing the hundredths place
        return prev + num;
    }
    render() {
        const data_parametros = parametro.Actions.getAll(this.props);
        const data = venta.Actions.getByKey(this.props.key_venta, this.props);
        if (!data) return <SLoad />;
        if (!data_parametros) return <SLoad />;
        var param = data_parametros["timeout_reserva"]
        var value_seconds = parseFloat(param.descripcion);
        var curTime = this.state.curtime;
        var time_venta = new SDate(data.fecha_on);
        var tim_transcurrido = time_venta.diffTime(curTime) / 1000;
        var restante = value_seconds - tim_transcurrido
        if (restante <= 0) {
            // SNavigation.replace("billetera/mensajePedidoFueraTiempo");
            return <SText>Vencido</SText>
        }
        var seconds = (restante) % 60;
        var minutos = (restante / 60) % 60;
       
        var timeSTR = `${this.parseStr(minutos)}:${this.parseStr(seconds)}`
        return (
            <SView col={'xs-11'} border={'transparent'} center row>
                <SIcon name={'Timer'} width={34} fill={STheme.color.primary} />
                <SView width={20} />
                <SText fontSize={40}>{timeSTR} min</SText>
                {/* <Contador date={"32"} ></Contador> */}
            </SView>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(ContadorTiempo);
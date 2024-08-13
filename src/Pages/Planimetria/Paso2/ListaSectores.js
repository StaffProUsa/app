import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SHr, SList, SList2, SLoad, SMath, SNavigation, SScrollView2, SText, STheme, SView } from 'servisofts-component';
import mesa from '../../../Services/Casagrandeadmin/Components/mesa';
import sector from '../../../Services/Casagrandeadmin/Components/sector';

class ListaSectores extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        var data = sector.Actions.getByKeyEvento(this.props.key_evento, this.props);
        if (!data) return <SLoad />
        return <SView col={"xs-12"} center height style={{
            overflow: "hidden"
        }}>
            <SHr />
            <SText>Seleccione un sector para agregar las mesas</SText>
            <SView col={"xs-11"}>
                <SButtom
                    type='danger'
                    onPress={() => {
                        SNavigation.navigate("admin/sector/registro", { key_evento: this.props.key_evento });
                    }}><SText >Nuevo Sector</SText></SButtom>
            </SView>
            <SHr />
            <SView col={"xs-12"} height>
                <SScrollView2 disableHorizontal width={"100%"}>
                    <SView col={"xs-12"} height>
                        <SList2
                            data={data}
                            center
                            render={(obj) => {
                                return <SView col={"xs-11"} card row style={{
                                    padding: 8
                                }} onPress={() => {
                                    var islas = this.props.Menu.state["select_color"];
                                    mesa.Actions.registro(islas, obj.key, this.props).then(resp => {
                                        console.log("exito al registar mesas", resp)
                                        this.props.Menu.clear();
                                    }).catch(e => {
                                        console.error(e)
                                    })
                                }}>
                                    <SView flex center>
                                        <SText col={"xs-12"} fontSize={16} bold>{obj.descripcion}</SText>
                                    </SView>
                                    <SView style={{
                                        width: 90,
                                        height: 30,
                                        backgroundColor: STheme.color.card,
                                        borderRadius: 4,
                                    }} center>
                                        <SText center fontSize={12} bold>Bs. {SMath.formatMoney(obj.precio)}</SText>
                                    </SView>

                                </SView>
                            }}
                        />
                        <SHr height={70} />
                    </SView>
                </SScrollView2>
            </SView>
        </SView>
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(ListaSectores);
import React, { Component } from 'react';
import { PanResponder } from 'react-native'
import { connect } from 'react-redux';
import { SHr, SIcon, SImage, SMath, SPage, SText, STheme, SView, SNavigation, SStorage } from 'servisofts-component';
// import SSocket from 'servisofts-socket';
// import DataBase from '../../DataBase';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
export type FloatPropsType = {
    data: any,
    bottom?: number,
    onPress?: (obj) => {},
}
class index extends Component<FloatPropsType> {
    static lastPosition = 0;
    constructor(props) {
        super(props);
        this.state = {
            bottom: !!index.lastPosition ? index.lastPosition : (this.props.bottom ?? 100),
        };
        this.idven = SNavigation.getParam("idven");
        this.createPan()
    }

    createPan() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.start = this.state.bottom
            },
            onPanResponderMove: (evt, gestureState) => {
                this.setState({ bottom: this.start - gestureState.dy, });
                index.lastPosition = this.start - gestureState.dy
                evt.stopPropagation();
                evt.preventDefault();
            },
            onPanResponderRelease: (evt, gestureState) => {
                // if (this.props.onContentSizeChange) {
                //     this.props.onContentSizeChange(this.state.width)
                // }
            },
        });
    }

    componentDidMount() {

        // const cliente = Model.tbcli.Action.getCliente();

        // if (cliente) {
        //     this.setState({
        //         client: cliente
        //     })
        //     return;
        // // }
        // SStorage.getItem("tbcli_a_comprar", resp => {
        //     if (!resp) return;
        //     try {
        //         const clidata = JSON.parse(resp);
        //         this.setState({
        //             client: clidata
        //         })
        //     } catch (e) {
        //         console.error(e);
        //     }
        // })

        // if (this.idven) {
        //     DataBase.dm_cabfac.objectForPrimaryKey(this.idven).then((e) => {
        //         this.setState({ dataPedido: e })

        //     })
        // }

    }
    render() {
        // let total = 0;
        // let productos = {} ;
        // var productos = {};
        // var productos;
        // if (this.state?.dataPedido) {
        //     productos = this.state?.dataPedido?.detalle ?? [];
        //     Object.keys(productos).map((key, index) => {
        //         total += productos[key].vdpre * productos[key].vdcan;
        //     });
        // } else {
        //     productos = Model.carrito.Action.getState().productos;
        //     Object.keys(productos).map((key, index) => {
        //         total += productos[key].data.prdpoficial * productos[key].cantidad;
        //     });
        // }
        var { total, cantidad } = carrito.Actions.getInfo(this.props);
        if (!cantidad) return null;
        var distancia = 40
        if (this.props.bottom) distancia = this.props.bottom
        return (
            <>
                <SView center style={{
                    backgroundColor: STheme.color.background,
                    width: 145,
                    height: 54,
                    position: "absolute",
                    bottom: this.state.bottom,
                    right: 0,
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    borderWidth: 1,
                    borderColor: STheme.color.primary,
                    borderRightWidth: 0
                }}

                >
                    {/* <SGradient
                        colors={['#A9A9A9', '#222222']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                    /> */}
                    <SView
                        col={"xs-12"}
                        height
                        row
                        center
                        onPress={() => {
                            // this.props.navigation.navigate('farmacia/carrito');
                            cantidad == 0
                                ? SNavigation.navigate('carrito/mensajeCarritoVacio')
                                : SNavigation.navigate('/carrito');
                        }}>
                        <SView width={50} center height >
                            <SIcon name={'Carrito2'} height={25} width={25} fill={STheme.color.text} />
                        </SView>
                        <SView flex height style={{ justifyContent: "center" }} >
                            <SText fontSize={12} color={STheme.color.text} font='Roboto' >{`Bs. ${SMath.formatMoney(total)}`}</SText>
                            <SText fontSize={12} color={STheme.color.text} bold font='Roboto' >{cantidad} items</SText>
                            {/* <SText fontSize={10} color={STheme.color.white} font='Roboto' >{this.state?.client?.clinom}</SText> */}
                        </SView>
                        <SView width={16}
                            height
                            {...this.panResponder.panHandlers}
                            backgroundColor={STheme.color.primary}
                            center
                            padding={4}
                        >
                            <SView style={{
                                width: 10, height: 10,
                                transform: [{
                                    rotate: "90deg"
                                }]
                            }}>
                                <SIcon name='Arrow' fill={STheme.color.secondary} />
                            </SView>
                            <SView flex />
                            <SView style={{
                                width: 10, height: 10,
                                transform: [{
                                    rotate: "-90deg"
                                }]
                            }}>
                                <SIcon name='Arrow' fill={STheme.color.secondary} />
                            </SView>
                            {/* <SIcon name={'Scroll'} height={52} width={16} fill={STheme.color.white} /> */}
                        </SView>
                    </SView>

                </SView >
            </>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);
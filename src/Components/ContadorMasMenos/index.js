import React, { Component } from 'react';
import { Vibration } from 'react-native';
import {
    SDate,
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

type ContadorMasMenosType = {
    max?: number,
    min?: number,
    defaultValue?: number,
    value?: number,
    onChange?: Function

}
class ContadorMasMenos extends Component<ContadorMasMenos> {
    constructor(props) {
        super(props);
        this.state = {
            value: (this.props.value ?? this.props.defaultValue) ?? 0
        };
    }

    getIcon(name) {
        return
    }
    onChange() {
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
        this.setState({ ...this.state });
    }
    render() {
        return (
            <SView flex>
                <SView col={'xs-10'} height center border={'transparent'}>
                    <SView
                        col={'xs-12'}
                        height={30}
                        row
                        center
                        backgroundColor={STheme.color.card}
                        style={{ borderRadius: 20 }}>
                        <SView
                            style={{ position: 'absolute', left: -15 }}
                            onPress={() => {
                                Vibration.vibrate(500)
                                if (this.props.min) {
                                    if (this.state.value - 1 < this.props.min) return;
                                }else{
                                    if (this.state.value - 1 < 0) return;
                                }
                                this.state.value = this.state.value - 1;
                                this.onChange();

                            }}>
                            <SIcon
                                name={'IconBtnMinus'}
                                // fill={STheme.color.primary}
                                // stroke={STheme.color.white}
                                height={35}
                                width={35}
                            />
                        </SView>
                        <SText fontSize={18} bold color={'#111111'}>{this.state.value}</SText>
                        <SView
                            style={{ position: 'absolute', right: -15 }}
                            onPress={() => {
                                Vibration.vibrate(500)
                                if (this.props.max) {
                                    if (this.state.value + 1 > this.props.max) return;
                                }
                                this.state.value = this.state.value + 1;
                                this.onChange();
                            }}>
                            <SIcon
                                name={'IconBtnPlus'}
                                // fill={STheme.color.primary}
                                // stroke={STheme.color.black}
                                height={35}
                                width={35}
                            />
                        </SView>
                    </SView>
                </SView>
            </SView>
        );
    }
}
export default ContadorMasMenos;
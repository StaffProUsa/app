import React, { Component } from 'react';
import { SHr, SIcon, SImage, SText, STheme, SView, SInput, } from 'servisofts-component';

export default class PBuscador extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <SView col={'xs-11'} row height={50} center>
                <SView col={'xs-12'} center height>
                    <SView
                        row
                        col={'xs-12'}
                        height={40}
                        center
                        backgroundColor={STheme.color.card}
                        style={{ borderRadius: 15 }}>
                        <SView col={'xs-1.5'} height center>
                            {/* <SIcon name={"IconSearch"} width={20} fill={this.props.fill ?? STheme.color.primary} /> */}
                            <SIcon name={'Buscar'} width={20} fill={STheme.color.primary} />
                        </SView>
                        <SView col={'xs-10.5'} center>
                            <SInput
                                col={'xs-12'}
                                placeholder={'BUSCAR'}
                                style={{
                                    borderWidth: 0,
                                    height: '100%',
                                    backgroundColor: 'transparent',
                                    fontSize: 15
                                }}
                                color={STheme.color.text}
                                placeholderTextColor={STheme.color.gray}
                            // onChangeText={(text) => {
                            //   this.setState({
                            //     find: text
                            //   })
                            // }}
                            onChangeText={(txt) => {
                              this.props.onChangeText(txt);
                            }}
                            />
                        </SView>
                    </SView>
                </SView>
            </SView>
        );
    }
}
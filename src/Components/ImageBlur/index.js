import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SGradient, SImage, SText, STheme, SView } from 'servisofts-component';
import { Dimensions } from 'react-native';

class ImageBlur extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <SView col={"xs-12"} height={this.props.height} style={{
                overflow: "hidden"
            }}>
                <SView col={"xs-12"} center height style={{
                    position: "absolute", opacity: 0.6
                }}>
                    <SImage src={this.props.src}
                        style={{ height: "300%", width: "100%", resizeMode: 'cover', }} />
                </SView>
                <SView col={"xs-12"} center height style={{
                    position: "absolute", opacity: 0.6
                }}>
                    <SImage src={this.props.src}
                        style={{ height: "200%", width: "100%", resizeMode: 'cover', }} />
                </SView>
                <SView col={"xs-12"} center height style={{
                    position: "absolute", opacity: 0.6
                }}>
                    <SImage src={this.props.src}
                        style={{ height: "100%", width: "200%", resizeMode: 'cover', }} />
                </SView>
                <SView col={"xs-12"} center height style={{ position: "absolute", opacity: 0.4, }}>
                    <SGradient colors={[STheme.color.background, STheme.color.card]} deg={"0"} />
                </SView>
                <SView col={"xs-12"} center height style={{ position: "absolute", opacity: 0.4, }}>
                    <SGradient colors={[STheme.color.background, STheme.color.card]} deg={"180"} />
                </SView>
                <SView col={"xs-12"} center height style={{
                    position: "absolute",
                    opacity: 0.6,
                    backgroundColor: STheme.color.background
                }}>
                </SView>
                {/*ACABA EL EFECTO BLUR */}
                <SImage
                    src={this.props.src}
                    style={{
                        height: "100%",
                        width: null,
                        resizeMode: "contain"
                    }}
                />
            </SView>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(ImageBlur);
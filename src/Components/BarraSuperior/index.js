import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SIcon, SNavigation, SText, STheme, SView } from 'servisofts-component';
// import NavBar from '../NavBar';

class BarraSuperior extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //     anim: new Animated.Value(0),
    // };
  }

  render() {
    // var usuario = this.props.state.usuarioReducer.usuarioLog
    // if (!usuario) {
    //     // SNavigation.navigate("login");
    //     // return <SView />
    // }

    return (
      <SView
        center
        col={'xs-12'}
        height={40}
        backgroundColor={STheme.color.secondary}>
        <SView col={'xs-12'} height row flex>
          {/* <SView col={"xs-1"} onPress={() => {
                        SNavigation.goBack();
                    }}>
                        <SView width={60} height={60}>
                            <SHr height={20} />
                            <SIcon name={'Back'} height={16} width={21} color={STheme.color.primary}></SIcon>
                        </SView>
                    </SView>
                    <SView col={"xs-11"} ></SView> */}
          <SView
            width={45}
            height
            border={'transparent'}
            center
            row
            onPress={() => {
              SNavigation.goBack();
            }}>
            <SIcon name={'Back'} fill={STheme.color.primary} height={20} />
          </SView>
          <SView center>
            <SText fontSize={16} font="Roboto" >{this.props.title}</SText>
          </SView>
        </SView>
      </SView>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(BarraSuperior);

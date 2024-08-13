import React, {Component} from 'react';
import {SLoad, SText, STheme, SView} from 'servisofts-component';

import {Animated} from 'react-native';
// import SBLocation from '../../SBLocation';

type _SwitchRastreoProps = {
  colors: {
    active?: string,
    inactive?: string,
    acent?: string
  },
  width?: number,
  height?: number
};

export default class SwitchTheme extends Component<_SwitchRastreoProps> {
  state;
  animValue;

  constructor(props: any) {
    super(props);
    this.state = {
      active: STheme.getTheme() == 'dark' ? 1 : 0,
      colors: {
        active: this.props.colors?.active ?? '#2FC25F',
        inactive: this.props.colors?.inactive ?? '#B7B7B7',
        acent: this.props.colors?.acent ?? '#fff'
      }
    };
    this.animValue = new Animated.Value(this.state.active ? 1 : 0);
  }

  componentDidMount() {
    this.animValue.addListener(({value}) => {
      if (value == 1) {
        STheme.select('default');
      } else {
        STheme.select('dark');
      }
    });
  }

  fadeIn() {
    this.state.active = STheme.getTheme();
    this.animValue.stopAnimation();
    Animated.timing(this.animValue, {
      toValue: !STheme.getTheme() ? 0 : 1,
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      this.state.active = STheme.getTheme();
      this.setState({
        active: this.state.active
      });
    });
  }

  render() {
    return (
      <SView
        animated
        style={{
          width: this.props.width ?? 100,
          height: this.props.height ?? 40,
          borderRadius: 18,
          justifyContent: 'center',
          backgroundColor: this.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [
              this.state.colors['inactive'],
              this.state.colors['active']
            ]
          })
        }}
        onPress={() => {
          this.fadeIn();
          STheme.change();
          this.props.callback({ConductorOnline:  this.state.active?"oscuro":"claro"});
        }}>
        <SView
          animated
          center
          style={{
            width: 70,
            height: 33,
            position: 'absolute',

            right: this.animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [16, (this.props.width ?? 100) - 70 - 16]
            })
          }}>
          {/* <SText>{this.state.active ? 'default' : 'dark'}</SText> */}
        </SView>

        {/* tamaño a la bolita */}
        <SView
          animated
          style={{
            width: 16,
            height: 16,
            borderRadius: 100,
            position: 'absolute',
            left: this.animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [4, (this.props.width ?? 100) - 16 - 4]
            })
          }}
          backgroundColor={this.state.colors['acent']}></SView>
      </SView>
    );
  }
}

import React, {Component} from 'react';
import {SLoad, SText, STheme, SView} from 'servisofts-component';

type PButtomDanger_props = {
  primary?: boolean,
  secondary?: boolean,
  withe?: boolean,
  outline?: boolean,
  onPress?: () => void,
  loading?: boolean,
  small?: boolean,
  style?: any,
  width?: number,
  height?: number
};

export default class PButtomDanger extends Component<PButtomDanger_props> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    var bgColor = this.props.primary
      ? STheme.color.danger
      : this.props.secondary
      ? STheme.color.info
      : STheme.color.danger;
    var colorText = STheme.color.white;
    if (this.props.withe) {
      bgColor = '#fff';
      colorText = STheme.color.primary;
    }
    var size = {
      width: this.props.width ?? 350,
      height: this.props.height ?? 55
    };
    if (this.props.small) {
      size.width = 180;
      size.height = 35;
    }
    return (
      <SView
        height={size.height}
        style={{
          borderRadius: 8,
          width: '100%',
          maxWidth: size.width,
          ...(this.props.outline
            ? {borderWidth: 1, borderColor: bgColor}
            : {backgroundColor: bgColor})
        }}
        center
        activeOpacity={this.props.loading ? 1 : 0.5}
        {...this.props}
        onPress={() => {
          if (this.props.loading) return;
          if (this.props.onPress) {
            this.props.onPress();
          }
        }}>
        {this.props.loading ? (
          <SLoad />
        ) : (
          <SText
            {...this.props}
            color={this.props.outline ? bgColor : colorText}
            font={'Roboto-Bold'}>
            {/* {this.props.children} */}
          </SText>
        )}
      </SView>
    );
  }
}

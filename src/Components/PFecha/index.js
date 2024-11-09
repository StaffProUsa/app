import React, { Component } from 'react';

import { connect } from 'react-redux';
import { SIcon, SText, STheme, SView } from 'servisofts-component';

class PFecha extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.page = SNavigation.getParam("page");
  }

  getMes() {
    var mes = this.props.mes
    switch (mes) {
      case 1: return 'Ene';
      case 2: return 'Feb';
      case 3: return 'Mar';
      case 4: return 'Abr';
      case 5: return 'May';
      case 6: return 'Jun';
      case 7: return 'Jul';
      case 8: return 'Ago';
      case 9: return 'Sep';
      case 10: return 'Oct';
      case 11: return 'Nov';
      case 12: return 'Dic';
      // default: return 'Ene';
    }
  }

  render() {

    return (
      <>
        <SView
          col={'xs-12'}
          style={{
            alignItems: 'flex-end',
            position: 'absolute',
            bottom: this.props.position == 'bottom' ? this.props.spacing : null,
            top: this.props.position == 'top' ? this.props.spacing : null
          }}>
          <SIcon
            name={'BgFecha'}
            width={60}
            height={103}
            fill={this.props.backgroundColor}
          />
          <SView
            col={'xs-12'}
            style={{ position: 'absolute', alignItems: 'flex-end', top: 17, right: 3 }}>
            <SText fontSize={32} font={'Roboto'} color={STheme.color.white}>
              {this.props.dia}
            </SText>
            <SText fontSize={20} font={'Roboto'} color={STheme.color.white}>
              {/* {this.props.mes} */}
              {this.getMes()}
            </SText>
          </SView>
        </SView>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(PFecha);

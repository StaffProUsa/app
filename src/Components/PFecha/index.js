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
      case 'Enero': return 'Ene';
      case 'Febrero': return 'Feb';
      case 'Marzo': return 'Mar';
      case 'Abril': return 'Abr';
      case 'Mayo': return 'May';
      case 'Junio': return 'Jun';
      case 'Julio': return 'Jul';
      case 'Agosto': return 'Ago';
      case 'Septiembre': return 'Sep';
      case 'Octubre': return 'Oct';
      case 'Noviembre': return 'Nov';
      case 'Diciembre': return 'Dic';
      default: return 'Ene';
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
            style={{ position: 'absolute', alignItems: 'flex-end', top: 17 }}>
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SLoad, SNavigation, SPage, SRangeSlider } from 'servisofts-component';
import mesa from '../../Services/Casagrandeadmin/Components/mesa';
import Paso1 from './Paso1';
import Paso2 from './Paso2';

class Planimetria extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.key_evento = SNavigation.getParam("key_evento");
  }

  getContenido() {
    // var mesas = mesa.Actions.getAll(this.key_evento, this.props);
    var mesas = mesa.Actions.getAllKeyEvento(this.key_evento, this.props);
    if (!mesas) return <SLoad />;
    console.log("entro en el render mesas");
    console.log(Object.values(mesas).length);
    if (this.state.img) return <Paso2 parent={this} key_evento={this.key_evento} mesas={mesas} />;
    return <Paso1 parent={this} />;
  }

  render() {
    return (
      <SPage title={'Planimetría'} disableScroll center>
        {this.getContenido()}
      </SPage>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Planimetria);

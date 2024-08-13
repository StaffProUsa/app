import React from 'react';
import {connect} from 'react-redux';
import {SHr, SLoad, SPage, SText, SView} from 'servisofts-component';
import finanza from '..';
import sector from '..';
import venta from '../../venta';
  
class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getTipoentrada() {
    var data = venta.Actions.getAll(this.props);
    if (!data) return <SLoad />;

    console.log(data);

    return Object.keys(data).map((key, index) => {
      var obj = data[key];
      return (
        <SView col={'xs-12 '} border={'transparent'}>
          <SText> {JSON.stringify(obj) + '\n'} </SText>
        </SView>
      );
    });
  }

  render() {
    return (
      <>
        <SPage title={'Lista'} disableScroll>
          <SView col={'xs-12'} center>
            <SView col={'xs-10'} center>
              {this.getTipoentrada()}
            </SView>
          </SView>
          <SHr height={30} />
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Test);

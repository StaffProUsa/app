import React from 'react';
import { connect } from 'react-redux';

import { SHr, SIcon, SPage, SScrollView2, SText, STheme, SView } from 'servisofts-component';
import PinchZoom from '../Components/PinchZoom';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.color = {
    }
  }
  render() {
    return (
      <SPage disableScroll>
        <SView col={'xs-12'} height center>
          <PinchZoom>
            <SView style={{
              width: 500,
              height: 500,
            }} center>
              <SText>Hola</SText>
            </SView>
          </PinchZoom>
        </SView>
      </SPage >
    );
  }
}

const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Test);

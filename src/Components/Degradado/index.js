import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  SGradient,
  SHr,
  SIcon,
  SImage,
  SNavigation,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import Model from '../../Model';

class Degradado extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.page = SNavigation.getParam("page");
  }


  render() {
    return (
      <>
        {/* <SView col={'xs-12'} center> */}
          <SGradient colors={["#0C0C10", "#040405"]} />
        {/* </SView> */}
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Degradado);

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SPage, SText } from 'servisofts-component';
import ResizeDualPanel from '../Components/ResizeDualPanel';

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <SPage>
      <ResizeDualPanel
        startX={300}
        content1={<SText>{"Panel1"}</SText>}
        content2={<SText>{"Panel2"}</SText>}
      />
    </SPage>
  }
}

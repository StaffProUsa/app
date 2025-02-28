import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SPage, STable, STable2, SText } from 'servisofts-component';
import ResizeDualPanel from '../Components/ResizeDualPanel';

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <SPage>
      <STable2 data={[
        { a: "texto", b: 20, c: "true", d: "2025-04-16T12:01:20" },
        { a: "texto", b: 25, c: "false", d: "2023-06-27" },
        { a: "texto", b: 25, c: "false", d: "2023-08-01T12:01:20.37273" },
      ]}
        
        header={[
          { key: "a", label: "A", width: 100, excelProps: {} },
          { key: "b", label: "B", width: 100, excelProps: { t: "n", z: "0.00" } },
          { key: "c", label: "C", width: 100, excelProps: {} },
          { key: "d", label: "D", width: 100, excelProps: { t: "d" } },
        ]}
      />
    </SPage>
  }
}

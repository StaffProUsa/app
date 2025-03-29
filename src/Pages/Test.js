import React, { Component } from 'react';
import { SPage, STable, STable2, SText, SView } from 'servisofts-component';
import DatePickerCalendar from "servisofts-table/Components/DatePickerCalendar";
export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <SPage center>
      <SView backgroundColor='#666' padding={8} borderRadius={8} >
        <DatePickerCalendar />
      </SView>
    </SPage>
  }
}

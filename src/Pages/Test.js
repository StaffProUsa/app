import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { SBuscador, SPage, STable, STable2, SText, SView } from 'servisofts-component';
import DatePickerCalendar from "servisofts-table/Components/DatePickerCalendar";
import { Container } from '../Components';


const DATA = [
  { id: '1', title: 'Ricardo Paz Demiquel' },
  { id: '2', title: 'Liceth Flores' },
  { id: '3', title: 'Juan Pablo Montoya' },
]


export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <SPage >
      {/* <DatePickerCalendar /> */}
      <Container>
        <SBuscador onChange={e => this.setState({ find: e })} />
        <FlatList
          data={SBuscador.filter({ data: DATA, txt: this.state.find })}
          renderItem={({ item }) => <SView height={50} card borderRadius={8} margin={4} center>
            <SText>{item.title}</SText>
          </SView>}
        />
      </Container>
    </SPage>
  }
}

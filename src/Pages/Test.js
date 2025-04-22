import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { SBuscador, SButtom, SInput, SPage, STable, STable2, SText, STheme, SView } from 'servisofts-component';
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

  inputtext: SInput;
  inputemail: SInput;
  render() {
    return <SPage >

      <SView></SView>
      <SText></SText>
      <Container>
        <SInput ref={ref => this.inputtext = ref} label="text" type='text' />
        <SInput label="number" type='number' />
        <SInput ref={ref => this.inputemail = ref} label="email" type='email' required />
        <SInput label="phone" type='phone' required />
        <SInput label="textArea" type='textArea' />
        <SInput label="color" type='color' defaultValue={"#ff0000"} />
        <SInput label="checkBox" type='checkBox' />
        <SInput label="date" type='date' />
        <SInput label="date_my" type='date_my' />
        <SInput label="hour" type='hour' />
        <SInput label="money" type='money' />
        <SInput label="password" type='password' />
        <SInput label="select" type='select' options={["opcion1", "opcion2", "carlos", "juan"]} />
        <SInput label="select Mejorado" type='select' options={[
          { key: "opt", component: <SText color={STheme.color.success}>opcion1</SText> },
          { key: "opt2", component: <SText color={STheme.color.danger}>opcion2</SText> },
        ]} />
        <SInput label="image" type='image' />
        <SInput label="file" type='file' />
        <SInput label="files" type='files' />
        <SButtom onPress={() => {

          const valText = this.inputtext.getValue();
          this.inputemail.setValue(valText);
          console.log("este es el valor", valText);
        }}>APRETAR</SButtom>
      </Container>
      {/* <DatePickerCalendar /> */}
      {/* <Container>
        <SBuscador onChange={e => this.setState({ find: e })} />
        <FlatList
          data={SBuscador.filter({ data: DATA, txt: this.state.find })}
          renderItem={({ item }) => <SView height={50} card borderRadius={8} margin={4} center>
            <SText>{item.title}</SText>
          </SView>}
        />
      </Container> */}
    </SPage>
  }
}




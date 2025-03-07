import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SHr, SIcon, SImage, SPage, SText, STheme, SView, SNavigation, SPopup, SLanguage, SList2, SButtom, SInput } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
export type BoxMenuPropsType = {
 data: any,
 onPress?: (obj) => {},
}
class index extends Component<BoxMenuPropsType> {
 constructor(props) {
  super(props);
  this.state = {
  };
 }

 handlePress() {
  if (!this.props.onPress) return null;

  this.props.onPress(this.props.datas)
 }


 renderOption = ({ label, icon, url, params }) => {

  // renderOption = (label: string) => {
  return (
   <>
    <SView col={"xs-11"} row center
     onPress={() => {
      SNavigation.navigate(url, params)

      SPopup.close("popup_menu_alvaro");
     }}


    >
     <SView col={"xs-2"} center height={32}>
      <SIcon name="Menu" height={18} fill={STheme.color.card} />
     </SView>
     <SView flex  >
      <SText fontSize={14} bold>{label}</SText>
     </SView>

    </SView>
    <SHr height={1} color={STheme.color.card} />
   </>
  );
 }

 renderBox() {

  // console.log("this.props.data", this.props.data)
  const options = [
   { label: "ver company", icon: "Menu", url: "/company/profile", params: { pk: this.props.data.company.key } },
   { label: "ver cliente", icon: "Menu", url: "/cliente", params: { key_company: this.props.data.company.key } },
   { label: "ver evento", icon: "Menu", url: "/company/event", params: { key_evento: this.props.data.evento.key } },
   { label: "ver buking", icon: "Menu", url: "/staff/users", params: { pk: this.props.data.staff.key } },
  ];

  return (
   <SView
    col={"xs-12"}
    center
    row
    withoutFeedback
    backgroundColor={STheme.color.background}
    style={{
     borderRadius: 8,
     overflow: "hidden",
     borderWidth: 1,
     borderBottomWidth: 2,
     borderColor: "#66666622",
    }}
   >
    <SView col={"xs-12"} row center  >
     {options.map(this.renderOption)}
    </SView>
   </SView>
  );
 }

 render() {
  return (<SView col={"xs-12"} flex center >
   {/* <SText>{JSON.stringify(this.props.data)}</SText> */}
   {this.renderBox()}
   {/* <SHr h={8} /> */}
  </SView >
  );
 }
}
export default (index);
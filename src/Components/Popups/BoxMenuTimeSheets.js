import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SHr, SIcon, SImage, SPage, SText, STheme, SView, SNavigation, SPopup, SLanguage, SList2, SButtom, SInput } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
export type BoxMenuTimeSheetsPropsType = {
 data: any,
 onPress?: (obj) => {},
}
class index extends Component<BoxMenuTimeSheetsPropsType> {
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
      <SIcon name={icon} height={18} fill={STheme.color.text} />
     </SView>
     <SView width={8} />
     <SView flex  >
      <SText fontSize={14}>{label}</SText>
     </SView>

    </SView>
    <SHr height={1} color={STheme.color.card} />
   </>
  );
 }

 renderBox() {
  const options = [
   // { label: SLanguage.select({ en: "See company", es: "Ver compania" }), icon: "icompany", url: "/company/profile", params: { pk: this.props.data?.key_company } },
   { label: SLanguage.select({ en: "See client", es: "Ver cliente" }), icon: "icliente", url: "/cliente/profile", params: { pk: this.props.data?.cliente.key } },
   { label: SLanguage.select({ en: "See event", es: "Ver evento" }), icon: "ievento", url: "/company/event", params: { key_evento: this.props.data?.evento.key } },
   {
    label: SLanguage.select({ en: "See user", es: "Ver usuario" }), icon: "iusuario", url: "/usuario/edit",params: { key_company: this.props.data?.key_company, pk: this.props.data?.usuario.key }
   },
   { label: SLanguage.select({ en: "See booking", es: "Ver booking" }), icon: "Eyes", url: "/staff/users", params: { pk: this.props.data?.staff.key } },
   // {
   //  label: SLanguage.select({ en: "See timeSheet", es: "Ver timeSheet" }), icon: "itimesheet", url: "/company/timeSheets", params: {
   //   key_company: this.props.data?.key_company,
   //   key_cliente: this.props.data?.cliente.key,
   //   key_evento: this.props.data?.evento.key
   //  }
   // },
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
     //  borderBottomWidth: 2,
     borderColor: "#66666699",
    }}
   >
    <SView col={"xs-12"} row center  >
     {options.map(this.renderOption)}
    </SView>
   </SView>
  );
 }

 render() {
  // console.log("si ", JSON.stringify(this.props.data.key_company))
  console.log("si ", JSON.stringify(this.props.data))
  return (<SView col={"xs-12"} flex center >
   {/* <SText>{JSON.stringify(this.props.data)}</SText> */}
   {this.renderBox()}
  </SView >
  );
 }
}
export default (index);
import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SInput, SNavigation, SNotification, SPage, SText, STheme, SThread, SView, SLanguage, SImage, SLoad, SGradient } from 'servisofts-component';
import PBarraFooter from '../Components/PBarraFooter';
import { Container } from '../Components';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import PButtom from '../Components/PButtom';
import Trabajos from '../Components/Trabajos';
import CardEvento from '../Components/Evento/CardEvento';
import MDL from '../MDL';


const Header = (props) => {

 return <SView col={"xs-12"} row >
  <SView col={"xs-6"}>
   <SText fontSize={18} bold language={{
    es: "Trabajos en curso",
    en: "Jobs in progress"
   }} />
  </SView>
  <SView col={"xs-6"} flex style={{ alignItems: "flex-end" }} center>
   <SView width={150} backgroundColor={STheme.color.secondary} padding={4} style={{
    borderRadius: 4,
    overflow: "hidden",
   }} row center onPress={() => {
    SNavigation.navigate("/history")
   }}>
    <SIcon name={"history"} fill={STheme.color.white} width={15} />
    <SView width={10} />
    <SText fontSize={10} color={STheme.color.white} language={{
     es: "VER HISTORIAL",
     en: "SEE HISTORY "
    }} />
   </SView>
  </SView>
 </SView>
}



export default class event_in_progress extends Component {
 constructor(props) {
  super(props);
  this.state = {
   secondDuration: 60
  };
 }


 onRecibeInvitation = null;
 componentDidMount() {
  this.loadData();
  this.onRecibeInvitation = MDL.evento.addEventListener("onRecibeInvitation", (e) => {
   this.loadData();
  });
 }
 componentWillUnmount() {
  MDL.evento.removeEventListener(this.onRecibeInvitation);
 }

 async loadData() {
  const key_usuario = Model.usuario.Action.getKey();
  const dataTrabajosProximos = await MDL.evento.getTrabajosProximos({ key_usuario: key_usuario });
  const dataInvitacionesPendientes = await MDL.evento.getInvitacionesPendientes({ key_usuario: key_usuario });
  const dataEventosBoss = await MDL.evento.getTrabajosProximosBoss({ key_usuario: key_usuario });
  let data = [
   ...dataTrabajosProximos,
   ...dataInvitacionesPendientes,
   // ...dataEventosBoss
  ];
  data.sort((a, b) => {
   if (!a?.staff?.fecha_inicio || !b?.staff?.fecha_inicio) return 0;
   const fi = new SDate(a?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
   const bi = new SDate(b?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
   return fi.getTime() - bi.getTime();
  })
  this.setState({
   data: data,
   load: true

  });
 }


 mensaje() {

  if (!this.state.load) return null;

  let verificador = this.state.data;

  if (!verificador || verificador.length === 0) return (<>
   <SView col={'xs-12'} center style={{ position: 'absolute' }}>

    <SView col={'xs-12'} center
     style={{
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: STheme.color.darkGray,
      overflow: 'hidden',
     }}>
     <SGradient colors={[STheme.color.accent, STheme.color.accent]} style={{ borderRadius: 16, }} />
     <SHr height={25} />
     <SText fontSize={28} center language={{
      es: "No tienes trabajo en curso en este momento",
      en: "You have no ongoing work at the moment"

     }} />
     <SHr height={35} />
     <SView width={140} height={140} center style={{
      borderRadius: 130,
      backgroundColor: STheme.color.white,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: STheme.color.primary,
     }}>
      <SIcon name={'noevent'} fill={STheme.color.primary} height={80} />
     </SView>
     <SHr height={35} />
     <SText fontSize={20} center language={{
      es: "Espera la invitación de una compañía",
      en: "Wait for an invitation from a company"
     }} />
     <SHr height={25} />
    </SView>
   </SView>
  </>);
 }

 render() {



  return <SPage titleLanguage={{ es: "", en: "" }} footer={<PBarraFooter url={'/event_in_progress'} />} disableScroll>
   <Container flex>
    <SHr h={10} />
    <Header />
    <SHr h={8} />

    <SView col={'xs-12'} center flex>

     {this.mensaje()}

     <FlatList
      style={{ width: "100%" }}
      data={this.state.data ?? []}
      ListHeaderComponent={() => <SHr h={32} />}
      ItemSeparatorComponent={() => <SHr h={32} />}
      ListFooterComponent={() => <SHr h={200} />}
      renderItem={({ item }) => {
       return <CardEvento data={item} onPress={() => {
        if (!item?.staff_usuario?.fecha_aprobacion_invitacion) {
         SNavigation.navigate("/invitationDetail", { key: item?.staff_usuario?.key })
         return;
        }
        SNavigation.navigate("/evento", { key: item?.evento?.key })
       }} />
      }} />
     {!this.state.load ? <SLoad /> : null}
    </SView>

   </Container>
  </SPage>
 }
}

import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SInput, SNavigation, SPage, SText, STheme, SView, SNotification, SLanguage, SHr, SIcon, SBuscador, SImage } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import MDL from '../../MDL';
import PButtom from '../../Components/PButtom';


const ItemImage = ({ src, label, onRemove }) => {
 return (
  <SView
   col={"xs-5"}
   style={{
    padding: 6,
    marginBottom: 8,
    height: 40,
    borderWidth: 1,
    borderColor: STheme.color.gray,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
   }}
  >
   <SView
    width={20}
    height={20}
    style={{
     borderRadius: 100,
     backgroundColor: STheme.color.card,
     overflow: "hidden",
     justifyContent: "center",
     alignItems: "center",
    }}
   >
    <SImage
     src={src}
     style={{
      width: "100%",
      height: "100%",
      resizeMode: "cover",
     }}
    />
   </SView>
   <SView width={4} />
   <SText fontSize={12} color={STheme.color.text}>
    {label}
   </SText>
   {!!onRemove && (
    <SView onPress={onRemove} style={{ marginLeft: 6 }}>
     <SIcon name="Close" width={10} height={10} fill={STheme.color.danger} />
    </SView>
   )}
  </SView>
 );
};






const Item = ({ data, onChange }) => {
 if (!data.descripcion) return null;
 const isChecked = !!data.staff_tipo_favorito;

 return (
  <>
   <SView col={"xs-12"} padding={10} row center style={{ height: isChecked ? "auto" : 40, overflow: "hidden" }}>
    <SView col={"xs-12"} row>
     <SView flex backgroundColor='transparent' onPress={() => { isChecked ? onChange(false) : onChange(true); }}>
      <SText fontSize={16} color={STheme.color.text}>{data.descripcion}</SText>
     </SView>
     <SView width={25} height={25} backgroundColor={!isChecked ? "transparent" : "#1F05B0"} border="white" style={{ borderRadius: 2, }} />
    </SView>
   </SView>
  </>
 );
};

const Item2 = ({ data, onChange }) => {
 if (!data.descripcion) return null;
 const isChecked = !!data.staff_tipo_favorito;

 return (
  <>
   <SView col={"xs-12 md-10"} center row style={{ height: 55, overflow: "hidden" }} backgroundColor='#2D2D2D' >
    <SView col={"xs-9.5"} center row   >
     <SView flex  >
      <SText fontSize={14} color={"#777777"} style={{ textAlign: 'right' }}> {SLanguage.select({ en: "Salary:", es: "Sueldo:" })} </SText>
     </SView>
     <SView flex center  >
      <SInput type="money" height={34} color={STheme.color.text} />
     </SView>
    </SView>

    <SView col={"xs-2.5"} center    >
     <SView width={50} height={16} center onPress={() => { }}>
      <PButtom small style={{ backgroundColor: "#5A5A5A", borderRadius: 2, }} fontSize={14} color={"#5A5A5A"} onPress={() => { }}> {SLanguage.select({ es: "Guardar", en: "Save" })} </PButtom>
     </SView>
    </SView>

   </SView>
  </>
 );
};

export default class staff_tipo_adm extends Component {
 constructor(props) {
  super(props);
  this.state = {
   key_usuario: SNavigation.getParam("key_usuario", Model.usuario.Action.getKey()),



  };
 }
 onChangeLanguage(language) {
  this.setState({ ...this.state })
 }
 componentDidMount() {
  SLanguage.addListener(this.onChangeLanguage.bind(this))
  SSocket.sendPromise({
   component: "staff_tipo",
   type: "getAll",
  }).then(e => {
   SSocket.sendPromise({
    component: "staff_tipo_favorito",
    type: "getAll",
    key_usuario: this.state.key_usuario
   }).then(b => {
    Object.values(b.data).map(a => {
     const st = Object.values(e.data).find(x => x.key == a.key_staff_tipo);
     if (st) {
      st.staff_tipo_favorito = a;
     }
    })
    this.setState({ data: e.data })
   }).catch(e => {

   })

  }).catch(e => {

  })
 }
 componentWillUnmount() {
  MDL.validaciones.componentDidMount();
  SLanguage.removeListener(this.onChangeLanguage)
 }

 render() {
  let lenguaje = SLanguage.language;
  const datafilter = SBuscador.filter({ data: this.state.data ?? {}, txt: this.state.filter })

  return <SPage title={"Staff Tipo"} disableScroll center>
   <SHr height={40} />
   <Container flex center>
    <SText col="xs-12" justify={true} fontSize={18} bold={true}> {(lenguaje === "es") ? "Seleccione las habilidades del staff:" : 'Select the staffs skills:'}</SText>
    <SHr height={20} />
    <SBuscador onChange={(e) => { this.setState({ filter: e }) }} />

    <FlatList
     data={Object.values(datafilter ?? {}).sort((a, b) => (a?.descripcion ?? "").toUpperCase() > (b?.descripcion ?? "").toUpperCase() ? 1 : -1)}
     contentContainerStyle={{ width: "100%", }}

     renderItem={({ item }) => {
      const isEmpty = !item.descripcion;

      return (
       <SView col={"xs-12"} style={{ padding: 10, height: isEmpty ? 0 : "auto" }} center row >
        <SView col={"xs-12 md-10"}>
         <SView
          style={{
           backgroundColor: STheme.color.card,
           borderTopRightRadius: 4,
           borderTopLeftRadius: 4,
           borderBottomRightRadius: !item.staff_tipo_favorito ? 4 : 0,
           borderBottomLeftRadius: !item.staff_tipo_favorito ? 4 : 0,
           padding: 4,
           elevation: 3,
           shadowColor: "#000",
           shadowOffset: { width: 0, height: 2 },
           shadowOpacity: 0.2,
           shadowRadius: 4,
           height: isEmpty ? 50 : "auto",
          }}
         >
          <Item col={"xs-12 "} row center
           data={item}
           onChange={(bol) => {
            this.setState((prevState) => {
             const updatedData = { ...prevState.data };
             updatedData[item.key].staff_tipo_favorito = bol ? true : false;
             return { data: updatedData };
            });

            if (bol) {
             SSocket.sendPromise({
              component: "staff_tipo_favorito",
              type: "registro",
              data: {
               key_usuario: this.state.key_usuario,
               key_staff_tipo: item.key,
              },
              key_usuario: Model.usuario.Action.getKey(),
             })
              .then((e) => {
               item.staff_tipo_favorito = e.data;
               SNotification.send({
                title: lenguaje === "es" ? "Éxito" : "Success",
                body: lenguaje === "es" ? "Se guardaron los cambios" : "Changes saved",
                time: 5000,
                color: STheme.color.success,
               });
              })
              .catch((e) => {
               SNotification.send({
                title: lenguaje === "es" ? "Error" : "Error",
                body: e.error ?? (lenguaje === "es" ? "Error desconocido" : "Unknown error"),
                time: 5000,
                color: STheme.color.danger,
               });
              });
            } else {
             SSocket.sendPromise({
              component: "staff_tipo_favorito",
              type: "editar",
              data: {
               key: item.staff_tipo_favorito.key,
               estado: 0,
              },
              key_usuario: Model.usuario.Action.getKey(),
             })
              .then((e) => {
               delete item.staff_tipo_favorito;
               SNotification.send({
                title: lenguaje === "es" ? "Éxito" : "Success",
                body: lenguaje === "es" ? "Se guardaron los cambios" : "Changes saved",
                time: 5000,
                color: STheme.color.success,
               });
              })
              .catch((e) => {
               SNotification.send({
                title: lenguaje === "es" ? "Error" : "Error",
                body: e.error ?? (lenguaje === "es" ? "Error desconocido" : "Unknown error"),
                time: 5000,
                color: STheme.color.danger,
               });
              });
            }
           }}
          />
         </SView>
        </SView>
        {item.staff_tipo_favorito ? <Item2 data={item} ></Item2> : null}
       </SView>)
     }
     }
    />

    <SView style={{
     position: "absolute",
     right: 8,
     bottom: 8,
     height: 50
    }} onPress={() => {

     let select = Object.values(datafilter).filter(e => e.staff_tipo_favorito).length;
     if (select <= 0) {
      SNotification.send({
       title: "Error",
       body: SLanguage.select({
        en: "Please select at least one staff type",
        es: "Por favor selecciona al menos un tipo de staff"
       }),
       // body: "Please select at least one staff type",
       color: STheme.color.danger,
      })
      return;
     }
     SNavigation.goBack()
    }}>
     <SIcon name={'next2'} fill={STheme.color.text} style={{ width: 50, height: 50 }} />
    </SView>
   </Container>
  </SPage >
 }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SNavigation, SPage, SText, SView, STheme, SForm, SPopup, SImage, SLoad, SStorage, SButtom, SIcon, SWebView, STable2, SMath, SDate, SList, SLanguage, SThread } from 'servisofts-component';
import { WebView } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
// import { PButtom } from '../../Components';
import PButtom from '../../Components/PButtom';
import InputFloat from '../../Components/NuevoInputs/InputFloat';
// import usuario_dato from '../../Model/tapeke/usuario_dato';
import InputSelect from "../../Components/NuevoInputs/InputSelect"
import PBarraFooter from '../../Components/PBarraFooter';

class index extends Component {
 constructor(props) {
  super(props);
  this.state = {};
 }

 onChangeLanguage(language) {
  this.setState({ ...this.state })
 }
 componentDidMount() {
  SLanguage.addListener(this.onChangeLanguage.bind(this))
 }
 componentWillUnmount() {
  SLanguage.removeListener(this.onChangeLanguage)
 }


 load_data() {
  this.data = Model.usuario.Action.getUsuarioLog();
  return this.data;
 }

 getForm() {
  if (!this.load_data()) return <SLoad />
  // var isApi = this.data.gmail_key || this.data.facebook_key

  // VALIDANDO IDIOMA FORMULARIO
  let lenguaje = SLanguage.language;
  let nombres = "Nombres";
  let apellidos = "Apellidos";
  let correo = "Correo electrónico";
  let telefono = "Teléfono";
  let nivel_ingles = "Nivel de inglés";
  let papeles = "¿Está autorizado para trabajar en los Estados Unidos?";
  let mensaje1 = "Por favor completa toda la información solicitada en el formulario para que podamos enviarte las ofertas de trabajo. Si no proporciona esta información, es posible que no podamos compartir las oportunidades disponibles con usted (subir foto de perfil nítida en la que se vea claramente tu rostro)."

  if (lenguaje == "en") {
   nombres = "Names";
   apellidos = "Last names";
   telefono = "Phone";
   nivel_ingles = "English level";
   papeles = "Are you authorized to work in the United States?";
   correo = "Email";
   mensaje1 = "Please complete all the information requested in the form so that we can send you job offers. If you do not provide this information, we may not be able to share the available opportunities with you (upload a clear profile photo showing your face clearly)."

  }

  //VERFICANDO SI FORMULARIO ESTÁ COMPLETO
  if (!this.data.Nombres || !this.data.Apellidos || !this.data.Correo || !this.data.Telefono || !this.data.nivel_ingles || !this.data.papeles) {

   SPopup.alert(mensaje1)

   // SNavigation.goBack();
  }



  console.log((SSocket.api.root + "usuario/" + this.data?.key) + " fff")
  console.log(this.data)
  return <SForm
   ref={(ref) => { this.form = ref; }}
   style={{
    alignItems: "center",
   }}
   inputProps={{
    col: "xs-12",
    separation: 12
   }}
   inputs={{
    foto_p: { type: "image", placeholder: "Foto", isRequired: true, defaultValue: SSocket.api.root + "usuario/" + this.data?.key + "?date=" + new Date().getTime(), col: "xs-4", style: { borderRadius: 100, overflow: 'hidden', width: 140, height: 140, borderWidth: 1, borderColor: STheme.color.lightGray, alignItems: "center", } },
    Nombres: {
     placeholder: SLanguage.select({ es: "Nombres", en: "First Name" }),
     label: SLanguage.select({ es: "Nombres", en: "First Name" }),
     isRequired: true,
     defaultValue: this.data.Nombres,
     icon: <SIcon name={'InputUser'} fill={STheme.color.text} width={20} height={20} />,
     height: 54
    },
    Apellidos: {
     placeholder: SLanguage.select({ es: "Apellidos", en: "Last Name" }),
     label: SLanguage.select({ es: "Apellidos", en: "Last Name" }),
     isRequired: true,
     defaultValue: this.data.Apellidos,
     icon: <SIcon name={'InputUser'} fill={STheme.color.text} width={20} height={20} />,
     height: 54
    },
    fecha_nacimiento: { label: SLanguage.select({ es: "Fecha de nacimiento", en: "Date of Birth" }), isRequired: true, placeholder: SLanguage.select({ es: "Fecha de nacimiento", en: "Date of Birth" }), defaultValue: this.data.fecha_nacimiento, type: "date", },
    estado_civil: {
     label: SLanguage.select({ es: "Estado civil", en: "Marital Status" }),
     placeholder: SLanguage.select({ es: "Estado civil", en: "Marital Status" }),
     // type: "select",
     isRequired: true,
     defaultValue: "",
     editable: false,
     defaultValue: this.data.estado_civil,
     onPress: e => {
      InputFloat.open({
       e: e,
       height: 180,
       width: 150,
       style: {
        backgroundColor: STheme.color.background
       },
       render: () => {
        return <SView col={"xs-12"} flex card>
         <InputSelect
          data={["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED", "OTHER"]}
          defaultValue={this.data.estado_civil}
          onChange={val => {
           this.form.setValues({ "estado_civil": val })
          }}
          ITEM_HEIGHT={30} />
        </SView>
       }
      })
     }
     // icon: this.icon("InputEmail"),
     // options: [{ key: "", content: (lenguaje == "en") ? "SELECT" : "SELECCIONAR" },
     // { key: "NONE", content: (lenguaje == "en") ? "NONE" : "NINGUNO" }, { key: "BASIC", content: (lenguaje == "en") ? "BASIC" : "BASICO" }, { key: "MEDIUM", content: (lenguaje == "en") ? "MEDIUM" : "MEDIO" }, { key: "ADVANCED", content: (lenguaje == "en") ? "ADVANCED" : "AVANZADO" }]
    },
    // "employee_number": {
    //  placeholder: SLanguage.select({ es: "Número de empleado", en: "Employee number" }),
    //  label: SLanguage.select({ es: "Número de empleado", en: "Employee number" }),
    //  defaultValue: this.data['employee_number'],
    //  //type: 'phone',
    //  //isRequired: true,
    //  height: 54
    // },
    // "salario_hora": {
    //  placeholder: SLanguage.select({ es: "Salario", en: "Salary" }),
    //  label: SLanguage.select({ es: "Salario", en: "Salary" }),
    //  defaultValue: this.data['salario_hora'],
    //  //type: 'phone',
    //  //isRequired: true,
    //  height: 54
    // },
    "Telefono": {
     placeholder: SLanguage.select({ es: "Teléfono", en: "Phone" }),
     label: SLanguage.select({ es: "Teléfono", en: "Phone" }),
     defaultValue: this.data['Telefono'],
     type: 'phone',
     isRequired: true,
     height: 54
    },
    Correo: {
     placeholder: SLanguage.select({ es: "Correo electrónico", en: "Email" }),
     label: SLanguage.select({ es: "Correo electrónico", en: "Email" }),
     type: 'email',
     isRequired: true,
     defaultValue: this.data.Correo,
     icon: <SIcon name={'InputEmail'} fill={STheme.color.text} width={20} height={30} />,
     height: 54
    },
    direccion: {
     label: SLanguage.select({ es: "Dirección de domicilio", en: "Home Address" }), isRequired: true, placeholder: SLanguage.select({ es: "Dirección de domicilio", en: "Home Address" }), defaultValue: this.data.direccion,
    },
    nivel_ingles: {
     placeholder: SLanguage.select({ es: "Nivel de inglés", en: "English level" }),
     label: nivel_ingles,
     // type: "select",
     isRequired: true,
     defaultValue: this.data.nivel_ingles,
     editable: false,
     onPress: e => {
      InputFloat.open({
       e: e,
       height: 180,
       width: 150,
       style: {
        backgroundColor: STheme.color.background
       },
       render: () => {
        return <SView col={"xs-12"} flex card>
         <InputSelect
          defaultValue={this.data.nivel_ingles}
          data={["NONE", "BASIC", "MEDIUM", "ADVANCED"]}
          onChange={val => {
           this.form.setValues({ "nivel_ingles": val })
          }}
          ITEM_HEIGHT={30} />
        </SView>
       }
      })
     }
    },
    otros_idiomas: {
     label: SLanguage.select({ es: "Idiomas que habla", en: "Languages Spoken" }), isRequired: true, placeholder: SLanguage.select({ es: "Idiomas que habla", en: "Languages Spoken" }), defaultValue: this.data.otros_idiomas,
    },
    papeles: {
     placeholder: papeles,
     label: papeles,
     type: 'checkBox',
     // options: [{ key: "", content: (lenguaje == "en") ? "SELECT" : "SELECCIONAR" }, { key: "YES", content: (lenguaje == "en") ? "YES" : "SI" }, { key: "NO", content: "NO" }],
     // isRequired: true,
     defaultValue: this.data.papeles ? this.data.papeles != "false" : false,
     // icon: <SIcon name={'InputUser'} fill={STheme.color.text} width={20} height={20} />,
     height: 54
    },

    // ...(isApi ? {} : {
    //     Password: { label: "Contraseña", type: "password", isRequired: true, defaultValue: this.data.Password, icon: <SIcon name={"InputPassword"} width={40} height={30} /> },
    //     RepPassword: { label: "Repetir contraseña", type: "password", isRequired: true, defaultValue: this.data.Password, icon: <SIcon name={"InputRePassword"} width={40} height={30} /> }
    // }),
   }}
   onSubmit={(values) => {
    var finalObj = {
     ...this.data,
     ...values
    }
    this.form.uploadFiles(Model.usuario._get_image_upload_path(SSocket.api, this.data.key), "foto_p");
    Model.usuario.Action.editar({
     data: finalObj,
     key_usuario: Model.usuario.Action.getKey()
    }).then((resp) => {
     SStorage.setItem("usr_log", JSON.stringify(finalObj)) //Modificar SStorage datos session
     // Model.usuario.Action.CLEAR(); //Limpiar caché
     Model.usuario.Action.syncUserLog()
     SNavigation.goBack();
    }).catch((e) => {
     SPopup.alert("Error en los datos");
    })
   }}
  />
 }

 alertError(error, icono, mensaje) {
  return <SView col={"xs-12 md-8 xl-6"} row style={{ height: 250, borderRadius: 8, }} backgroundColor={STheme.color.background} center>
   <SView col={"xs-11"}  >
    <SView height={30}></SView>
    <SIcon name={"UserAlert"} height={100} />
   </SView>
   <SView col={"xs-11"} center  >
    <SText color={STheme.color.darkGray} style={{ fontSize: 20, fontWeight: "bold" }}>{mensaje} existente</SText>
    <SText color={STheme.color.darkGray} style={{ fontSize: 15 }}>El {mensaje} que ingresó ya está asociado a una cuenta activa.</SText>
    <SView height={30}></SView>
   </SView>
  </SView>
 }

 alertErrorPassword() {
  return <SView col={"xs-11 md-8 xl-6"} row center style={{ height: 250, borderRadius: 8, }} backgroundColor={STheme.color.background} >
   <SView col={"xs-11"} height={40} />
   <SView col={"xs-11"}  >
    <SIcon name={"InputPassword"} height={100} fill={STheme.color.primary} />
   </SView>
   <SView col={"xs-11"} height={15} />
   <SView col={"xs-12"} center  >
    <SText center color={STheme.color.darkGray} style={{ fontSize: 18, fontWeight: "bold" }}>Las contraseñas no coinciden</SText>
   </SView>
   <SView col={"xs-11"} height={30} />
  </SView>
 }

 render() {

  return (
   <>
    <SPage titleLanguage={{ es: "Editar perfil", en: "Edit profile" }} onRefresh={() => {
     Model.usuario.Action.CLEAR();
    }}
     footer={<PBarraFooter url={'/login'} />}>
     <SView center>
      <SView col={"xs-11 md-6 xl-4"} center>
       <SView height={16} />
       {/* <SView col={"xs-12"} center>
                            <SText color={"#DE5738"} fontSize={18} >MIS DATOS</SText>
                        </SView> */}
       {this.getForm()}
       <SView height={5} />
       {/* aptitud */}
       <SView row style={{ alignItems: "flex-end", maxWidth: "350px" }} card padding={15} onPress={() => {
        SNavigation.navigate("/perfil/staff_tipo")
       }}>
        <SIcon name={"aptitud"} fill={STheme.color.text} width={20} height={20} />
        <SView width={10} />
        <SText flex fontSize={15} color={STheme.color.text} language={{
         es: "EDITAR MIS APTITUDES O EXPERIENCIAS",
         en: "EDIT MY SKILLS OR EXPERIENCES"
        }} />
       </SView>
       <SView height={26} />

       <SView col={"xs-12"} row center>
        <PButtom rojo fontSize={20} onPress={() => {
         this.form.submit();
        }}>
         <SText fontSize={20} color={STheme.color.white} language={{
          es: "CONFIRMAR",
          en: "CONFIRM"
         }} />
        </PButtom>
       </SView>
       <SHr height={30} />
       <SView
        row
        col={'xs-12'}
        center
        style={{
         borderBottomWidth: 2,
         borderBottomColor: STheme.color.card
        }}></SView>
       <SHr height={30} />
       {/* <PButtom rojo fontSize={20} onPress={() => {
                                SNavigation.navigate("/perfil/staff_tipo")
                            }}><SText center fontSize={15} color={STheme.color.white} language={{
                                es: "EDITAR MIS APTITUDES O EXPERIENCIAS",
                                en: "EDIT MY SKILLS OR EXPERIENCES"
                            }} /></PButtom> */}
       {/* <SView height={15} /> */}
       <PButtom rojo fontSize={20} onPress={() => {
        SNavigation.navigate("/perfil/changepass")
       }}><SText fontSize={20} color={STheme.color.white} language={{
        es: "CAMBIAR CONTRASEÑA",
        en: "CHANGE PASSWORD"
       }} /></PButtom>
       <SView height={15} />

       {/* <PButtom secondary fontSize={20} onPress={() => {
                                SNavigation.navigate("/perfil/eliminar")
                            }}><SText fontSize={20} color={STheme.color.text} language={{
                                es: "ELIMINAR CUENTA",
                                en: "DELETE ACCOUNT"
                            }} /></PButtom> */}
       <SView height={96} />

      </SView>
      {/* <RolDeUsuario data={this.data} /> */}
     </SView>
    </SPage>
   </>
  );
 }
}
const initStates = (state) => {
 return { state }
};
export default connect(initStates)(index);
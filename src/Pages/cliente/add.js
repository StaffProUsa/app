import React from "react";
import { SForm, SHr, SInput, SNavigation, SPage, SText, SThread, SLanguage, STheme, SButtom, SNotification, SLoad } from "servisofts-component";
import { Container } from "../../Components";
import SSocket from "servisofts-socket";
import Model from "../../Model";
import PBarraFooter from "../../Components/PBarraFooter";

export default class index extends React.Component {
   state = {}
   pk = SNavigation.getParam("pk");
   key_company = SNavigation.getParam("key_company");
   onChangeLanguage(language) {
      this.setState({ ...this.state })
   }
   componentDidMount() {
      SLanguage.addListener(this.onChangeLanguage.bind(this))
      if (this.pk) {
         SSocket.sendPromise({
            component: "cliente",
            type: "getByKey",
            estado: "cargando",
            key: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
         }).then(e => {
            // Model.cliente.Action._dispatch(e);
            this.setState({
               data: e.data
            })

            // SNavigation.goBack();
            // SNavigation.replace("/cliente/profile", { pk: e?.data?.key })
            console.log(e);
         }).catch(e => {
            console.log(e);
         })
      }
   }
   componentWillUnmount() {
      SLanguage.removeListener(this.onChangeLanguage)
   }
   render() {
      let lenguaje = SLanguage.language;
      let descripcion = "Nombre del cliente *";
      let nivel_ingles = "Nivel de inglés";
      let papeles = "¿Requiere solo con papeles?";
      let observacion = "Información y requerimientos del cliente";
      let direccion = "Dirección";
      if (lenguaje == "en") {
         descripcion = "Client name *";
         nivel_ingles = "English level";
         papeles = "Requires only with papers?";
         observacion = "Client information and requirements";
         direccion = "Address";
      }
      const OBSDEFAULT = SLanguage.select({
         en: `
In this space, you will find all the requirements that the client has requested for the project. 📝 It is important to carefully review every detail, as this outlines all the needs and expectations we must meet to ensure an optimal outcome. 🎯

Remember that any modifications or updates will be communicated through this section, so we always stay aligned with the client's expectations. 🛠️

👉 Please keep this space updated at all times and make sure to review the requirements before starting any task.

Thank you for your collaboration! 😊
            `,
         es: `
En este espacio, podrás encontrar todos los requerimientos que el cliente ha solicitado para el proyecto. 📝 Es importante que revises cada detalle cuidadosamente, ya que aquí se plasman todas las necesidades y expectativas que debemos cumplir para garantizar un resultado óptimo. 🎯

Recuerda que cualquier modificación o actualización será comunicada a través de este mismo apartado, para que siempre estemos alineados con lo que el cliente espera. 🛠️

👉 Por favor, mantén este espacio siempre actualizado y asegúrate de verificar los requerimientos antes de iniciar cualquier tarea.

¡Gracias por tu colaboración! 😊
                            `
      })
      return <SPage titleLanguage={{
         es: "Nuevo cliente",
         en: "New client"
      }} footer={<PBarraFooter url={'/company'} />}>
         <SHr height={20} />
         <Container loading={(this.pk && !this.state.data)}>
            <SForm
               row
               ref={(formInstance: SForm) => {
                  this.form = formInstance;

                  new SThread(100, "asd").start(() => {
                     if (formInstance) formInstance.focus("Nombres")
                  })
               }}
               style={{
                  justifyContent: "space-between",
               }}
               inputs={{
                  "foto_p": { type: "image", isRequired: false, defaultValue: `${SSocket.api.root}cliente/${this.pk}?time=${new Date().getTime()}`, col: "xs-12 sm-3.5 md-3 lg-2.5 xl-2.5", style: { borderRadius: 8, overflow: 'hidden', width: 130, height: 130, borderWidth: 0 } },
                  "descripcion": { col: "xs-12 sm-7", label: SLanguage.select({ es: "Nombre de cliente", en: "Client name" }), required: true, defaultValue: this.state?.data?.descripcion },
                  "contacto": { col: "xs-12 sm-7", label: SLanguage.select({ es: "Nombre de contacto", en: "Contact name" }), required: false, defaultValue: this.state?.data?.contacto },
                  "telefono": { col: "xs-12 sm-4.5", label: SLanguage.select({ es: "Número de teléfono", en: "Phone Number" }), type: "phone", required: false, defaultValue: (this.state?.data?.telefono) ? this.state?.data?.telefono : "+1 " },
                  // "direccion": { col: "xs-7", label: SLanguage.select({es:"Dirección", en:"Address"}), required: true, defaultValue: this.state?.data?.direccion },

                  // "nivel_ingles": { col: "xs-5.5", type: "select", label: nivel_ingles, defaultValue: this.state?.data?.nivel_ingles,options: [{ key: "", content: (lenguaje == "en") ? "SELECT" : "SELECCIONAR" }, { key: "NONE", content:  (lenguaje == "en") ? "NONE" :"NINGUNO" }, { key: "BASIC", content: (lenguaje == "en") ? "BASIC" : "BASICO" }, { key: "MEDIUM", content: (lenguaje == "en") ? "MEDIUM" : "MEDIO" }, { key: "ADVANCED", content: (lenguaje == "en") ? "ADVANCED" : "AVANZADO" }], },
                  "papeles": { col: "xs-5.5", type: "checkBox", label: papeles, defaultValue: (this.state?.data?.papeles) },
                  "observacion": {
                     col: "xs-12", type: "textArea", height: 400, label: observacion, defaultValue: (this.state?.data?.observacion) ? this.state?.data?.observacion : OBSDEFAULT,
                  },
                  "direccion": {
                     col: "xs-12", type: "text", label: SLanguage.select({ es: "Dirección", en: "Address" }), defaultValue: this.state?.data?.direccion,
                     onPress: () => {
                        SNavigation.navigate("/cliente/select", {
                           latitude: this.direccion?.latitude ?? this.state?.data?.latitude,
                           longitude: this.direccion?.longitude ?? this.state?.data?.longitude,
                           direccion: this.direccion?.direccion ?? this.state?.data?.direccion,
                           onSelect: (resp) => {
                              SNavigation.goBack();
                              this.form.setValues({ direccion: resp.direccion })
                              this.direccion = resp;
                              // this.form.setValue("Direccion", e?.descripcion)
                              console.log("datos dirección");
                              console.log(resp);
                           }
                        })
                     }
                  },
                  // "Apellidos": { col: "xs-5.8", label: "Apellidos" },
                  // "CI": { col: "xs-5.8", label: "Numero de identidad", placeholder: "_ _ _ _ _ _ _" },
                  // "Correo": { col: "xs-9.5", type: "email", label: "Correo", placeholder: "correo@example.com" },
                  // "Telefono": { col: "xs-5.8", type: "telefono", label: "Telefono", defaultValue: "+1 " },
               }} onSubmit={(val) => {

                  if (this.state.loading) {
                     return;
                  }
                  this.setState({ loading: true })

                  if (this.direccion) {
                     val.latitude = this.direccion.latitude
                     val.longitude = this.direccion.longitude
                  }
                  SNotification.send({
                     key: "loading",
                     title: "Please wait.",
                     body: "...",
                     type: "loading"
                  })

                  if (this.pk) {

                     this.form.uploadFiles(Model.cliente._get_image_upload_path(SSocket.api, this.state.data.key), "foto_p");
                     SSocket.sendPromise({
                        component: "cliente",
                        type: "editar",
                        estado: "cargando",
                        data: {
                           ...this.state.data,
                           ...val,
                           papeles: !val.papeles ? false : true
                        },
                        key_usuario: Model.usuario.Action.getKey(),
                     }).then(e => {
                        this.setState({ loading: false })

                        SNotification.remove("loading")
                        Model.cliente.Action._dispatch(e);
                        // SNavigation.goBack();
                        SNavigation.replace("/cliente/profile", { pk: e?.data?.key })
                        console.log(e);
                     }).catch(e => {
                        this.setState({ loading: false })

                        SNotification.remove("loading")
                        console.log(e);
                     })
                  } else {
                     if (this.key_company) {
                        val.key_company = this.key_company;
                     }
                     // this.form.uploadFiles(
                     //     SSocket.api.root + 'upload/' + actividad.component + '/' + e.data.key
                     //   );
                     SSocket.sendPromise({
                        component: "cliente",
                        type: "registro",
                        estado: "cargando",
                        data: {
                           ...val, papeles: !val.papeles ? false : true
                        },
                        key_usuario: Model.usuario.Action.getKey(),
                     }).then(e => {
                        this.setState({ loading: false })

                        SNotification.remove("loading")
                        this.form.uploadFiles(Model.cliente._get_image_upload_path(SSocket.api, e?.data?.key), "foto_p");
                        Model.cliente.Action._dispatch(e);
                        // SNavigation.goBack();
                        SNavigation.replace("/cliente/profile", { pk: e?.data?.key })
                        console.log(e);
                     }).catch(e => {
                        this.setState({ loading: false })
                        SNotification.remove("loading")
                        console.log(e);

                     })
                  }

               }}

            // onSubmitName={"SAVE"}
            />
            <SButtom onPress={() => {
               this.form.submit();
            }} type='secondary'>
               {this.state.loading ? <SLoad /> : <SText color={STheme.color.white} language={{ es: "GUARDAR", en: "SAVE" }} />}


            </SButtom>
         </Container>
         <SHr height={105} />
      </SPage>;
   }
}
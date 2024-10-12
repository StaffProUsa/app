import React from 'react';
import { SGradient, SHr, SIcon, SImage, SPage, SText, STheme, SView, SLanguage, SNavigation, SDate, SLoad, SStorage, SNotification } from 'servisofts-component';

// import PBarraFooter from '../Components/PBarraFooter';
import { Btn, Container } from '../../Components';
import Model from '../../Model';
// import usuarios from './rol/profile/usuarios';
import SSocket from 'servisofts-socket';

export default class root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: {},
      empresa: "Sofia"
    };
    // this.key_company = "";
    // this.key_company = SNavigation.getParam("key_company");
    // this.key_company = "d62fafb2-7b7d-4125-bd6c-568d72f92431"
    // this.key_company = SStorage.getItem("key_company") ?? "";

    let ki = SNavigation.getParam("pk")

    let key_inv = ki.replace(/^"|"$/g, "");

    this.key_invitacion = key_inv;
    // this.key_invitacion = SNavigation.getParam("pk");
    // this.key_invitacion = "d62fafb2-7b7d-4125-bd6c-568d72f92431"
  }
  componentDidMount() {
    let usuario_ = Model.usuario.Action.getUsuarioLog();
    if (this.key_invitacion) {

      console.log("key_invitacion", this.key_invitacion)


      if (!usuario_) {//verificar si el usuario esta logeado
        //   SSocket.sendPromise({
        //     component: "invitacion",
        //     type: "getByKey",
        //     key: this.key_invitacion
        //   }).then(e => {
        //     console.log("invitacion sin loguin")
        //     console.log(e.data)
        //     if (Object.keys(e.data).length === 0) {
        //       return SNavigation.navigate("/")
        //     }
        SStorage.setItem("key_invitacion", this.key_invitacion) // Guardar la empresa en el storage
        //     this.setState({ dataInvitacion: e.data })
        //     // let invitacion = Object.values(e.data).filter(e => e.estado > 0 && e.key == this.key_invitacion);
        //     // console.log(invitacion[0])

        //     // rol = roles_partner[0].key;
        //     // this.setState({ roles: rol })



        //   }).catch(e => {
        //     console.error(e);

        //   })
        //   // SStorage.setItem("key_company", JSON.stringify(this.state?.dataInvitacion?.key_company)) // Guardar la empresa en el storage
        return SNavigation.replace('/login');
      }
      this.setState({ usuario: usuario_ })


      SSocket.sendPromise({
        component: "invitacion",
        type: "getByKey",
        key: this.key_invitacion
      }).then(e => {
        console.log("invitacion")
        console.log(e.data)
        if (Object.keys(e.data).length === 0) {
          return SNavigation.navigate("/")
        }
        this.setState({ dataInvitacion: e.data })
        // let invitacion = Object.values(e.data).filter(e => e.estado > 0 && e.key == this.key_invitacion);
        // console.log(invitacion[0])

        // rol = roles_partner[0].key;
        // this.setState({ roles: rol })

        // SStorage.setItem("key_company", JSON.stringify(this.key_company)) // Guardar la empresa en el storage

        console.log("this.state?.dataInvitacion")
        console.log(this.state?.dataInvitacion)

        SSocket.sendPromise({//obtener ususarios de la empresa
          component: "usuario_company",
          type: "getAll",
          key_company: e.data?.key_company
        }).then(f => {
          console.log("aqui")
          console.log(f.data)
          // let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))];

          let esUsuarioCompany = Object.values(f.data).some(//verificar si el usuario ya esta en la empresa
            (entry) => entry.key_usuario === usuario_.key
          );

          if (esUsuarioCompany) {
            console.log("usuario ya esta en la empresa")
            return SNavigation.navigate("/")
          }

          SSocket.sendPromise({
            service: "roles_permisos",
            component: "rol",
            type: "getAll",
          }).then(g => {
            console.log("roles")
            console.log(g.data)
            let roles_partner = Object.values(g.data).filter(e => e.estado > 0 && e.tipo == "company" && e.descripcion == "Staff").sort((a, b) => a.index > b.index ? 1 : -1);
            console.log(roles_partner[0])

            rol = roles_partner[0].key;
            this.setState({ roles: rol })

          }).catch(e => {

          })

        }).catch(e => {
          console.error(e);
        })

      }).catch(e => {
        console.error(e);

      })
      // console.log("key_company", this.state.dataInvitacion?.key_company)
    }







    // SSocket.sendPromise({
    //   component: "company",
    //   type: "getAll",
    // }).then(e => {
    //   this.setState({ dataCompany: e.data[this.state.dataCompany?.key_company] })
    // }).catch(e => {
    //   console.error(e);
    // })
  }

  hanldeGuardar(myusuario) {

    const usuario = myusuario ?? {};
    if (!usuario.key) {
      const usuarioNuevo = {
        Nombres: myusuario?.Nombres,
        Apellidos: myusuario?.Apellidos,
        Telefono: myusuario?.Telefono,
        Correo: myusuario?.Correo,
      }
      if (!usuarioNuevo.Nombres) {
        SNotification.send({
          title: "Datos incompletos.",
          body: "Debe ingresar mínimamente el nombre",
          time: 5000,
          color: STheme.color.warning,
        })
        return;
      }

      SNotification.send({
        key: "registroUsuario",
        title: "Registrando usuario",
        body: "Por favor espere...",
        type: "loading"
        // time: 5000,
        // color: STheme.color.warning,
      })
      SSocket.sendPromise({
        service: "usuario",
        version: "2.0",
        component: "usuario",
        type: "registro",
        cabecera: "usuario_app",
        estado: "cargando",
        data: {
          ...usuarioNuevo
        },
      }).then(e => {
        SNotification.remove("registroUsuario")
        Model.usuario.Action._dispatch(e);


        const user = e.data;

        this.handleGuardarStep2(user, this.state.roles)
        // SNavigation.goBack();
        // SNavigation.replace("/usuario/profile", { pk: e?.data?.key })
        console.log(e);
      }).catch(e => {
        SNotification.remove("registroUsuario")
        console.log(e);
      })
      return;
    } else {
      this.handleGuardarStep2(usuario, this.state.roles)
    }


  }

  handleGuardarStep2(usuario, rol) {
    console.log("rolrol");
    console.log(rol);
    if (!this.key) {
      SSocket.sendPromise({
        component: "usuario_company",
        type: "registro",
        key_usuario: Model.usuario.Action.getKey(),
        data: {
          key_usuario: usuario.key,
          key_company: this.state?.dataInvitacion?.key_company,
          key_rol: rol
        }
      }).then(e => {
        SNotification.send({
          title: "Nuevo usuario",
          body: "Usuario agregado con éxito",
          time: 5000,
          color: STheme.color.success,
        })
        if (root.INSTANCE) {
          root.INSTANCE.reload()
        }
        // SNavigation.goBack();
        SNavigation.replace("/perfil/staff_tipo")
      }).catch(e => {
        if (e.error == "existe") {
          SNotification.send({
            title: "El usuario ya se encuentra registrado.",
            body: "No puede registrar 2 veces a un mismo usuario.",
            time: 5000,
            color: STheme.color.danger,
          })
          return;
        }
        SNotification.send({
          title: "No pudimos agregar al usuario.",
          body: "Ocurrio un error al agregar al usuario, intente nuevamente.",
          time: 5000,
          color: STheme.color.danger,
        })
      })
    } else {
      SSocket.sendPromise({
        component: "usuario_company",
        type: "editar",
        key_usuario: Model.usuario.Action.getKey(),
        data: {
          key: this.key,
          key_rol: rol
        }
      }).then(e => {
        SNotification.send({
          title: "Editar usuario",
          body: "Usuario editado con éxito",
          time: 5000,
          color: STheme.color.success,
        })
        if (root.INSTANCE) {
          root.INSTANCE.reload()
        }
        SNavigation.goBack();
      }).catch(e => {
        SNotification.send({
          title: "No pudimos editar al usuario.",
          body: "Ocurrio un error al editar al usuario, intente nuevamente.",
          time: 5000,
          color: STheme.color.danger,
        })
      })
    }
  }

  render() {
    // console.log(this.state.usuario)
    // console.log(this.state.data)
    // let obj = {this.state.data};
    console.log("dataUsuCompany")
    console.log(this.state.dataUsuCompany)
    console.log(this.state.usuario)
    let usuario = this.state.usuario;
    let company = this.state.dataCompany;

    return (
      <>
        <SPage titleLanguage={{ es: "Invitación Staff", en: "Invitation Staff" }}  >
          <SView col={'xs-12'} >
            <SHr height={25} />
            <Container >
              <SView col={'xs-12'} row center>
                <SView col={'xs-6'} >
                  <SText fontSize={18} language={{
                    es: "Hola " + usuario?.Nombres + " " + usuario?.Apellidos + "!",
                    en: "Hi " + usuario?.Nombres + " " + usuario?.Apellidos + "!"
                  }} />
                  <SText></SText>
                </SView>
                <SView col={'xs-6'} flex style={{ alignItems: "flex-end" }}>
                  <SView height={80} width={80} style={{ borderRadius: 50, backgroundColor: STheme.color.secondary }} center   >
                    <SImage enablePreview src={SSocket.api.root + "company/" + this.state?.dataInvitacion?.key_company} width={100} height={100} style={{ resizeMode: 'cover', borderRadius: 50 }} />
                    {/* <SIcon name={"Logo"} fill={STheme.color.primary} width={60} height={60} /> */}
                  </SView>
                </SView>
              </SView>
              <SHr height={15} />
            </Container>
            <SView col={'xs-12'} center backgroundColor={STheme.color.secondary} padding={15}>
              {/* <SText fontSize={22} color={STheme.color.text} language={{
                es: "¡Te invitamos a ser parte de " + company?.descripcion + "!",
                en: "We invite you to be part of Staff Pro USA!"
              }} /> */}
              <SText fontSize={22} color={STheme.color.text} >{this.state?.dataInvitacion?.descripcion}</SText>
            </SView>
            <SHr height={30} />
            <Container>
              <SView col={'xs-11'} center>
                <SHr height={25} />
                <SView style={{
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: STheme.color.warning,
                  padding: 20
                }}>
                  <SIcon name={'alerta'} fill={STheme.color.warning} width={50} height={50} />
                </SView>
                <SHr height={30} />
                <SText center fontSize={18} language={{
                  es: "Has recibido una invitación para trabajar con nosotros. Por favor, haz clic en 'Aceptar' para continuar. Recuerda completar toda la información solicitada en tu perfil para poder recibir más ofertas de trabajo.",
                  en: "You have received an invitation to work with us. Please click 'Accept' to continue. Remember to complete all the information requested in your profile to receive more job offers."
                }} />
                <SHr height={25} />


                <SHr height={55} />
                <SView col={'xs-12'} row center>
                  <Btn col={"xs-5"} onPress={() => {
                    // SNavigation.navigate("/registro")
                  }} backgroundColor={STheme.color.darkGray} >
                    <SText fontSize={18} color={STheme.color.text} language={{
                      es: "NO, GRACIAS",
                      en: "NO, THANKS"
                    }} />
                  </Btn>
                  <SView width={25} />
                  <Btn col={"xs-5"} onPress={() => {
                    // SNavigation.navigate("/perfil/editar_")
                    this.hanldeGuardar(usuario)
                  }}
                    backgroundColor={STheme.color.secondary}
                    loading={this.state.loading}

                  >
                    <SText fontSize={18} color={STheme.color.text} language={{
                      es: "ACEPTAR",
                      en: "ACCEPT"
                    }} />
                  </Btn>
                </SView>
              </SView>
            </Container>
            <SHr height={25} />
          </SView >
        </SPage >

        <SHr height={20} />
        {/* <PBarraFooter url={'reservas'} /> */}
      </>
    );
  }
}

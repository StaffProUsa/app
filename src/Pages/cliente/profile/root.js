import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from ".."
import { SHr, SIcon, SImage, SLanguage, SList, SNavigation, SNotification, SPopup, SText, STheme, SUtil, SView } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';
import Eventos from '../eventos';
import PBarraFooter from '../../../Components/PBarraFooter';
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos';
import ImageProfile from '../../../Components/ImageProfile';
import TextVerMas from '../../../Components/TextVerMas';

class index extends DPA.profile {
  static FOOTER = <>
    <PBarraFooter style={{
      position: "absolute",
      bottom: 0,
    }} url={'/company'} />
  </>
  constructor(props) {
    super(props, {
      title: "Client",
      Parent: Parent,
      itemType: "2",
      pageParams: {
        backAlternative: (opt) => {
          if (this.data?.key_company) {
            SNavigation.replace("/cliente", { key_company: this.data?.key_company })
          } else {
            SNavigation.goBack();
          }
        }
      },
      excludes: ["key", "key_servicio", "key_usuario", "fecha_on", "key_company", "estado", "latitude", "longitude"]
    });
    this.state = {
      pasadoSelect: true
    }
  }
  $allowEdit() {
    this.data = this.$getData();
    if (!this.data) return "cargando"
    return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit", user_data: { key_company: this.data.key_company } })
  }
  $allowDelete() {
    this.data = this.$getData();
    if (!this.data) return "cargando"
    return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete", user_data: { key_company: this.data.key_company } })
  }
  $allowAccess() {
    this.data = this.$getData();
    if (!this.data) return "cargando"
    return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver", user_data: { key_company: this.data.key_company } })
  }
  $getData() {
    // this.usuarios = Model.usuario.Action.getAll();
    return Parent.model.Action.getByKey(this.pk);
  }
  onEdit() {
    SNavigation.navigate("/cliente/add", { pk: this.pk })
  }

  onChangeLanguage(language) {
    this.setState({ ...this.state })
  }
  componentDidMount() {
    // this.data = this.$getData();

    SLanguage.addListener(this.onChangeLanguage.bind(this))
    SSocket.sendPromise({
      component: "evento",
      type: "getEstadoEventos",
      key_cliente: this.pk,
    }).then(e => {
      console.log(e);
    }).catch(e => {
      console.error(e);
    })
  }
  componentWillUnmount() {
    SLanguage.removeListener(this.onChangeLanguage)
  }

  $render() {
    this.data = this.$getData();
    return <SView col={"xs-12"} card center padding={8}>
      <SView row center>
        <ImageProfile
          width={60}
          src={SSocket.api.root + "cliente/" + this.pk}
          // src={ `${SSocket.api.root}cliente/${this.pk}?time=${new Date().getTime()}`}
         
        />
        <SView width={4} />
        <SView>
          <ImageProfile src={SSocket.api.root + "company/" + this.data?.key_company} />
          <SText fontSize={18} bold>{this.data?.descripcion}</SText>
        </SView>
      </SView>
      <TextVerMas limitString={200} col={"xs-12"} center color={STheme.color.gray}>{this.data?.observacion}</TextVerMas>
      {/* <SText col={"xs-12"} center color={STheme.color.gray}>{SUtil.limitString(this.data?.observacion, 200)}</SText> */}
    </SView>
  }
  $footer() {
    return <SView col={"xs-12"}>
      <SHr />
      <MenuPages path='/cliente/profile' permiso='ver'>
        {/* <MenuButtom
     icon={<SIcon name='Excel' />}
     label={SLanguage.select({
      en: "Attendace Report",
      es: "Reporte de horas trabajadas"
     })} url='/cliente/profile/hours' params={{ pk: this.pk }} /> */}


        <MenuButtom
          icon={<SIcon name='itimesheet' fill={STheme.color.text} />}
          label={SLanguage.select({ en: "Time Sheets", es: "Hoja de tiempos" })} url='/company/timeSheets'
          params={{ key_company: this.data?.key_company, key_cliente: this.pk }} />
        <MenuButtom label={SLanguage.select({ en: "dashBoard", es: "dashBoard" })}
          // url='/company/dashboard' params={{ key_company: this.data?.key_company, key_cliente: this.pk }}
          icon={<SIcon name='Excel' fill={STheme.color.text} />}
          onPress={() => {
            SNavigation.navigation.navigate({ name: "/company/dashboard", params: { key_company: this.data?.key_company, key_cliente: this.pk }, key: Math.random() })
          }} />

      </MenuPages>
      <SHr />
      <SView row col={"xs-12"} center>
        <SText language={{ en: "Events", es: "Eventos" }} fontSize={16} bold flex />
        <SView height={30} backgroundColor={this.state.pasadoSelect ? STheme.color.success : STheme.color.lightGray} center padding={8} style={{
          borderTopLeftRadius: 7,
          borderBottomLeftRadius: 7,
        }}
          onPress={() => {
            this.setState({ pasadoSelect: true })
          }}>
          <SText language={{ en: "Ongoing", es: "En curso" }} fontSize={12} bold color={this.state.pasadoSelect ? STheme.color.white : "#646464"} />
        </SView>
        <SView height={30} backgroundColor={this.state.pasadoSelect ? STheme.color.lightGray : STheme.color.success} center padding={8} style={{
          borderTopRightRadius: 7,
          borderBottomRightRadius: 7,
        }}
          onPress={() => {
            this.setState({ pasadoSelect: false })
          }}>
          <SText language={{ en: "Past", es: "Pasados" }} fontSize={12} bold color={this.state.pasadoSelect ? "#646464" : STheme.color.white} />
        </SView>
        <SView width={5} />
        <SView width={30} height={30} onPress={() => {
          SNavigation.navigate("/evento/registro", { key_cliente: this.data.key, key_company: this.data.key_company })
        }}>
          <SIcon name='Add' />
        </SView>
      </SView>
      <SHr />
      <Eventos key_cliente={this.pk} pasadoSelect={this.state.pasadoSelect} />
    </SView>
  }
}
export default connect(index);
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

  return (<SView col={"xs-12"} padding={10} row center style={{ height: isChecked ? "auto" : 40, overflow: "hidden" }} onPress={() => { isChecked ? onChange(false) : onChange(true); }}>
    <SView width={24} height={24} center>
      <SImage src={SSocket.api.root + "staff_tipo/" + data.key} style={{ resizeMode: "cover", zIndex: 9, borderRadius: "50%" }} border="red" />
    </SView>
    <SView flex onPress={() => { isChecked ? onChange(false) : onChange(true); }}>
      <SText fontSize={16} color={STheme.color.text}> {data.descripcion}</SText>
    </SView>
    <SView width={25} height={25} border="white" style={{ borderRadius: 2, }} center>
      {!isChecked ? null : <SIcon name='Reservado' width={14} center />}
    </SView>
  </SView>
  );
};

const Item2 = ({ data, onChange }) => {
  if (!data) return null;
  const [salario, setSalario] = React.useState(data?.salario ?? 0);
  let lenguaje = SLanguage.language;

  return (
    <>
      <SView col={"xs-12"} center row style={{ height: 55, overflow: "hidden" }} backgroundColor={"#C7C6C680"}>
        <SView col={"xs-9.5 md-9"} center row backgroundColor='transparent' >
          <SView col={"xs-6"}>
            <SText fontSize={14} color={STheme.color.text} style={{ textAlign: 'right' }}>{SLanguage.select({ en: "Salary:", es: "Sueldo:" })} </SText>
          </SView>
          <SView col={"xs-6"} center>
            <SInput value={salario ?? 0} type="money" height={34} color={STheme.color.text} defaultValue={data?.salario ?? 0} onChangeText={(e) => { setSalario(e); }} icon={"USD"} />
          </SView>
        </SView>

        <SView col={"xs-2.5 md-3"} row center style={{ borderRadius: 2, paddingVertical: 4 }}>
          <SView col={"xs-12"} center style={{ paddingVertical: 4 }}>
            <PButtom small withe style={{ backgroundColor: STheme.color.secondary, borderRadius: 2, paddingLeft: 4, paddingRight: 4 }} fontSize={12} color={STheme.color.white} onPress={() => {

              SSocket.sendPromise({
                component: "staff_tipo_favorito",
                type: "editar",
                data: {
                  key: data.key,
                  estado: 1,
                  salario: salario,
                },
                key_usuario: Model.usuario.Action.getKey(),
              })
                .then((e) => {
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
            }}> {SLanguage.select({ es: "Guardar", en: "Save" })} </PButtom>
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
      key_company: SNavigation.getParam("key_company"),
      salario_user: SNavigation.getParam("salarioUser"),
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
        Object.values(b.data).filter(a => a.key_company == this.state.key_company).map(a => {
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
      <Container flex center >
        <SView col={"xs-12"} row>
          <SText justify={true} fontSize={15} bold={true}> {(lenguaje === "es") ? "Salario desde perfil:" : "Salary from profile:"}</SText>
          <SView width={4} />
          <SText justify={true} fontSize={14} >{(this.state.salario_user != null) ? "USD " +this.state.salario_user : "USD 0"}</SText>
        </SView>
        <SHr height={10} />
        <SText col="xs-12" justify={true} fontSize={18} bold={true}> {(lenguaje === "es") ? "Seleccione las habilidades del staff:" : 'Select the staffsww skills:'}</SText>
        <SBuscador onChange={(e) => { this.setState({ filter: e }) }} />

        <FlatList
          data={Object.values(datafilter ?? {}).sort((a, b) => (a?.descripcion ?? "").toUpperCase() > (b?.descripcion ?? "").toUpperCase() ? 1 : -1)}
          style={{ width: "100%" }}
          contentContainerStyle={{ width: "100%" }}
          ListHeaderComponent={() => <SHr h={10} />}
          ItemSeparatorComponent={() => <SHr h={10} />}
          ListFooterComponent={() => <SHr h={80} />}
          renderItem={({ item }) => {
            const isEmpty = !item.descripcion;

            return (
              <SView col={"xs-12"} style={{ height: isEmpty ? 0 : "auto" }} center row>
                <SView col={"xs-12"}>
                  <SView
                    style={{
                      backgroundColor: STheme.color.card,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      borderBottomRightRadius: !item.staff_tipo_favorito ? 4 : 0,
                      borderBottomLeftRadius: !item.staff_tipo_favorito ? 4 : 0,
                      padding: 4,
                      elevation: 2, // agrega sombra en Android
                      shadowColor: "#000", // agrega sombra en iOS
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      height: isEmpty ? 50 : "auto",
                    }}
                  >
                    <Item col={"xs-12"} row center
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
                              key_company: this.state.key_company,
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
                              this.forceUpdate()
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
                        else {
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
                {item.staff_tipo_favorito ? <Item2 data={item.staff_tipo_favorito} ></Item2> : null}
              </SView>)
          }
          }
        />

      </Container>
    </SPage >
  }
}

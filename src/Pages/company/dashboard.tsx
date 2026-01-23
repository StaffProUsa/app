import React, { Component } from 'react';
import { Dimensions, Text, TextStyle, View } from 'react-native';
import { SDate, SHr, SIcon, SImage, SLanguage, SNavigation, SPage, SPopup, SText, STheme, SView, } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table'
import BoxMenu from '../../Components/Popups/BoxMenu';
import { ExporterStateType } from 'servisofts-table/DinamicTable/DinamicTable';
import Config from '../../Config';
import PBarraFooter from '../../Components/PBarraFooter';
import { SelectEntreFechas } from '../../Components/Fechas';
import SelectEventos from '../../Components/Filtros/Eventos';
import { Container } from '../../Components';
import PDF from '../../Components/PDF';

type DataType = any
const Col = DinamicTable.Col<DataType>

// function ordenarData(data :any) {
//   return [...data].sort((a, b) => {
//     const eventoA = a.evento.descripcion || "";
//     const eventoB = b.evento.descripcion || "";
//     const staffA = (a.staff_tipo.descripcion || "").toString();
//     const staffB = (b.staff_tipo.descripcion || "").toString();


//     // Primero agrupar por key_evento
//     if (eventoA < eventoB) return -1;
//     if (eventoA > eventoB) return 1;

//     // Priorizar "Capitan"
//     if (staffA === "Capitan" && staffB !== "Capitan") return -1;
//     if (staffA !== "Capitan" && staffB === "Capitan") return 1;

//     // Ordenar alfabéticamente por staff
//     return staffA.localeCompare(staffB);
//   });
// }

function ordenarData(data: any) {
  return data.sort((a, b) => {
    // 1. Ordenar por evento.descripcion (alfabéticamente)
    const eventoA = a.evento.descripcion?.toLowerCase() || "";
    const eventoB = b.evento.descripcion?.toLowerCase() || "";
    if (eventoA !== eventoB) {
      return eventoA.localeCompare(eventoB);
    }

    // 2. Priorizar Capitan
    const tipoA = a.staff_tipo.descripcion || "";
    const tipoB = b.staff_tipo.descripcion || "";

    const isCapitanA = tipoA === "Capitan";
    const isCapitanB = tipoB === "Capitan";

    if (isCapitanA && !isCapitanB) return -1;
    if (!isCapitanA && isCapitanB) return 1;

    // 3. Si ambos no son Capitan, ordenar alfabéticamente por staff_tipo.descripcion
    return tipoA.localeCompare(tipoB);
  });
}

const ImageLabel = ({ label, src, textStyle, wrap = true }) => {
  return <SView row >
    <SView width={20} height={20} style={{ borderRadius: 100, overflow: "hidden", backgroundColor: STheme.color.card }}>
      <SImage enablePreview src={src} style={{
        resizeMode: "cover"
      }} />
    </SView>
    <SView width={4} />
    <Text style={[textStyle as TextStyle, { flex: 1 }]} numberOfLines={!!wrap ? 0 : 1} >{label}</Text>
  </SView>
}
export default class dashboard extends Component {
  state: any = {
    fecha_inicio: '',
    fecha_fin: '',
    key_evento: '',
  }
  table: DinamicTable<any> | any = null;

  params = SNavigation.getAllParams();




  async loadData() {

    const resp: any = await SSocket.sendPromise({
      component: "board",
      type: "principal",
      // key_usuario: Model.usuario.Action.getKey()
    })

    //ORDENAR DATA POR EVENTO, PRIORIZANDO CAPITAN 
    // let dataOrdenada = ordenarData(resp.data);
    // console.log("prueba", dataOrdenada);

    // return dataOrdenada;
    // this.state.data = resp.data;
    if (this.params.key_company && this.params.key_cliente) {
      this.setState({ data: (resp.data.filter(item => ((item.cliente.key === this.params.key_cliente) && (item.company.key === this.params.key_company)))) })
      // this.setState({ data: (this.params.key_company) ? (resp.data.filter(item => item.company.key === this.params.key_company)) : resp.data })

    } else if (this.params.key_company) {
      this.setState({ data: resp.data.filter(item => item.company.key === this.params.key_company) })
    } else {
      this.setState({ data: resp.data })
    }

    // let datafecha= this.state.data
    // if (this.state.fecha_inicio || this.state.fecha_fin) {
    //   datafecha = this.state.data.filter((item) => {
    //     const itemDate = new SDate(item.fecha, "yyyy-MM-ddThh:mm:ssTZD").getTime();
    //     const startDate = new SDate(this.state.fecha_inicio, "yyyy-MM-dd").getTime();
    //     const endDate = new SDate(this.state.fecha_fin, "yyyy-MM-dd").getTime() + (24 * 60 * 60 * 1000) - 1; // Incluir todo el día final
    //     return itemDate >= startDate && itemDate <= endDate;
    //   });
    //   this.setState({ data: datafecha });
    // }
    return resp.data;
  }

  handleDateChange = (e: { fecha_inicio: string | String; fecha_fin: string | String }) => {
    this.state.fecha_inicio = e.fecha_inicio;
    this.state.fecha_fin = e.fecha_fin;
    this.table.componentDidMount();


  };

  handleEventoChange = (e: { key_evento: string | String; }) => {
    this.state.key_evento = e.key_evento;
    console.log("handleEventoChange", e);
    this.table.componentDidMount();
  };

  componentDidMount() {
    this.loadData();
  }

  render() {

    return <SPage title={SLanguage.select({ en: "Events and Positions", es: "Eventos y posiciones" })} disableScroll
      footer={<PBarraFooter url={'/company'} />}
    >
      <SView col={"xs-12"}  >
        <SHr height={5} />
        <SView col={"xs-12"} row>
          {this.params.key_evento ? null : <>
            <SelectEventos
              onChange={this.handleEventoChange}
              key_evento=''
              data={this.state.data ?? []}

            />
            <SView width={12} />
          </>}

          <SelectEntreFechas
            onChange={this.handleDateChange}
            fecha_inicio=''
            fecha_fin=''

          />
          <SView width={20} />

          <SView card padding={8}
            onPress={() => {
              // console.log("this.table.dataFiltrada");
              PDF.dashboard.handlePress(this.table.dataFiltrada, this.state.fecha_inicio, this.state.fecha_fin);
            }} > <SText clean>{"PDF"}</SText>
          </SView>
        </SView>

      </SView>
      <SView col={"xs-12"} flex>
        <DinamicTable
          ref={ref => this.table = ref}
          language={SLanguage.language}
          loadInitialState={async () => {

            let filters: ExporterStateType["filters"] = [];
            if (this.state.fecha_inicio && this.state.fecha_fin) {
              filters.push({
                "col": "fecha",
                "type": "date",
                "operator": "between",
                value: [
                  new SDate(this.state.fecha_inicio, "yyyy-MM-dd").toString("yyyy-MM-dd") + "T00:00:00",
                  new SDate(this.state.fecha_fin, "yyyy-MM-dd").toString("yyyy-MM-dd") + "T23:59:59"
                ]
              })
            }
            if (this.state.key_evento) {
              filters.push({
                "col": "evento",
                "type": "string",
                "operator": "contains",
                "value": this.state.key_evento
              })
            }
            if (this.params.key_company) {
              const companyResp: any = await SSocket.sendPromise({
                component: "company",
                type: "getByKey",
                key: this.params.key_company
              })

              filters.push({
                "col": "company",
                "type": "string",
                "operator": "contains",
                "value": companyResp?.data?.descripcion
              })
            }
            if (this.params.key_cliente) {
              const clientResp: any = await SSocket.sendPromise({
                component: "cliente",
                type: "getByKey",
                key: this.params.key_cliente
              })

              filters.push({
                "col": "cliente",
                "type": "string",
                "operator": "contains",
                "value": clientResp?.data?.descripcion
              })
            }
            if (this.params.key_evento) {
              const eventtResp: any = await SSocket.sendPromise({
                component: "evento",
                type: "getByKey",
                key: this.params.key_evento
              })

              filters.push({
                "col": "evento",
                "type": "string",
                "operator": "contains",
                "value": eventtResp?.data?.descripcion
              })
            }


            // filters.push({
            //   "col": "fecha",
            //   "type": "date",
            //   "operator": ">",
            //   "dateFormat": "MONTH dd, yyyy",
            //   "value": [
            //     "2025-04-01"
            //   ]
            // })
            return {
              "filters": filters,
              "sorters": [
                {
                  "key": "fecha",
                  "order": "desc",
                  "type": "date"
                },
                {
                  "key": "inicio",
                  "order": "desc",
                  "type": "date",
                  "dateFormat": "HH"
                }
              ],
            }
          }}
          // loadData={this.loadData}
          loadData={this.loadData.bind(this)}
          keyExtractor={(e: any) => e.staff.key}
          colors={Config.table.styles()}
          cellStyle={Config.table.cellStyle()}
          textStyle={Config.table.textStyle()}
          iconSize={Config.table.iconSize()}
          selectType='single'

          listFooterComponent={() => {
            return <SView height={80} />
          }}
          onSelect={(e) => {
            let top = e.evt.nativeEvent.pageY;
            const zz = 170
            if (e.evt.nativeEvent.pageY + zz > Dimensions.get("window").height) {
              top = Dimensions.get("window").height - zz
            }
            SPopup.open({
              key: "popup_menu_alvaro",
              type: "2",
              content: <SView withoutFeedback style={[{
                position: "absolute",
                top: top,
                left: e.evt.nativeEvent.pageX,
                width: 230,
              }
              ]} center>
                <BoxMenu data={e.row}></BoxMenu>
              </SView>
            })
          }}
        >
          <Col key={"fecha"} label={SLanguage.select({ en: "Date", es: "Fecha" })} width={80}
            textStyle={{
              textAlign: "right"
            }}
            dataType='date'
            data={e => (!e.row.evento.fecha) ? null : new SDate(e.row.evento.fecha, "yyyy-MM-ddThh:mm:ss").date}
            dateFormat='MM-dd-yyyy'
            format={e => new SDate(e.data).toString("MM-dd-yyyy")}

          />

          <Col key={"company"} label={SLanguage.select({ en: "Company", es: "Compañia" })} width={100}
            data={e => e.row.company.descripcion}
            customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "company/" + e.row?.company?.key} textStyle={e.textStyle} />}
          />
          <Col key={"cliente"} label={SLanguage.select({ en: "Client", es: "Cliente" })} width={100}
            data={e => e.row.cliente.descripcion}
            customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "cliente/" + e.row?.cliente?.key} textStyle={e.textStyle} />}
          />
          <Col key={"evento"} label={SLanguage.select({ en: "Event", es: "Evento" })} width={100}
            data={e => e.row.evento.descripcion}
          />
          <Col key={"staff"} label={SLanguage.select({ en: "Staff", es: "Puesto" })} width={100}
            data={e => e.row.staff_tipo.descripcion}
            customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />}
          />
           <Col key={"location"} label={SLanguage.select({ en: "Location", es: "Ubicación" })} width={140}
            data={e => e.row.staff.location ? e.row.staff.location : " "}
            // customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />}
          />
          <Col key={"staff_personal"} label='#' width={40}
            disableFilter
            cellStyle={{ alignItems: "center" }}
            textStyle={{ textAlign: "center" }}
            data={e => `${e.row.staff.count_staff_usuario} / ${e.row.staff.cantidad}`}
          />




          <Col key={"state"} label={SLanguage.select({ en: "State", es: "Estado" })} width={70}
            data={e => {
              const fecha_inicio = e.row?.staff?.fecha_inicio;
              const fecha_fin = e.row?.staff?.fecha_fin;
              if (!fecha_inicio || !fecha_fin) return "ERROR"
              const fecha_inicio_time = new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").getTime();
              const fecha_fin_time = new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").getTime();
              if (fecha_inicio_time > fecha_fin_time) {
                return "ERROR"
              }
              if (fecha_inicio_time > new Date().getTime()) {
                return "PENDING"
              }
              if (fecha_fin_time < new Date().getTime()) {
                return "FINISHED"
              }
              return "READY"
            }}
            customComponent={e => {
              let color: any = STheme.color.primary;
              switch (e.dataFormat) {
                case "ERROR":
                  color = STheme.color.danger;
                  break;
                case "PENDING":
                  color = STheme.color.warning;
                  break;
                case "FINISHED":
                  color = STheme.color.lightGray;
                  break;
                case "READY":
                  color = STheme.color.success;
                  break;
              }

              return <SView col={"xs-12"} center >
                <SView padding={3} center style={{
                  backgroundColor: color,
                  borderRadius: 4,
                }}>
                  <Text style={[e.textStyle as TextStyle, { color: "#fff", fontSize: 10 }]} >{e.dataFormat}</Text>
                </SView>
              </SView>
            }} />


          <Col key={"inicio"} label={SLanguage.select({ en: "Clock in", es: "Inicio" })} width={80}
            dataType='date'
            disableFilterGroup
            data={e => !e?.row?.staff?.fecha_inicio ? "" : new SDate(e.row.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").date}
            format={e => !e.data ? "" : new SDate(e.data).toString("HH")}
            dateFormat='HH'

          // format={e => new SDate(e.data).toString("HH")}
          // textStyle={{ color: STheme.color.success }}
          />

          <Col key={"fin"} label={SLanguage.select({ en: "Clock out", es: "Fin" })} width={80}
            dataType='date'
            data={e => !e?.row?.staff?.fecha_fin ? "" : new SDate(e.row.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").date}
            format={e => !e.data ? "" : new SDate(e.data).toString("HH")}
            // data={e => !e.row.staff.fecha_fin ? null : new SDate(e.row.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").date}
            disableFilterGroup
            dateFormat='HH'
          />
          {/* <Col key={"horas"} label={SLanguage.select({ en: "Times", es: "Horas" })} width={60}
            dataType='number'
            disableFilterGroup
            textStyle={{
              textAlign: "right",
            }}
            data={e => {
              if (!e.row?.staff?.fecha_inicio || !e.row?.staff?.fecha_fin) return "";
              const time = new SDate(e.row.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").diffTime(new SDate(e.row.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD"))
              return time / 1000 / 60 / 60
            }}
            format={e => !e.data ? "" : e.data.toFixed(2)}
          /> */}
          <Col key={"staff_descripcion"} label={SLanguage.select({ en: "Staff descripcion", es: "Descripcion puesto" })} width={200}
            disableFilterGroup
            data={e => e.row.staff.descripcion}
          // wrap={false}
          />

          {/* <Col key={"testcustom"} label='TestCustom'
                        data={e => e.row.apellido}
                        customComponent={e => <Text style={[e.textStyle as TextStyle, { color: "#f0f" }]} >{e.dataFormat}</Text>} /> */}
        </DinamicTable>
        {/* <SHr height={70} /> */}
      </SView>
    </SPage>
  }
}

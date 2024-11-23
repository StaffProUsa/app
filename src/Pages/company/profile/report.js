import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SLoad, SNavigation, SNotification, SPage, STable2, STheme } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PermisoNotFound from '../../../Components/PermisoNotFound';
import Model from '../../../Model';
import { connect } from 'servisofts-page';

 class report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.pk = SNavigation.getParam("pk");
    }
    componentDidMount() {
        SSocket.sendPromise({
            component: "company",
            type: "getReporteGeneral",
            key_company: this.pk,
            fecha_inicio: "2020-01-01",
            fecha_fin: "2030-01-01"
        }).then(e => {
            if (!e.data) return;
            this.setState({ data: e.data })
        }).catch(e => {
            SNotification.send({
                title: "Error",
                body: e?.error ?? e,
                color: STheme.color.danger,
                time: 5000
            })
        })
    }

    render() {
        let permiso_users = Model.usuarioPage.Action.getPermiso({ url: "/company/profile/report", permiso: "ver", user_data: { key_company: this.pk } });
        if (permiso_users == "cargando") return <SLoad />
        if (!permiso_users) return <PermisoNotFound />
        return <SPage title={"Reporte"} disableScroll>
            <STable2
                data={this.state.data}
                header={[
                    { key: "index", label: "#", width: 50 },
                    { key: "key_usuario", label: "ku", width: 300 },
                    {
                        key: "fecha_ingreso", label: "Clock In", center: true,
                        width: 150,
                        render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("yyyy MONTH dd, HH"),
                    },
                    {
                        key: "fecha_salida", label: "Clock Out", center: true, width: 150,
                        render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("yyyy MONTH dd, HH")
                    },
                    { key: "cliente/descripcion", label: "Client", width: 150 },
                    { key: "evento/descripcion", label: "Event", width: 150 },
                    { key: "staff/descripcion", label: "Description", width: 200 },
                    { key: "staff/fecha_inicio", label: "Start", center: true, width: 170, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("MONTH dd, yyyy HH") },
                    { key: "staff/fecha_fin", label: "End", center: true, width: 170, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("MONTH dd, yyyy HH") },
                ]}
            />
        </SPage>
    }
}
export default connect(report);
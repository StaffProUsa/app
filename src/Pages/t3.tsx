import React, { Component } from 'react';
import { Text, TextStyle, View } from 'react-native';
import { SDate, SHr, SImage, SPage, SText, STheme, SView, } from 'servisofts-component';
import CardEvento from '../Components/Evento/CardEvento';
import { Container } from '../Components';
import CardEventoSteps from '../Components/Evento/CardEventoSteps';


const TESTELEMENT = {
    "cliente": {
        "descripcion": "TAPEKE",
        "estado": 1,
        "key_company": "b8118596-9980-4a27-aa4e-a48384095350",
        "contacto": "Carlos Daniel Paz aliaga",
        "key_usuario": "99bbf5bf-cb7e-424b-a65e-5ec9c73c1121",
        "nivel_ingles": null,
        "fecha_on": "2024-11-12T00:07:49.095",
        "latitude": null,
        "direccion": "Santa cruz de la sierra",
        "index": null,
        "papeles": "true",
        "telefono": "+591 ",
        "key": "b86b027b-9311-4552-996a-90c06ceae7f8",
        "observacion": "\nEn este espacio, podrás encontrar todos los requerimientos que el cliente ha solicitado para el proyecto. 📝 Es importante que revises cada detalle cuidadosamente, ya que aquí se plasman todas las necesidades y expectativas que debemos cumplir para garantizar un resultado óptimo. 🎯\n\nRecuerda que cualquier modificación o actualización será comunicada a través de este mismo apartado, para que siempre estemos alineados con lo que el cliente espera. 🛠️\n\n👉 Por favor, mantén este espacio siempre actualizado y asegúrate de verificar los requerimientos antes de iniciar cualquier tarea.\n\n¡Gracias por tu colaboración! 😊\n                            ",
        "longitude": null
    },
    "evento": {
        "descripcion": "Probando servisofts",
        "fecha": "2025-02-13T00:00:00",
        "estado": 1,
        "key_company": "b8118596-9980-4a27-aa4e-a48384095350",
        "key_usuario": "1e2ef5fd-4fb5-40ff-84df-30f34a2b162e",
        "fecha_on": "2025-02-13T22:28:14.653",
        "estado_venta": 0,
        "key_cliente": "b86b027b-9311-4552-996a-90c06ceae7f8",
        "key": "53d9bf2e-91cb-4bd9-a81f-92837bf6e392",
        "observacion": "sadfas das"
    },
    "staff": {
        "descripcion": "asdasdasd",
        "estado": 1,
        "key_usuario": "1e2ef5fd-4fb5-40ff-84df-30f34a2b162e",
        "fecha_inicio": "2025-02-13T22:00:00-04:00",
        "nivel_ingles": "MEDIUM",
        "key_staff_tipo": "49d96f55-b8a5-4272-ac93-ce314f386dda",
        "fecha_on": "2025-02-13T22:28:56.466",
        "fecha_fin": "2025-02-14T02:30:00-04:00",
        "cantidad": 3,
        "key_evento": "53d9bf2e-91cb-4bd9-a81f-92837bf6e392",
        "key": "173410d0-2329-4252-9005-c811bcc50dd1",
        "observacion": null
    },
    "company": {
        "descripcion": "Servisofts",
        "estado": 1,
        "contacto": "",
        "key_usuario": "798994df-71c1-4850-b45d-6fc2642e6fb3",
        "fecha_on": "2024-11-11T23:55:06.306",
        "latitude": null,
        "direccion": "",
        "telefono": "+1 ",
        "key": "b8118596-9980-4a27-aa4e-a48384095350",
        "observacion": "Empresa de desarrollo",
        "email": "",
        "longitude": null
    },
    "staff_tipo": {
        "descripcion": "Capitan",
        "estado": 1,
        "key_usuario": "8d086bcf-df5e-4f5d-b5fa-fe45b0b2b87d",
        "color": null,
        "fecha_on": "2024-10-02T18:26:07.000293",
        "key": "49d96f55-b8a5-4272-ac93-ce314f386dda",
        "observacion": null
    }
}

export default class t2 extends Component {



    render() {
        return <SPage title={"Test"} disableScroll>
            <Container>
                <SHr h={100}/>
                <CardEventoSteps data={TESTELEMENT}/>
            </Container>
        </SPage>
    }
}

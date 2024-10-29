import { SAssets } from 'servisofts-component';

import Camara from "./svg/camara";

// import Casagrande from "./svg/casagrande";
import restaurante from './svg/restaurante';
import Inicio from "./svg/inicio";
import Inputs from "./svg/inputs";
import Reserva from "./svg/reserva";
import Tarjeta from "./svg/tarjeta";
import User from "./svg/user";
import Admin from "./svg/admin";
import Event from "./svg/event";
import Register from "./svg/register";


//Logo
import Logo, { ReactComponent as LogoW } from './svg/logo.svg';
import Logosolo, { ReactComponent as LogosoloW } from './svg/logosolo.svg';
import Carrito, { ReactComponent as CarritoW } from './svg/carrito.svg';


import out, { ReactComponent as outW } from './svg/out.svg';
import share, { ReactComponent as shareW } from './svg/share.svg';
import invite, { ReactComponent as inviteW } from './svg/invite.svg';
import next, { ReactComponent as nextW } from './svg/next.svg';
import next2, { ReactComponent as next2W } from './svg/next2.svg';
import aptitud, { ReactComponent as aptitudW } from './svg/aptitud.svg';
import checkAll, { ReactComponent as checkAllW } from './svg/checkAll.svg';
import posicion, { ReactComponent as posicionW } from './svg/posicion.svg';
import editar, { ReactComponent as editarW } from './svg/editar.svg';
import asistido, { ReactComponent as asistidoW } from './svg/asistido.svg';
import noAsistido, { ReactComponent as noAsistidoW } from './svg/noAsistido.svg';



import { Use } from 'react-native-svg';


const Assets: SAssets = {
    svg: {

        "Logo": { Native: Logo, Web: LogoW },
        "Logosolo": { Native: Logosolo, Web: LogosoloW },
        "Carrito2": { Native: Carrito, Web: CarritoW },
        "out": { Native: out, Web: outW },
        "share": { Native: share, Web: shareW },
        "invite": { Native: invite, Web: inviteW },
        "next": { Native: next, Web: nextW },
        "next2": { Native: next2, Web: next2W },
        "aptitud": { Native: aptitud, Web: aptitudW },
        "checkAll": { Native: checkAll, Web: checkAllW },
        "posicion": { Native: posicion, Web: posicionW },
        "editar": { Native: editar, Web: editarW },
        "asistido": { Native: asistido, Web: asistidoW },
        "noAsistido": { Native: noAsistido, Web: noAsistidoW },
        ...Inicio,
        ...Camara,
        ...restaurante,
        ...Inputs,
        ...Reserva,
        ...Tarjeta,
        ...User,
        ...Admin,
        ...Event,
        ...Register,
    }
}

export default Assets;
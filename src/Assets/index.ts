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


//Logo
import Logo, { ReactComponent as LogoW } from './svg/logo.svg';
import Logosolo, { ReactComponent as LogosoloW } from './svg/logosolo.svg';
import Carrito, { ReactComponent as CarritoW } from './svg/carrito.svg';


import out, { ReactComponent as outW } from './svg/out.svg';
import share, { ReactComponent as shareW } from './svg/share.svg';
import invite, { ReactComponent as inviteW } from './svg/invite.svg';


import { Use } from 'react-native-svg';


const Assets: SAssets = {
    svg: {

        "Logo": { Native: Logo, Web: LogoW },
        "Logosolo": { Native: Logosolo, Web: LogosoloW },
        "Carrito2": { Native: Carrito, Web: CarritoW },
        "out": { Native: out, Web: outW },
        "share": { Native: share, Web: shareW },
        "invite": { Native: invite, Web: inviteW },
        ...Inicio,
        ...Camara,
        ...restaurante,
        ...Inputs,
        ...Reserva,
        ...Tarjeta,
        ...User,
        ...Admin,
        ...Event
    }
}

export default Assets;
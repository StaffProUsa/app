import { SPage, SPageListProps } from 'servisofts-component';
import Services from '../Services';
import Administracion from './Administracion';
import MensajeCargando from './Billetera/MensajeCargando';
import MensajeIniciarSesion from './Billetera/MensajeIniciarSesion';
import MensajePedidoExitoso from './Billetera/MensajePedidoExitoso';
import MensajePedidoFueraTiempo from './Billetera/MensajePedidoFueraTiempo';
import Mistarjetas from './Billetera/Mistarjetas';
import PagoTarjeta from './Billetera/PagoTarjeta';
import Carga from './Carga';
import Confirmar from './Carrito/Confirmar';
import Detalle from './Carrito/Detalle';
import MensajePedidoError from './Billetera/MensajePedidoError';
import usuario from './usuario';
import MensajeCarritoVacio from './Carrito/MensajeCarritoVacio';
import entradas from './entradas';
// import Perfil from './Evento/Perfil';
import Qr from './Evento/Qr';
import Registro from './Evento/Registro';
import token from './Token';
import Inicio from './Inicio';
import Inicio2 from './Inicio2';
import Reservas from './Reservas';
import TerminosCondiciones from './TerminosCondiciones';
import Test from './Test';
import Entrada from './Ticket/Entrada';
import Reserva from './Ticket/Reserva';
import CargandoQr from './Carrito/CargandoQr';
import ErrorQr from './Carrito/ErrorQr';

import Planimetria from './Planimetria';
import TestRicky from './TestRicky';
import TestZoom from './TestZoom';
import solicitud_qr from './solicitud_qr';
import notification from './notification';
import venta from './venta';
import Carrito from './Carrito';
// import usuario from './usuario';
import login from './login';
import registro from './registro';
import perfil from './perfil';
import TestQr from './TestQr';
import reportes from './reportes';
import manilla from './manilla';
import entrega from './entrega';
import rol from './rol';
import version_required from './version_required';
import t2 from './t2';
import t3 from "./t3";
import staff_tipo from './staff_tipo';
import staff from './staff';
import intro from './Intro';
import company from './company';
import cliente from './cliente';
import Ingreso from './Ingreso';
import invitationDetail from './invitationDetail';
import invitationUser from './invitationUser';
import sorry from './Sorry';
import waiting from './waiting';

import my_companys from "./my_companys";
import invitations from './invitations';
import trabajos from './trabajos';
import history from './history';
import historyDetail from './historyDetail';
import Evento from './Evento';
import invitacion from './invitacion';
import onLogin from './onLogin';
import direccion from './direccion';
import boss from './boss';
import event_in_progress from './event_in_progress';
import historyTimeSheet from './historyTimeSheet';

import cd from "./cd"
import cdboss from './cdboss';
const NewPages = SPage.combinePages("/", {
   "": Carga,
   "inicio": Inicio,
   ...entradas,
   ...solicitud_qr,
   ...notification,
   ...venta,
   ...Carrito,
   ...rol,
   boss,
   version_required,
   "test": Test,
   t2,
   t3,
   manilla,
   ...Evento,
   ...direccion,
   // 'evento': Perfil,
   ...reportes,
   ...usuario,
   ...login,
   ...registro,
   ...perfil,
   ...entrega,
   ...staff_tipo,
   ...staff,
   ...intro,
   ...cliente,
   ...company,
   onLogin,
   trabajos,
   history,
   "history/detail": historyDetail,
   "invitationDetail": invitationDetail,
   "invitationUser": invitationUser,
   invitations,
   "sorry": sorry,
   ...token,
   "waiting": waiting,
   my_companys,
   event_in_progress,
   ...invitacion,
   "history/timesheet": historyTimeSheet,
   cd,
   cdboss

})
const Pages: SPageListProps = {
   ...NewPages,
   // "/": TestRicky,
   // "/": TestZoom,
   // '/': Carga,
   // 'inicio': Inicio,
   "inicio2": Inicio2,
   "ingreso": Ingreso,
   // 'test': Test,
   // 'evento/registro': Registro,
   'evento/qr': Qr,
   'ticket/entrada': Entrada,
   'ticket/reserva': Reserva,
   'carrito/confirmar': Confirmar,
   'carrito/mensajeCarritoVacio': MensajeCarritoVacio,
   'carrito/detalle': Detalle,
   'billetera/mistarjetas': Mistarjetas,
   'billetera/pagoTarjeta': PagoTarjeta,
   'billetera/mensajePedidoExitoso': MensajePedidoExitoso,
   'billetera/mensajePedidoFueraTiempo': MensajePedidoFueraTiempo,
   "billetera/mensajePedidoError": MensajePedidoError,
   'billetera/mensajeCargando': MensajeCargando,
   'mensajeIniciarSesion': MensajeIniciarSesion,
   'reservas': Reservas,
   'admin': Administracion,
   'carga': Carga,
   'terminos': TerminosCondiciones,
   'privacy': TerminosCondiciones,
   'cargandoqr': CargandoQr,
   'errorqr': ErrorQr,
   "planimetria": Planimetria,
   "testQr": TestQr,
   // "history/reporte": reporte_total,

   ...Services.Pages,
};

export default Pages;

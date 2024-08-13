import { SPageListProps } from 'servisofts-component';
import actividad from './Components/actividad';
import carrito from './Components/carrito';
import evento from './Components/evento';
import banner from './Components/banner';
import sector from './Components/sector';
import tipo_entrada from './Components/tipo_entrada';
import venta from './Components/venta';
import orden_pago from './Components/orden_pago';
import tarjeta from './Components/tarjeta';
import general from './Components/general';
import mesa from './Components/mesa';
import finanza from './Components/finanza';
import parametro from './Components/parametro';
import pasarela from './Components/pasarela';
const ServiceName = 'casagrandeadmin';

const Pages: SPageListProps = {
  ...evento.Pages,
  ...actividad.Pages,
  ...tipo_entrada.Pages,
  ...carrito.Pages,
  ...banner.Pages,
  ...sector.Pages,
  ...venta.Pages,
  ...orden_pago.Pages,
  ...tarjeta.Pages,
  ...mesa.Pages,
  ...finanza.Pages,
  ...parametro.Pages,
  ...pasarela.Pages

};

const Reducers = {
  ...evento.Reducers,
  ...actividad.Reducers,
  ...tipo_entrada.Reducers,
  ...carrito.Reducers,
  ...banner.Reducers,
  ...sector.Reducers,
  ...venta.Reducers,
  ...orden_pago.Reducers,
  ...tarjeta.Reducers,
  ...general.Reducers,
  ...mesa.Reducers,
  ...finanza.Reducers,
  ...parametro.Reducers,
  ...pasarela.Reducers

};

export default {
  ServiceName,
  Pages,
  Reducers
};

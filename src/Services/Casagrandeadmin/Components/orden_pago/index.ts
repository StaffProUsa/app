//  COMPONENT CONFIG
const component = 'orden_pago'; // COMPONENT NAME
const version = '1.0';
// ---------------------------------------
import Actions from './Actions';
import Reducer from './Reducer';
import VerificarOrden from './Pages/Verificar';


export default {
  component,
  version,
  Actions,
  Reducers: {
    [component + 'Reducer']: Reducer
  },
  Pages: {
    ['verificarOrden']: VerificarOrden,
  },
  Components: {}
};

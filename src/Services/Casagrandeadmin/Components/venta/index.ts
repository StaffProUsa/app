//  COMPONENT CONFIG
const component = 'venta'; // COMPONENT NAME
const version = '1.0';
// ---------------------------------------
import Actions from './Actions';
import Lista from './Pages/Lista';
import ListaDetalle from './Pages/ListaDetalle';
import Registro from './Pages/Registro';
import Test from './Pages/Test';
import Reducer from './Reducer';

export default {
  component,
  version,
  Actions,
  Reducers: {
    [component + 'Reducer']: Reducer
  },
  Pages: {
    ['admin/' + component]: Lista,
    ['admin/' + component + '/detalle']: ListaDetalle,
    ['admin/' + component + '/registro']: Registro,
    ['admin/' + component + '/test']: Test
  },
  Components: {}
};

//  COMPONENT CONFIG
const component = 'finanza'; // COMPONENT NAME
const version = '1.0';

import Actions from './Actions';
import Lista from './Pages/Lista';
import ListaDetalle from './Pages/ListaDetalle';
import Test from './Pages/Test';
// import Lista from './Pages/ListaDetalle';
// import Test from './Pages/Lista';
// import TestDetalle from './Pages/TestDetalle';
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
    ['admin/' + component + '/test']: Test
  },
  Components: {}
};

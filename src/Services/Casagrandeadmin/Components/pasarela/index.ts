//  COMPONENT CONFIG
const component = 'pasarela'; // COMPONENT NAME
const version = '1.0';
// ---------------------------------------
import Actions from './Actions';
import Lista from './Pages/Lista';
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
    ['admin/' + component + '/registro']: Registro,
    ['admin/' + component + '/test']: Test
  },
  Components: {}
};

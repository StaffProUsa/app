//  COMPONENT CONFIG
const component = 'usuarioRol'; // COMPONENT NAME
const version = '1.0';
// ---------------------------------------
import Actions from './Actions';
import Reducer from './Reducer';

import Lista from './Pages/Lista';

export default {
  component,
  version,
  Actions,
  Reducers: {
    [component + 'Reducer']: Reducer
  },
  Pages: {
    [component]: Lista,
    [component + '/lista']: Lista
  }
};

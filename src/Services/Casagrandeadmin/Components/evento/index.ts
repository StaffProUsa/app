//  COMPONENT CONFIG
const component = 'evento'; // COMPONENT NAME
const version = '1.0';
// ---------------------------------------
import Actions from './Actions';
import Lista from './Pages/Lista';
import ListaTabla from './Pages/ListaTabla';
import Registro from './Pages/Registro';
import Test from './Pages/Test';
import Perfil from './Pages/Perfil';
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
    ['admin/' + component + '/tabla']: ListaTabla,
    ['admin/' + component + '/registro']: Registro,
    ['admin/' + component + '/test']: Test,
    ['admin/' + component + '/perfil']: Perfil

  },
  Components: {}
};

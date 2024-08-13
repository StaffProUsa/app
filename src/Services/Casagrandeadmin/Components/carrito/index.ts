//  COMPONENT CONFIG
const component = 'carrito'; // COMPONENT NAME
const version = '1.0';
// ---------------------------------------
import Actions from './Actions';
import Reducer from './Reducer';

export default {
  component,
  version,
  Actions,
  Reducers: {
    [component + 'Reducer']: Reducer
  },
  Pages: {},
  Components: {}
};

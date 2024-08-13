//  COMPONENT CONFIG

export const component = 'datoCabecera'; // COMPONENT NAME
export const version = '1.0';
// ---------------------------------------
import Actions from './Actions';
import reducer from './reducer';
export default {
  component: component,
  version: version,
  Actions,
  Reducers: {
    [component + 'Reducer']: reducer
  }
};

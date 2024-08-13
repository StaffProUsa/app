import {SStorage} from 'servisofts-component';
import Parent from './index';

const initialState = {
  data: {}
};
export default (state: any, action: any) => {
  if (!state) {
    SStorage.getItem('carritoReducer', (resp) => {
      if (!resp) return;
      var obj = JSON.parse(resp);
      initialState.data = obj.data;
    });
    return initialState;
  }
  if (action.component != Parent.component) return state;
  switch (action.type) {
    case 'setState':
      SStorage.setItem('carritoReducer', JSON.stringify(state));
      state = {...state};
      break;
  }
  return state;
};

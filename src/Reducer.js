// import {combineReducers} from 'redux';
// import {SStorage} from 'servisofts-component';
// import Services from './Services';
// const reducers = combineReducers({
//   ...Services.Reducers
// });

// export default (state, action) => {
//   switch (action.type) {
//     case 'USUARIO_LOGOUT':
//       SStorage.removeItem('usr_log');
//       SStorage.removeItem('carritoReducer'); //datos carrito
//       state = undefined;
//       break;
//     case 'CARRITO_FINALIZAR':
//       SStorage.removeItem('carritoReducer'); //datos carrito
//       state = undefined;
//       break;
//     default:
//       break;
//   }
//   return reducers(state, action);
// };

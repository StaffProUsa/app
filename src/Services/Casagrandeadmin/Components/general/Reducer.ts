import Parent from './index';

type DataProps = {
  component: any;
  type: string;
  version?: any;
  estado?: 'exito' | 'cargando' | 'error';
  error: any;
  [key: string]: any;
};

const initialState = () => {
  return {
    component: Parent.component,
    version: Parent.version
  };
};
export default (state: any, action: DataProps) => {
  if (!state) return initialState();
  if (action.component != Parent.component) return state;
  // if (action.version != Parent.version) return state;
  TypesSwitch(state, action);
  state.type = action.type;
  state.estado = action.estado;
  state.error = action.error;
  state.lastSend = new Date();
  state = {...state};
  return state;
};

const TypesSwitch = (state: any, action: DataProps) => {
  switch (action.type) {
    case 'getAll':
      return getAll(state, action);
  }
};

const getAll = (state: any, action: DataProps) => {
  if (action.estado != 'exito') return;
  // state.data = action.data;
  console.log(action);
};

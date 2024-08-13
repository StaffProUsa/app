import Parent from './index';

type DataProps = {
  component: any;
  type: string;
  version?: any;
  estado?: 'exito' | 'cargando' | 'error' | "borrar";
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
  state = { ...state };
  return state;
};

const TypesSwitch = (state: any, action: DataProps) => {
  switch (action.type) {
    case 'getAll':
      return getAll(state, action);
    case 'getAllKeyEvento':
      return getAllKeyEvento(state, action);
    case 'registro':
      return registro(state, action);
    case 'editar':
      return editar(state, action);
    case 'editarAll':
      return editarAll(state, action);
    case 'getById':
      return getById(state, action);
  }
};

const getAll = (state: any, action: DataProps) => {
  if (action.estado != 'exito') return;
  state.data = action.data;
};
const getAllKeyEvento = (state: any, action: DataProps) => {
  if (action.estado != 'exito') return;
  state.data = action.data;
};
const registro = (state: any, action: DataProps) => {
  if (action.estado != 'exito') return;
  state.lastRegister = action.data;
  if (!state.data) return;
  if (!action.data[0]) {
    state.data[action.data.key] = action.data;
  } else {
    action.data.map((obj) => {
      state.data[obj.key] = obj;
    })
  }
};
const editar = (state: any, action: DataProps) => {
  if (action.estado != 'exito') return;
  if (!state.data) return;
  state.data[action.data.key] = action.data;
};
const editarAll = (state: any, action: DataProps) => {
  if (action.estado != 'exito' && action.estado != 'borrar') return;
  if (!state.data) return;
  if (action.data.length > 0) {
    action.data.map((mesa) => {
      if (!state.data[mesa.key]) return;
      if (action.estado == "borrar") {
        mesa.key_venta_detalle = "";

      }
      state.data[mesa.key] = { ...mesa };
      console.log(state.data[mesa.key])
    })
    console.log(state);
  }
};
const getById = (state: any, action: DataProps) => {
  if (action.estado != 'exito') return;
  state.data[action.data.key] = action.data;
};

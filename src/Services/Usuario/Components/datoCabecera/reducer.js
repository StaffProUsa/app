import Parent from './index';

const initialState = () => {
  return {
    component: Parent.component,
    version: Parent.version
  };
};
export default (state, action) => {
  if (!state) return initialState();
  if (action.component != Parent.component) return state;
  if (action.version != Parent.version) return state;
  Types(state, action);
  state.type = action.type;
  state.estado = action.estado;
  state.error = action.error;
  state.lastSend = new Date();
  state = {...state};
  return state;
};

const Types = () => {
  switch (action.type) {
  }
};

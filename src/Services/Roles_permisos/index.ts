import {SPageListProps} from 'servisofts-component';

const ServiceName = 'roles_permisos';

import rol from './Components/rol';
import usuarioPage from './Components/usuarioPage';
import usuarioRol from './Components/usuarioRol';
const Pages: SPageListProps = {
  ...usuarioPage.Pages,
  ...rol.Pages,
  ...usuarioRol.Pages
};

const Reducers = {
  ...usuarioPage.Reducers,
  ...rol.Reducers,
  ...usuarioRol.Reducers
};

const components = {
  rol,
  usuarioPage,
  usuarioRol
};
export default {
  components,
  ServiceName,
  Pages,
  Reducers
};

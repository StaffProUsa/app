// import Casagrande from './Casagrande';
import Usuario from './Usuario';
import Roles_permisos from './Roles_permisos';
import Casagrandeadmin from './Casagrandeadmin';

const Pages = {
  // ...Roles_permisos.Pages,
  // ...Casagrande.Pages,
  ...Casagrandeadmin.Pages,
  ...Usuario.Pages,

};

const Reducers = {
  ...Roles_permisos.Reducers,
  // ...Casagrande.Reducers,
  ...Casagrandeadmin.Reducers,
  // ...Usuario.Reducers,

};

export default {
  Pages,
  Reducers
};

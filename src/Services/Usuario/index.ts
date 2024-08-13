import {SPageListProps} from 'servisofts-component';

const ServiceName = 'usuario';

import datoCabecera from './Components/datoCabecera';
import usuario from './Components/usuario';

const Pages: SPageListProps = {
  ...usuario.Pages
};

const Reducers = {
  // "login": Login,
  ...usuario.Reducers,
  ...datoCabecera.Reducers
};

export default {
  ServiceName,
  Pages,
  Reducers
};

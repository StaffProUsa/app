

import Actividad, { ReactComponent as ActividadW } from './actividad.svg';
import TipoEntrada, { ReactComponent as TipoEntradaW } from './tipoEntrada.svg';
import Sector, { ReactComponent as SectorW } from './sector.svg';
import PerfilEvent, { ReactComponent as PerfilEventW } from './perfilEvent.svg';
import Planimetria, { ReactComponent as PlanimetriaW } from './planimetria.svg';
import ubicacionesA, { ReactComponent as ubicacionesW } from './ubicaciones.svg';
import staffTipoA, { ReactComponent as staffTipoW } from './staffTipo.svg';
import eventA, { ReactComponent as eventW } from './event.svg';
import usuariosA, { ReactComponent as usuariosW } from './usuarios.svg';

const Assets = {
	"Actividad": { Native: Actividad, Web: ActividadW },
	"TipoEntrada": { Native: TipoEntrada, Web: TipoEntradaW },
	"Sector": { Native: Sector, Web: SectorW },
	"PerfilEvent": { Native: PerfilEvent, Web: PerfilEventW },
	"Planimetria": { Native: Planimetria, Web: PlanimetriaW },
	"ubicacionesA": { Native: ubicacionesA, Web: ubicacionesW },
	"staffTipoA": { Native: staffTipoA, Web: staffTipoW },
	"eventA": { Native: eventA, Web: eventW },
	"usuariosA": { Native: usuariosA, Web: usuariosW },
}

export default Assets;
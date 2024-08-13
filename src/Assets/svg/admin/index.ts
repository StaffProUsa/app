

import Actividad, { ReactComponent as ActividadW } from './actividad.svg';
import TipoEntrada, { ReactComponent as TipoEntradaW } from './tipoEntrada.svg';
import Sector, { ReactComponent as SectorW } from './sector.svg';
import PerfilEvent, { ReactComponent as PerfilEventW } from './perfilEvent.svg';
import Planimetria, { ReactComponent as PlanimetriaW } from './planimetria.svg';

const Assets = {
	"Actividad": { Native: Actividad, Web: ActividadW },
	"TipoEntrada": { Native: TipoEntrada, Web: TipoEntradaW },
	"Sector": { Native: Sector, Web: SectorW },
	"PerfilEvent": { Native: PerfilEvent, Web: PerfilEventW },
	"Planimetria": { Native: Planimetria, Web: PlanimetriaW },
}

export default Assets;
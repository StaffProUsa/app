import { web } from 'webpack';
import man, { ReactComponent as manW } from './man.svg';
import woman, { ReactComponent as womanW } from './woman.svg';
import foto, { ReactComponent as fotoW } from './foto.svg';
import cumple, { ReactComponent as cumpleW } from './cumple.svg';
import direccion, { ReactComponent as direccionW } from './direccion.svg';
import empleado, { ReactComponent as empleadoW } from './empleado.svg';
import estadoCivil, { ReactComponent as estadoCivilW } from './estadoCivil.svg';
import lenguaje, { ReactComponent as lenguajeW } from './lenguaje.svg';




const Assets = {
	"man": { Native: man, Web: manW },
	"woman": { Native : woman, web: womanW },
	"foto": { Native: foto, Web: fotoW },
	"cumple": { Native: cumple, Web: cumpleW },
	"direccion": { Native: direccion, Web: direccionW },
	"empleado": { Native: empleado, Web: empleadoW },
	"estadoCivil": { Native: estadoCivil, Web: estadoCivilW },
	"lenguaje": { Native: lenguaje, Web: lenguajeW }
}

export default Assets;
import { web } from 'webpack';
import man, { ReactComponent as manW } from './man.svg';
import woman, { ReactComponent as womanW } from './woman.svg';
import foto, { ReactComponent as fotoW } from './foto.svg';



const Assets = {
	"man": { Native: man, Web: manW },
	"woman": { Native : woman, web: womanW },
	"foto": { Native: foto, Web: fotoW },

}

export default Assets;
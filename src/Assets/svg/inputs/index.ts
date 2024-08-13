

import InputDocument, { ReactComponent as InputDocumentW } from './inputDocument.svg';
import InputEmail, { ReactComponent as InputEmailW } from './inputEmail.svg';
import InputPhone, { ReactComponent as InputPhoneW } from './inputPhone.svg';
import InputUser, { ReactComponent as InputUserW } from './inputUser.svg';

import IconBtnMinus, { ReactComponent as IconBtnMinusW } from './iconBtnMinus.svg';
import IconBtnPlus, { ReactComponent as IconBtnPlusW } from './iconBtnPlus.svg';
import AddFoto, { ReactComponent as AddFotoW } from './addFoto.svg';

import DeleteCars, { ReactComponent as DeleteCarsW } from './deleteCars.svg';
import List, { ReactComponent as ListW } from './list.svg';
import eventos, { ReactComponent as eventosW } from './eventos.svg';

const Assets = {
	"InputDocument": { Native: InputDocument, Web: InputDocumentW },
	"InputEmail": { Native: InputEmail, Web: InputEmailW },
	"InputPhone": { Native: InputPhone, Web: InputPhoneW },
	"InputUser": { Native: InputUser, Web: InputUserW },
	"IconBtnMinus": { Native: IconBtnMinus, Web: IconBtnMinusW },
	"IconBtnPlus": { Native: IconBtnPlus, Web: IconBtnPlusW },
	"AddFoto": { Native: AddFoto, Web: AddFotoW },
	"DeleteCars": { Native: DeleteCars, Web: DeleteCarsW },
	"List": { Native: List, Web: ListW },
	"eventos": { Native: eventos, Web: eventosW },

}

export default Assets;